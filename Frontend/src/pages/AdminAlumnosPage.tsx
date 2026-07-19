import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import NavigateBeforeOutlinedIcon from "@mui/icons-material/NavigateBeforeOutlined";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import LocalFireDepartmentOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";

import {
  eliminarAlumno,
  obtenerAlumno,
  obtenerAlumnos,
} from "../services/AdminAlumno.Service";

import type { Alumno } from "../types";

import FullScreenLoading from "../components/FullScreenSpinner";
import TopBar from "../components/navigation/DashboardTopBar";
import AlumnoDetalleModal from "../components/admin/Alumnos/AlumnoDetalleModal";

type FiltroAlumnos =
  | "todos"
  | "estado-activo"
  | "estado-inactivo"
  | "estado-bloqueado"
  | "bloqueados-inasistencias"
  | "bloqueados-deuda"
  | "cuotas-pendientes"
  | "racha-alta";

const OPCIONES_POR_PAGINA = [10, 20, 50];

export default function AdminAlumnosPage() {
  const [searchParams] = useSearchParams();

  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [loading, setLoading] = useState(true);
  const [detalle, setDetalle] = useState<Alumno | null>(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [alumnoAEliminar, setAlumnoAEliminar] =
    useState<Alumno | null>(null);
  const [eliminando, setEliminando] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] =
    useState<FiltroAlumnos>("todos");
  const [menuAbiertoId, setMenuAbiertoId] =
    useState<number | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [porPagina, setPorPagina] = useState(10);

  /*
   * CARGAR ALUMNOS
   */

  const cargarDatos = async () => {
    try {
      setLoading(true);

      const data = await obtenerAlumnos();

      setAlumnos(Array.isArray(data) ? data : []);
    } catch (error: any) {
      if (!error?.response || error.response.status >= 500) {
        console.error("[Cargar alumnos]", error);
      }

      toast.error(
        error?.response?.data?.mensaje ??
          "No fue posible cargar los alumnos",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void cargarDatos();
  }, []);

  /*
   * FILTRO RECIBIDO POR URL
   */

  useEffect(() => {
    const filtroUrl = searchParams.get("filtro");

    switch (filtroUrl) {
      case "cuotas-pendientes":
        setFiltro("cuotas-pendientes");
        break;

      case "bloqueados":
        setFiltro("bloqueados-inasistencias");
        break;

      case "deuda":
        setFiltro("bloqueados-deuda");
        break;

      case "racha":
        setFiltro("racha-alta");
        break;

      default:
        break;
    }
  }, [searchParams]);

  /*
   * VOLVER A PÁGINA 1 AL FILTRAR
   */

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtro, porPagina]);

  /*
   * VER DETALLE
   */

  const verDetalle = async (alumnoId: number) => {
    try {
      setCargandoDetalle(true);

      setMenuAbiertoId(null);

      const data = await obtenerAlumno(alumnoId);

      setDetalle(data);
    } catch (error: any) {
      if (!error?.response || error.response.status >= 500) {
        console.error("[Detalle alumno]", error);
      }

      toast.error(
        error?.response?.data?.mensaje ??
          "No fue posible obtener el detalle del alumno",
      );
    } finally {
      setCargandoDetalle(false);
    }
  };

  /*
   * ELIMINAR ALUMNO
   */

  const confirmarEliminar = async () => {
    if (!alumnoAEliminar) return;

    try {
      setEliminando(true);

      await eliminarAlumno(alumnoAEliminar.id);

      toast.success("Alumno eliminado correctamente");

      setAlumnoAEliminar(null);

      await cargarDatos();
    } catch (error: any) {
      if (!error?.response || error.response.status >= 500) {
        console.error("[Eliminar alumno]", error);
      }

      toast.error(
        error?.response?.data?.mensaje ??
          "No fue posible eliminar el alumno",
      );
    } finally {
      setEliminando(false);
    }
  };

  /*
   * FILTRADO
   */

  const alumnosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return alumnos
      .filter((alumno) => {
        if (!coincideFiltro(alumno, filtro)) {
          return false;
        }

        if (!termino) {
          return true;
        }

        /*
         * También permitimos buscar por el estado visual real.
         */

        const estadoVisual = obtenerEstadoVisual(alumno);

        return [
          alumno.nombre,
          alumno.apellido,
          alumno.email,
          alumno.estado,
          estadoVisual,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(termino);
      })
      .sort((a, b) =>
        `${a.nombre ?? ""} ${a.apellido ?? ""}`.localeCompare(
          `${b.nombre ?? ""} ${b.apellido ?? ""}`,
          "es",
        ),
      );
  }, [alumnos, busqueda, filtro]);

  /*
   * PAGINACIÓN
   */

  const totalPaginas = Math.max(
    1,
    Math.ceil(alumnosFiltrados.length / porPagina),
  );

  const paginaSegura = Math.min(
    paginaActual,
    totalPaginas,
  );

  const inicio =
    (paginaSegura - 1) * porPagina;

  const fin = Math.min(
    inicio + porPagina,
    alumnosFiltrados.length,
  );

  const alumnosPagina =
    alumnosFiltrados.slice(inicio, fin);

  /*
   * RESUMEN
   */

  const resumen = useMemo(() => {
    /*
     * Un alumno solamente cuenta como activo
     * si su estado es ACTIVO y no tiene ningún bloqueo.
     */

    const activos = alumnos.filter(
      (alumno) =>
        alumno.estado?.toUpperCase() === "ACTIVO" &&
        !estaBloqueado(alumno),
    ).length;

    const bloqueados = alumnos.filter(
      (alumno) => estaBloqueado(alumno),
    ).length;

    const cuotasPendientes = alumnos.filter(
      (alumno) =>
        obtenerCuotasPendientes(alumno) > 0,
    ).length;

    const promedioRacha =
      alumnos.length === 0
        ? 0
        : Math.round(
            alumnos.reduce(
              (total, alumno) =>
                total + obtenerRacha(alumno),
              0,
            ) / alumnos.length,
          );

    return {
      total: alumnos.length,
      activos,
      bloqueados,
      cuotasPendientes,
      promedioRacha,
    };
  }, [alumnos]);

  /*
   * LIMPIAR FILTROS
   */

  const limpiarFiltros = () => {
    setBusqueda("");
    setFiltro("todos");
  };

  /*
   * LOADING
   */

  if (loading) {
    return <FullScreenLoading />;
  }

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      <TopBar />

      <main className="mx-auto max-w-[1500px] px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        {/* CABECERA */}

        <section className="mb-8 rounded-3xl border border-[#4adea8]/20 bg-gradient-to-r from-[#1a2b24] to-[#163129] p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-wide text-[#4adea8]">
            Administración
          </p>

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            Alumnos
          </h1>

          <p className="mt-2 max-w-2xl text-gray-300">
            Gestioná alumnos, bloqueos, cuotas y actividad
            desde una vista preparada para crecer.
          </p>
        </section>

        {/* RESUMEN */}

        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <ResumenCard
            titulo="Total"
            valor={resumen.total}
            descripcion="Alumnos registrados"
            icono={<PeopleOutlineOutlinedIcon />}
          />

          <ResumenCard
            titulo="Activos"
            valor={resumen.activos}
            descripcion="Acceso habilitado"
            icono={<CheckCircleOutlineOutlinedIcon />}
          />

          <ResumenCard
            titulo="Bloqueados"
            valor={resumen.bloqueados}
            descripcion="Deuda o inasistencias"
            icono={<WarningAmberOutlinedIcon />}
          />

          <ResumenCard
            titulo="Con deuda"
            valor={resumen.cuotasPendientes}
            descripcion="Cuotas pendientes"
            icono={<PaymentsOutlinedIcon />}
          />

          <ResumenCard
            titulo="Promedio racha"
            valor={resumen.promedioRacha}
            descripcion="Asistencias mensuales"
            icono={<LocalFireDepartmentOutlinedIcon />}
          />
        </section>

        {/* FILTROS */}

        <section className="mb-8 rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-4 sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px_auto] lg:items-center">
            {/* BÚSQUEDA */}

            <div className="relative">
              <SearchOutlinedIcon
                sx={{
                  color: "#9ca3af",
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />

              <input
                value={busqueda}
                onChange={(event) =>
                  setBusqueda(event.target.value)
                }
                placeholder="Buscar por nombre, apellido, email o estado..."
                className="h-12 w-full rounded-2xl border border-[#2d463b] bg-[#12201b] pl-12 pr-12 outline-none transition-all focus:border-[#4adea8]"
              />

              {busqueda && (
                <button
                  type="button"
                  onClick={() => setBusqueda("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  aria-label="Limpiar búsqueda"
                >
                  <ClearOutlinedIcon fontSize="small" />
                </button>
              )}
            </div>

            {/* SELECT DE FILTROS */}

            <div className="relative">
              <FilterAltOutlinedIcon
                sx={{
                  color: "#9ca3af",
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              />

              <select
                value={filtro}
                onChange={(event) =>
                  setFiltro(
                    event.target.value as FiltroAlumnos,
                  )
                }
                className="h-12 w-full appearance-none rounded-2xl border border-[#2d463b] bg-[#12201b] pl-12 pr-4 outline-none transition-all focus:border-[#4adea8]"
              >
                <option value="todos">
                  Todos los alumnos
                </option>

                <optgroup label="Estado">
                  <option value="estado-activo">
                    Activos
                  </option>

                  <option value="estado-inactivo">
                    Inactivos
                  </option>

                  <option value="estado-bloqueado">
                    Bloqueados
                  </option>
                </optgroup>

                <optgroup label="Situación">
                  <option value="cuotas-pendientes">
                    Con cuotas pendientes
                  </option>

                  <option value="bloqueados-deuda">
                    Bloqueados por deuda
                  </option>

                  <option value="bloqueados-inasistencias">
                    Bloqueados por inasistencias
                  </option>

                  <option value="racha-alta">
                    Racha alta
                  </option>
                </optgroup>
              </select>
            </div>

            {/* LIMPIAR */}

            {(busqueda || filtro !== "todos") && (
              <button
                type="button"
                onClick={limpiarFiltros}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#2d463b] bg-[#12201b] px-4 font-semibold text-[#4adea8] hover:border-[#4adea8]"
              >
                <ClearOutlinedIcon fontSize="small" />

                Limpiar
              </button>
            )}
          </div>

          {/* CANTIDAD */}

          <div className="mt-4 flex flex-col gap-3 border-t border-[#2d463b] pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-400">
              {alumnosFiltrados.length === 0
                ? "No hay resultados"
                : `Mostrando ${inicio + 1}–${fin} de ${
                    alumnosFiltrados.length
                  } alumnos`}
            </p>

            <label className="flex items-center gap-2 text-sm text-gray-400">
              Mostrar

              <select
                value={porPagina}
                onChange={(event) =>
                  setPorPagina(
                    Number(event.target.value),
                  )
                }
                className="rounded-lg border border-[#2d463b] bg-[#12201b] px-3 py-2 text-white outline-none focus:border-[#4adea8]"
              >
                {OPCIONES_POR_PAGINA.map(
                  (opcion) => (
                    <option
                      key={opcion}
                      value={opcion}
                    >
                      {opcion}
                    </option>
                  ),
                )}
              </select>

              por página
            </label>
          </div>
        </section>

        {/* ESTADO VACÍO / TABLA */}

        {alumnos.length === 0 ? (
          <EstadoVacio
            titulo="No hay alumnos registrados"
            descripcion="Cuando se registren alumnos, aparecerán en esta pantalla."
          />
        ) : alumnosFiltrados.length === 0 ? (
          <EstadoVacio
            titulo="No se encontraron alumnos"
            descripcion="Probá cambiar la búsqueda o el filtro seleccionado."
          />
        ) : (
          <section className="overflow-visible rounded-3xl border border-[#2d463b] bg-[#1a2b24]">
            {/* CABECERA TABLA */}

            <header className="border-b border-[#2d463b] px-5 py-5 sm:px-6">
              <h2 className="text-2xl font-bold">
                Listado de alumnos
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Página {paginaSegura} de {totalPaginas}
              </p>
            </header>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">
                <thead className="bg-[#12201b] text-sm text-gray-400">
                  <tr>
                    <th className="px-6 py-4">
                      Alumno
                    </th>

                    <th className="px-6 py-4">
                      Situación financiera
                    </th>

                    <th className="px-6 py-4">
                      Actividad
                    </th>

                    <th className="px-6 py-4">
                      Estado y bloqueos
                    </th>

                    <th className="px-6 py-4 text-right">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {alumnosPagina.map((alumno) => {
                    const racha =
                      obtenerRacha(alumno);

                    const cuotas =
                      obtenerCuotasPendientes(alumno);

                    const clases =
                      obtenerClasesConfiables(alumno);

                    const bloqueadoDeuda =
                      Boolean(
                        alumno.bloqueadoPorDeuda,
                      );

                    const bloqueadoInasistencias =
                      Boolean(
                        alumno.bloqueadoPorInasistencias,
                      );

                    const bloqueado =
                      bloqueadoDeuda ||
                      bloqueadoInasistencias;

                    return (
                      <tr
                        key={alumno.id}
                        className="border-t border-[#2d463b] transition-all hover:bg-[#4adea8]/5"
                      >
                        {/* ALUMNO */}

                        <td className="min-w-[280px] px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#4adea8]/30 bg-[#4adea8]/10 font-bold text-[#4adea8]">
                              {iniciales(alumno)}
                            </div>

                            <div>
                              <p className="font-bold text-white">
                                {alumno.nombre}{" "}
                                {alumno.apellido}
                              </p>

                              <p className="text-sm text-gray-400">
                                {alumno.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* FINANZAS */}

                        <td className="min-w-[190px] px-6 py-4">
                          {cuotas > 0 ? (
                            <span className="inline-flex rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400">
                              {cuotas} cuota
                              {cuotas === 1 ? "" : "s"}{" "}
                              pendiente
                              {cuotas === 1 ? "" : "s"}
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full border border-[#4adea8]/30 bg-[#4adea8]/10 px-3 py-1 text-xs font-semibold text-[#4adea8]">
                              Al día
                            </span>
                          )}
                        </td>

                        {/* ACTIVIDAD */}

                        <td className="min-w-[190px] px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-300">
                              Racha {racha}
                            </span>

                            {clases !== null && (
                              <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
                                {clases} clase
                                {clases === 1 ? "" : "s"}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* ESTADO Y BLOQUEOS */}

                        <td className="min-w-[230px] px-6 py-4">
                          <div className="flex flex-wrap items-center gap-2">
                            {bloqueado ? (
                              <>
                                {/* ESTADO VISUAL BLOQUEADO */}

                                <span
                                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                                    bloqueadoDeuda
                                      ? "border-red-500/30 bg-red-500/10 text-red-400"
                                      : "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
                                  }`}
                                >
                                  BLOQUEADO
                                </span>

                                {/* MOTIVO DEUDA */}

                                {bloqueadoDeuda && (
                                  <span className="text-xs text-red-400">
                                    Por deuda
                                  </span>
                                )}

                                {/* MOTIVO INASISTENCIAS */}

                                {bloqueadoInasistencias && (
                                  <span className="text-xs text-yellow-300">
                                    Por inasistencias
                                  </span>
                                )}
                              </>
                            ) : (
                              <>
                                {/* ESTADO NORMAL */}

                                <span
                                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${obtenerEstadoClase(
                                    alumno.estado,
                                  )}`}
                                >
                                  {alumno.estado ??
                                    "Sin estado"}
                                </span>

                                <span className="text-xs text-gray-500">
                                  Sin bloqueos
                                </span>
                              </>
                            )}
                          </div>
                        </td>

                        {/* ACCIONES */}

                        <td className="relative min-w-[100px] px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setMenuAbiertoId(
                                (actual) =>
                                  actual === alumno.id
                                    ? null
                                    : alumno.id,
                              )
                            }
                            className="rounded-xl border border-[#2d463b] bg-[#12201b] px-4 py-2 text-xl leading-none hover:border-[#4adea8]"
                          >
                            ⋮
                          </button>

                          {menuAbiertoId ===
                            alumno.id && (
                            <div className="absolute right-6 top-14 z-30 w-52 overflow-hidden rounded-2xl border border-[#2d463b] bg-[#12201b] text-left shadow-2xl">
                              <button
                                type="button"
                                onClick={() =>
                                  void verDetalle(
                                    alumno.id,
                                  )
                                }
                                className="w-full px-4 py-3 text-sm text-white hover:bg-[#4adea8]/10"
                              >
                                Ver detalle
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setAlumnoAEliminar(
                                    alumno,
                                  );

                                  setMenuAbiertoId(
                                    null,
                                  );
                                }}
                                className="w-full border-t border-[#2d463b] px-4 py-3 text-sm text-red-400 hover:bg-red-500/10"
                              >
                                Eliminar alumno
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* PAGINACIÓN */}

            <Paginacion
              paginaActual={paginaSegura}
              totalPaginas={totalPaginas}
              onCambiar={setPaginaActual}
            />
          </section>
        )}
      </main>

      {/* LOADING DETALLE */}

      {cargandoDetalle && (
        <FullScreenLoading />
      )}

      {/* MODAL DETALLE */}

      <AlumnoDetalleModal
        alumno={detalle}
        onCerrar={() => setDetalle(null)}
      />

      {/* MODAL ELIMINAR */}

      {alumnoAEliminar && (
        <EliminarAlumnoModal
          alumno={alumnoAEliminar}
          eliminando={eliminando}
          onCancelar={() =>
            setAlumnoAEliminar(null)
          }
          onConfirmar={confirmarEliminar}
        />
      )}
    </div>
  );
}

/*
 * TARJETA RESUMEN
 */

function ResumenCard({
  titulo,
  valor,
  descripcion,
  icono,
}: {
  titulo: string;
  valor: number;
  descripcion: string;
  icono: React.ReactNode;
}) {
  return (
    <article className="rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-5">
      <div className="text-[#4adea8]">
        {icono}
      </div>

      <p className="mt-4 text-sm text-gray-400">
        {titulo}
      </p>

      <p className="mt-1 text-3xl font-bold">
        {valor}
      </p>

      <p className="mt-2 text-xs text-gray-500">
        {descripcion}
      </p>
    </article>
  );
}

/*
 * PAGINACIÓN
 */

function Paginacion({
  paginaActual,
  totalPaginas,
  onCambiar,
}: {
  paginaActual: number;
  totalPaginas: number;
  onCambiar: (pagina: number) => void;
}) {
  const paginas = obtenerPaginasVisibles(
    paginaActual,
    totalPaginas,
  );

  return (
    <footer className="flex flex-col gap-4 border-t border-[#2d463b] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="text-sm text-gray-400">
        Página {paginaActual} de {totalPaginas}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={paginaActual === 1}
          onClick={() =>
            onCambiar(paginaActual - 1)
          }
          className="flex h-10 items-center gap-1 rounded-xl border border-[#2d463b] bg-[#12201b] px-3 text-sm font-semibold disabled:opacity-40"
        >
          <NavigateBeforeOutlinedIcon fontSize="small" />

          Anterior
        </button>

        {paginas.map(
          (pagina, indice) =>
            pagina === "..." ? (
              <span
                key={`ellipsis-${indice}`}
                className="px-2 text-gray-500"
              >
                …
              </span>
            ) : (
              <button
                key={pagina}
                type="button"
                onClick={() =>
                  onCambiar(pagina)
                }
                className={`h-10 min-w-10 rounded-xl border px-3 text-sm font-semibold ${
                  paginaActual === pagina
                    ? "border-[#4adea8] bg-[#4adea8] text-[#12201b]"
                    : "border-[#2d463b] bg-[#12201b] text-gray-300"
                }`}
              >
                {pagina}
              </button>
            ),
        )}

        <button
          type="button"
          disabled={
            paginaActual === totalPaginas
          }
          onClick={() =>
            onCambiar(paginaActual + 1)
          }
          className="flex h-10 items-center gap-1 rounded-xl border border-[#2d463b] bg-[#12201b] px-3 text-sm font-semibold disabled:opacity-40"
        >
          Siguiente

          <NavigateNextOutlinedIcon fontSize="small" />
        </button>
      </div>
    </footer>
  );
}

/*
 * MODAL ELIMINAR
 */

function EliminarAlumnoModal({
  alumno,
  eliminando,
  onCancelar,
  onConfirmar,
}: {
  alumno: Alumno;
  eliminando: boolean;
  onCancelar: () => void;
  onConfirmar: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4">
      <section className="w-full max-w-lg rounded-3xl border border-red-500/30 bg-[#1a2b24] p-7 shadow-2xl">
        <h2 className="text-2xl font-bold">
          Eliminar alumno
        </h2>

        <p className="mt-2 text-gray-400">
          ¿Seguro que querés eliminar a{" "}
          <strong className="text-white">
            {alumno.nombre} {alumno.apellido}
          </strong>
          ? Esta acción no se puede deshacer.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancelar}
            disabled={eliminando}
            className="rounded-xl border border-[#2d463b] bg-[#12201b] px-5 py-3 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirmar}
            disabled={eliminando}
            className="rounded-xl bg-red-500 px-5 py-3 font-bold text-white disabled:opacity-50"
          >
            {eliminando
              ? "Eliminando..."
              : "Eliminar"}
          </button>
        </div>
      </section>
    </div>
  );
}

/*
 * ESTADO VACÍO
 */

function EstadoVacio({
  titulo,
  descripcion,
}: {
  titulo: string;
  descripcion: string;
}) {
  return (
    <section className="rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-10 text-center">
      <h2 className="text-2xl font-bold">
        {titulo}
      </h2>

      <p className="mt-2 text-gray-400">
        {descripcion}
      </p>
    </section>
  );
}

/*
 * SABER SI UN ALUMNO ESTÁ BLOQUEADO
 */

function estaBloqueado(alumno: Alumno) {
  return Boolean(
    alumno.bloqueadoPorDeuda ||
      alumno.bloqueadoPorInasistencias,
  );
}

/*
 * ESTADO VISUAL REAL
 */

function obtenerEstadoVisual(
  alumno: Alumno,
) {
  if (estaBloqueado(alumno)) {
    return "BLOQUEADO";
  }

  return (
    alumno.estado?.toUpperCase() ??
    "SIN ESTADO"
  );
}

/*
 * FILTROS
 */

function coincideFiltro(
  alumno: Alumno,
  filtro: FiltroAlumnos,
) {
  const estado =
    alumno.estado?.toUpperCase();

  const bloqueado =
    estaBloqueado(alumno);

  switch (filtro) {
    case "estado-activo":
      return (
        estado === "ACTIVO" &&
        !bloqueado
      );

    case "estado-inactivo":
      return (
        estado === "INACTIVO" &&
        !bloqueado
      );

    case "estado-bloqueado":
      return bloqueado;

    case "bloqueados-inasistencias":
      return Boolean(
        alumno.bloqueadoPorInasistencias,
      );

    case "bloqueados-deuda":
      return Boolean(
        alumno.bloqueadoPorDeuda,
      );

    case "cuotas-pendientes":
      return (
        obtenerCuotasPendientes(alumno) >
        0
      );

    case "racha-alta":
      return obtenerRacha(alumno) >= 5;

    default:
      return true;
  }
}

/*
 * RACHA
 */

function obtenerRacha(alumno: Alumno) {
  return (
    alumno.rachaAsistenciaMensual ??
    alumno.rachaMensual ??
    0
  );
}

/*
 * CLASES
 */

function obtenerClasesConfiables(
  alumno: Alumno,
) {
  if (
    typeof alumno.clasesInscriptas ===
    "number"
  ) {
    return alumno.clasesInscriptas;
  }

  if (
    typeof alumno.cantidadClasesInscripto ===
    "number"
  ) {
    return alumno.cantidadClasesInscripto;
  }

  return null;
}

/*
 * CUOTAS PENDIENTES
 */

function obtenerCuotasPendientes(
  alumno: Alumno,
) {
  return alumno.cuotasPendientes ?? 0;
}

/*
 * COLOR DEL ESTADO
 */

function obtenerEstadoClase(
  estado?: string,
) {
  switch (estado?.toUpperCase()) {
    case "ACTIVO":
      return "bg-[#4adea8]/10 text-[#4adea8] border-[#4adea8]/30";

    case "BLOQUEADO":
      return "bg-yellow-500/10 text-yellow-300 border-yellow-500/30";

    case "INACTIVO":
      return "bg-gray-500/10 text-gray-300 border-gray-500/30";

    default:
      return "bg-[#12201b] text-gray-300 border-[#2d463b]";
  }
}

/*
 * INICIALES
 */

function iniciales(alumno: Alumno) {
  return `${alumno.nombre?.charAt(0) ?? ""}${
    alumno.apellido?.charAt(0) ?? ""
  }`.toUpperCase();
}

/*
 * PÁGINAS VISIBLES
 */

function obtenerPaginasVisibles(
  paginaActual: number,
  totalPaginas: number,
): Array<number | "..."> {
  if (totalPaginas <= 7) {
    return Array.from(
      {
        length: totalPaginas,
      },
      (_, indice) => indice + 1,
    );
  }

  if (paginaActual <= 4) {
    return [
      1,
      2,
      3,
      4,
      5,
      "...",
      totalPaginas,
    ];
  }

  if (
    paginaActual >=
    totalPaginas - 3
  ) {
    return [
      1,
      "...",
      totalPaginas - 4,
      totalPaginas - 3,
      totalPaginas - 2,
      totalPaginas - 1,
      totalPaginas,
    ];
  }

  return [
    1,
    "...",
    paginaActual - 1,
    paginaActual,
    paginaActual + 1,
    "...",
    totalPaginas,
  ];
}