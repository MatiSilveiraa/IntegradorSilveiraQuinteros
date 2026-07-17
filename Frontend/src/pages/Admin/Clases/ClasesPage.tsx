import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";

import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";

import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SportsOutlinedIcon from "@mui/icons-material/SportsOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import TopBar from "../../../components/navigation/DashboardTopBar";
import FullScreenLoading from "../../../components/FullScreenSpinner";
import ClassLocationMap from "../../../components/maps/ClassLocationMap";

import {
  cambiarEstadoClase,
  eliminarClase,
  obtenerClases,
} from "../../../services/Clase.Service";

import type { Clase, EstadoClaseValor } from "../../../types";

type FiltroTipo = "todas" | "fijas" | "eventuales";

type ClaseConOcurrencia = Clase & {
  fechaOcurrencia: string;
};

const DIAS_ORDENADOS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
] as const;

export default function ClasesPage() {
  const navigate = useNavigate();

  const [clases, setClases] = useState<Clase[]>([]);
  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] = useState(false);

  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>("todas");

  const [diasAbiertos, setDiasAbiertos] = useState<Record<string, boolean>>({});

  const [menuClaseId, setMenuClaseId] = useState<number | null>(null);

  const [claseAEliminar, setClaseAEliminar] = useState<Clase | null>(null);
  const [eliminando, setEliminando] = useState(false);

  const [claseUbicacion, setClaseUbicacion] = useState<Clase | null>(null);

  const [claseEstado, setClaseEstado] = useState<Clase | null>(null);
  const [nuevoEstado, setNuevoEstado] = useState<EstadoClaseValor>(0);
  const [motivoEstado, setMotivoEstado] = useState("");
  const [cambiandoEstado, setCambiandoEstado] = useState(false);

  const cargarClases = async (mostrarCargaCompleta = true) => {
    try {
      if (mostrarCargaCompleta) {
        setLoading(true);
      } else {
        setActualizando(true);
      }

      const data = await obtenerClases();

      setClases(Array.isArray(data) ? data : []);
    } catch (error: any) {
      if (!error?.response || error.response.status >= 500) {
        console.error("[Cargar clases]", error);
      }

      toast.error(
        error?.response?.data?.mensaje ?? "No se pudieron cargar las clases",
      );
    } finally {
      setLoading(false);
      setActualizando(false);
    }
  };

  useEffect(() => {
    void cargarClases();
  }, []);

  const clasesFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return clases
      .filter((clase) => {
        if (filtroTipo === "fijas" && !clase.esFija) {
          return false;
        }

        if (filtroTipo === "eventuales" && clase.esFija) {
          return false;
        }

        if (!termino) {
          return true;
        }

        return [
          obtenerNombreGrupo(clase),
          clase.diaSemana,
          clase.estado,
          clase.entrenadorNombre,
          ...(clase.entrenadores ?? []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(termino);
      })
      .sort(compararClases);
  }, [clases, busqueda, filtroTipo]);

  const clasesAgrupadas = useMemo(() => {
    const grupos = new Map<string, Map<string, ClaseConOcurrencia[]>>();

    DIAS_ORDENADOS.forEach((dia) => {
      grupos.set(dia, new Map());
    });

    const hoy = obtenerFechaActualUruguay();
    const finRango = sumarDias(hoy, 28);

    clasesFiltradas.forEach((clase) => {
      const dia = normalizarDia(clase.diaSemana);

      let fechasOcurrencia: string[] = [];

      if (clase.esFija) {
        fechasOcurrencia = generarOcurrenciasRecurrentes(clase, hoy, finRango);
      } else {
        const fechaPuntual = clase.fechaInicio?.substring(0, 10);

        if (fechaPuntual) {
          fechasOcurrencia = [fechaPuntual];
        }
      }

      fechasOcurrencia.forEach((fecha) => {
        const fechasDelDia =
          grupos.get(dia) ?? new Map<string, ClaseConOcurrencia[]>();

        const clasesFecha = fechasDelDia.get(fecha) ?? [];

        clasesFecha.push({
          ...clase,
          fechaOcurrencia: fecha,
        });

        fechasDelDia.set(fecha, clasesFecha);
        grupos.set(dia, fechasDelDia);
      });
    });

    grupos.forEach((fechas) => {
      fechas.forEach((lista) => {
        lista.sort(compararClases);
      });
    });

    return grupos;
  }, [clasesFiltradas]);

  useEffect(() => {
    const inicial: Record<string, boolean> = {};

    DIAS_ORDENADOS.forEach((dia) => {
      const fechasDia = clasesAgrupadas.get(dia);

      const cantidadClases = fechasDia
        ? Array.from(fechasDia.values()).reduce(
            (total, lista) => total + lista.length,
            0,
          )
        : 0;

      if (cantidadClases > 0) {
        inicial[dia] = true;
      }
    });

    setDiasAbiertos((actual) => ({
      ...inicial,
      ...actual,
    }));
  }, [clasesAgrupadas]);
  const resumen = useMemo(() => {
    return {
      total: clases.length,
      programadas: clases.filter(
        (clase) => clase.estado?.toUpperCase() === "PROGRAMADA",
      ).length,
      recurrentes: clases.filter((clase) => clase.esFija).length,
      puntuales: clases.filter((clase) => !clase.esFija).length,
    };
  }, [clases]);

  const abrirModalEstado = (clase: Clase) => {
    setMenuClaseId(null);
    setClaseEstado(clase);
    setNuevoEstado(obtenerValorEstado(clase.estado));
    setMotivoEstado("");
  };

  const confirmarCambiarEstado = async () => {
    if (!claseEstado) return;

    try {
      setCambiandoEstado(true);

      await cambiarEstadoClase(claseEstado.id, {
        estado: nuevoEstado,
        motivo: motivoEstado.trim() || undefined,
      });

      toast.success("Estado de clase actualizado correctamente");

      setClaseEstado(null);
      setMotivoEstado("");

      await cargarClases(false);
    } catch (error: any) {
      if (!error?.response || error.response.status >= 500) {
        console.error("[Cambiar estado clase]", error);
      }

      toast.error(
        error?.response?.data?.mensaje ?? "No se pudo cambiar el estado",
      );
    } finally {
      setCambiandoEstado(false);
    }
  };

  const confirmarEliminar = async () => {
    if (!claseAEliminar) return;

    try {
      setEliminando(true);

      await eliminarClase(claseAEliminar.id);

      toast.success("Clase eliminada correctamente");

      setClaseAEliminar(null);

      await cargarClases(false);
    } catch (error: any) {
      if (!error?.response || error.response.status >= 500) {
        console.error("[Eliminar clase]", error);
      }

      toast.error(
        error?.response?.data?.mensaje ?? "No se pudo eliminar la clase",
      );
    } finally {
      setEliminando(false);
    }
  };

  const alternarDia = (dia: string) => {
    setDiasAbiertos((actual) => ({
      ...actual,
      [dia]: !(actual[dia] ?? true),
    }));
  };

  if (loading) {
    return <FullScreenLoading />;
  }

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      <TopBar />

      <main className="mx-auto w-full max-w-[1500px] px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <button
            type="button"
            disabled={actualizando}
            onClick={() => void cargarClases(false)}
            className="inline-flex h-10 w-fit items-center gap-2 rounded-xl border border-[#2d463b] bg-[#1a2b24] px-4 text-sm font-semibold text-gray-300 transition-all hover:border-[#4adea8] hover:text-[#4adea8] disabled:opacity-50"
          >
            <RefreshOutlinedIcon
              fontSize="small"
              className={actualizando ? "animate-spin" : ""}
            />

            {actualizando ? "Actualizando..." : "Actualizar"}
          </button>
        </div>

        <section className="mb-8 rounded-3xl border border-[#4adea8]/20 bg-gradient-to-r from-[#1a2b24] to-[#163129] p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#4adea8]">
                Administración
              </p>

              <h1 className="mt-2 text-3xl font-bold md:text-4xl">
                Gestionar clases
              </h1>

              <p className="mt-2 max-w-3xl text-gray-300">
                Vista compacta organizada por día y horario, con acciones
                secundarias dentro de un único menú.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/admin/clases/nueva")}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#4adea8] px-5 font-bold text-[#12201b] transition-all hover:brightness-110"
            >
              <AddOutlinedIcon fontSize="small" />
              Nueva clase
            </button>
          </div>
        </section>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ResumenCard
            titulo="Total clases"
            valor={resumen.total}
            icono={<CalendarMonthOutlinedIcon />}
          />

          <ResumenCard
            titulo="Programadas"
            valor={resumen.programadas}
            icono={<SportsOutlinedIcon />}
          />

          <ResumenCard
            titulo="Recurrentes"
            valor={resumen.recurrentes}
            icono={<RefreshOutlinedIcon />}
          />

          <ResumenCard
            titulo="Puntuales"
            valor={resumen.puntuales}
            icono={<CalendarMonthOutlinedIcon />}
          />
        </section>

        <section className="mb-8 rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-4 sm:p-5">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
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
                type="text"
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                placeholder="Buscar por grupo, día, entrenador o estado..."
                className="h-12 w-full rounded-2xl border border-[#2d463b] bg-[#12201b] pl-12 pr-4 outline-none transition-all focus:border-[#4adea8]"
              />
            </div>

            <select
              value={filtroTipo}
              onChange={(event) =>
                setFiltroTipo(event.target.value as FiltroTipo)
              }
              className="h-12 rounded-2xl border border-[#2d463b] bg-[#12201b] px-4 outline-none transition-all focus:border-[#4adea8]"
            >
              <option value="todas">Todas las clases</option>
              <option value="fijas">Solo recurrentes</option>
              <option value="eventuales">Solo puntuales</option>
            </select>
          </div>

          <p className="mt-4 border-t border-[#2d463b] pt-4 text-sm text-gray-400">
            {clasesFiltradas.length}{" "}
            {clasesFiltradas.length === 1
              ? "clase encontrada"
              : "clases encontradas"}
          </p>
        </section>

        {clases.length === 0 ? (
          <EstadoVacio
            titulo="No hay clases registradas"
            descripcion="Creá la primera clase para comenzar a organizar los horarios."
            accionTexto="Crear clase"
            onAccion={() => navigate("/admin/clases/nueva")}
          />
        ) : clasesFiltradas.length === 0 ? (
          <EstadoVacio
            titulo="No se encontraron clases"
            descripcion="Probá cambiar la búsqueda o el filtro seleccionado."
          />
        ) : (
          <div className="space-y-5">
            {DIAS_ORDENADOS.map((dia) => {
             const fechasDia =
  clasesAgrupadas.get(dia) ??
  new Map<string, ClaseConOcurrencia[]>();

              const cantidadClases = Array.from(fechasDia.values()).reduce(
                (total, lista) => total + lista.length,
                0,
              );

              if (cantidadClases === 0) {
                return null;
              }

              const abierto = diasAbiertos[dia] ?? true;

              return (
                <section
                  key={dia}
                  className="overflow-visible rounded-3xl border border-[#2d463b] bg-[#1a2b24]"
                >
                  <button
                    type="button"
                    onClick={() => alternarDia(dia)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
                  >
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wide text-[#4adea8]">
                        Día de la semana
                      </p>

                      <div className="mt-1 flex items-center gap-3">
                        <h2 className="text-2xl font-bold">{dia}</h2>

                        <span className="rounded-full border border-[#4adea8]/30 bg-[#4adea8]/10 px-3 py-1 text-xs font-bold text-[#4adea8]">
                          {cantidadClases}
                        </span>
                      </div>
                    </div>

                    {abierto ? (
                      <ExpandLessOutlinedIcon />
                    ) : (
                      <ExpandMoreOutlinedIcon />
                    )}
                  </button>

                  {abierto && (
                    <div className="border-t border-[#2d463b]">
                      {Array.from(fechasDia.entries())
                        .sort(([fechaA], [fechaB]) =>
                          fechaA.localeCompare(fechaB),
                        )
                        .map(([fecha, clasesFecha]) => (
                          <div key={fecha}>
                            {/* Separador de fecha */}
                            <div className="border-b border-[#2d463b] bg-[#163129] px-6 py-3">
                              <div className="flex items-center gap-3">
                                <CalendarMonthOutlinedIcon
                                  sx={{
                                    color: "#4adea8",
                                    fontSize: 19,
                                  }}
                                />

                                <span className="font-bold text-[#4adea8]">
                                  {formatearFechaGrupo(fecha)}
                                </span>

                                <span className="text-xs text-gray-500">
                                  {clasesFecha.length}{" "}
                                  {clasesFecha.length === 1
                                    ? "clase"
                                    : "clases"}
                                </span>
                              </div>
                            </div>

                            {/* Cabecera de columnas */}
                            <div className="hidden grid-cols-[140px_minmax(180px,1.2fr)_minmax(180px,1fr)_120px_150px_70px] gap-4 bg-[#12201b] px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 lg:grid">
                              <span>Horario</span>
                              <span>Grupo</span>
                              <span>Entrenador</span>
                              <span>Ocupación</span>
                              <span>Estado</span>
                              <span className="text-right">Acciones</span>
                            </div>

                            {/* Clases de esa fecha */}
                            <div className="divide-y divide-[#2d463b]">
                              {clasesFecha.map((clase) => (
                                <ClaseFila
                                  key={`${clase.id}-${fecha}`}
                                  clase={clase}
                                  menuAbierto={menuClaseId === clase.id}
                                  onAbrirMenu={() =>
                                    setMenuClaseId((actual) =>
                                      actual === clase.id ? null : clase.id,
                                    )
                                  }
                                  onVer={() =>
                                    navigate(
                                      `/admin/clases/${clase.id}?fecha=${fecha}`,
                                    )
                                  }
                                  onUbicacion={() => {
                                    setMenuClaseId(null);
                                    setClaseUbicacion(clase);
                                  }}
                                  onEstado={() => abrirModalEstado(clase)}
                                  onEditar={() => {
                                    setMenuClaseId(null);
                                    navigate(
                                      `/admin/clases/editar/${clase.id}`,
                                    );
                                  }}
                                  onEliminar={() => {
                                    setMenuClaseId(null);
                                    setClaseAEliminar(clase);
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </main>

      {claseEstado && (
        <ModalEstadoClase
          clase={claseEstado}
          nuevoEstado={nuevoEstado}
          motivo={motivoEstado}
          procesando={cambiandoEstado}
          onEstadoChange={setNuevoEstado}
          onMotivoChange={setMotivoEstado}
          onCerrar={() => setClaseEstado(null)}
          onConfirmar={confirmarCambiarEstado}
        />
      )}

      {claseAEliminar && (
        <ModalEliminarClase
          clase={claseAEliminar}
          eliminando={eliminando}
          onCerrar={() => setClaseAEliminar(null)}
          onConfirmar={confirmarEliminar}
        />
      )}

      {claseUbicacion && (
        <ModalUbicacionClase
          clase={claseUbicacion}
          onCerrar={() => setClaseUbicacion(null)}
        />
      )}
    </div>
  );
}

function ClaseFila({
  clase,
  menuAbierto,
  onAbrirMenu,
  onVer,
  onUbicacion,
  onEstado,
  onEditar,
  onEliminar,
}: {
  clase: Clase;
  menuAbierto: boolean;
  onAbrirMenu: () => void;
  onVer: () => void;
  onUbicacion: () => void;
  onEstado: () => void;
  onEditar: () => void;
  onEliminar: () => void;
}) {
  const cupo = clase.cupoMaximo ?? 0;
  const inscriptos = clase.cantidadInscriptos ?? 0;

  return (
    <article className="relative grid gap-4 px-5 py-4 transition-colors hover:bg-[#4adea8]/5 sm:px-6 lg:grid-cols-[140px_minmax(180px,1.2fr)_minmax(180px,1fr)_120px_150px_70px] lg:items-center">
      <div>
        <p className="text-xs text-gray-500 lg:hidden">Horario</p>

        <p className="mt-1 font-bold text-[#4adea8]">
          {formatearHora(clase.horaInicio)} - {formatearHora(clase.horaFin)}
        </p>
      </div>

      <div className="min-w-0">
        <p className="text-xs text-gray-500 lg:hidden">Grupo</p>

        <p className="mt-1 break-words font-bold">
          {obtenerNombreGrupo(clase)}
        </p>

        <p className="mt-1 text-xs text-gray-500">
          {clase.esFija ? "Recurrente" : "Puntual"}
        </p>
      </div>

      <div className="min-w-0">
        <p className="text-xs text-gray-500 lg:hidden">Entrenadores</p>

        <div className="mt-1 flex flex-col gap-1">
          {obtenerEntrenadores(clase)
            .slice(0, 3)
            .map((e) => (
              <div key={e.nombre} className="text-sm font-semibold truncate">
                {e.esPrincipal ? `${e.nombre} (Principal)` : e.nombre}
              </div>
            ))}

          {(clase.entrenadores?.length ?? 0) > 3 && (
            <span className="text-xs text-gray-500">
              +{clase.entrenadores!.length - 3} entrenadores
            </span>
          )}
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 lg:hidden">Ocupación</p>

        <p className="mt-1 font-semibold">
          {inscriptos}/{cupo}
        </p>
      </div>

      <div>
        <p className="text-xs text-gray-500 lg:hidden">Estado</p>

        <span
          className={`mt-1 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${obtenerClaseEstado(
            clase.estado,
          )}`}
        >
          {obtenerTextoEstado(clase.estado)}
        </span>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onVer}
          className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#4adea8] px-3 text-sm font-bold text-[#12201b] lg:w-10 lg:px-0"
          title="Ver detalle"
        >
          <VisibilityOutlinedIcon fontSize="small" />
          <span className="lg:hidden">Ver</span>
        </button>

        <button
          type="button"
          onClick={onAbrirMenu}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#2d463b] bg-[#12201b] hover:border-[#4adea8]"
          title="Más acciones"
        >
          <MoreVertOutlinedIcon fontSize="small" />
        </button>

        {menuAbierto && (
          <div className="absolute right-5 top-14 z-30 w-56 overflow-hidden rounded-2xl border border-[#2d463b] bg-[#12201b] shadow-2xl sm:right-6">
            <button
              type="button"
              onClick={onUbicacion}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-[#4adea8]/10"
            >
              <LocationOnOutlinedIcon fontSize="small" />
              Ver ubicación
            </button>

            <button
              type="button"
              onClick={onEstado}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-yellow-500/10"
            >
              <SettingsOutlinedIcon fontSize="small" />
              Cambiar estado
            </button>

            <button
              type="button"
              onClick={onEditar}
              className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-blue-500/10"
            >
              <EditOutlinedIcon fontSize="small" />
              Editar clase
            </button>

            <button
              type="button"
              onClick={onEliminar}
              className="flex w-full items-center gap-3 border-t border-[#2d463b] px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10"
            >
              <DeleteOutlineOutlinedIcon fontSize="small" />
              Eliminar clase
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

function ResumenCard({
  titulo,
  valor,
  icono,
}: {
  titulo: string;
  valor: number;
  icono: React.ReactNode;
}) {
  return (
    <article className="rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-5">
      <div className="text-[#4adea8]">{icono}</div>

      <p className="mt-4 text-sm text-gray-400">{titulo}</p>

      <p className="mt-1 text-3xl font-bold">{valor}</p>
    </article>
  );
}

function EstadoVacio({
  titulo,
  descripcion,
  accionTexto,
  onAccion,
}: {
  titulo: string;
  descripcion: string;
  accionTexto?: string;
  onAccion?: () => void;
}) {
  return (
    <section className="rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-10 text-center">
      <h2 className="text-2xl font-bold">{titulo}</h2>

      <p className="mt-2 text-gray-400">{descripcion}</p>

      {accionTexto && onAccion && (
        <button
          type="button"
          onClick={onAccion}
          className="mt-6 rounded-xl bg-[#4adea8] px-5 py-3 font-bold text-[#12201b]"
        >
          {accionTexto}
        </button>
      )}
    </section>
  );
}

function ModalEstadoClase({
  clase,
  nuevoEstado,
  motivo,
  procesando,
  onEstadoChange,
  onMotivoChange,
  onCerrar,
  onConfirmar,
}: {
  clase: Clase;
  nuevoEstado: EstadoClaseValor;
  motivo: string;
  procesando: boolean;
  onEstadoChange: (estado: EstadoClaseValor) => void;
  onMotivoChange: (motivo: string) => void;
  onCerrar: () => void;
  onConfirmar: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4">
      <section className="w-full max-w-lg rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-7 shadow-2xl">
        <h2 className="text-2xl font-bold">Cambiar estado de clase</h2>

        <p className="mt-2 text-gray-400">
          {obtenerNombreGrupo(clase)} · {normalizarDia(clase.diaSemana)} ·{" "}
          {formatearHora(clase.horaInicio)} - {formatearHora(clase.horaFin)}
        </p>

        <select
          value={nuevoEstado}
          onChange={(event) =>
            onEstadoChange(Number(event.target.value) as EstadoClaseValor)
          }
          className="mt-6 w-full rounded-xl border border-[#2d463b] bg-[#12201b] p-3 outline-none focus:border-[#4adea8]"
        >
          <option value={0}>Programada</option>
          <option value={1}>Realizada</option>
          <option value={2}>Cancelada</option>
          <option value={3}>Suspendida</option>
        </select>

        {(nuevoEstado === 0 || nuevoEstado === 2 || nuevoEstado === 3) && (
          <textarea
            rows={4}
            value={motivo}
            onChange={(event) => onMotivoChange(event.target.value)}
            placeholder="Motivo opcional"
            className="mt-4 w-full resize-none rounded-xl border border-[#2d463b] bg-[#12201b] p-3 outline-none focus:border-[#4adea8]"
          />
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCerrar}
            disabled={procesando}
            className="rounded-xl border border-[#2d463b] bg-[#12201b] px-5 py-3 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirmar}
            disabled={procesando}
            className="rounded-xl bg-[#4adea8] px-5 py-3 font-bold text-[#12201b] disabled:opacity-50"
          >
            {procesando ? "Guardando..." : "Guardar estado"}
          </button>
        </div>
      </section>
    </div>
  );
}

function ModalEliminarClase({
  clase,
  eliminando,
  onCerrar,
  onConfirmar,
}: {
  clase: Clase;
  eliminando: boolean;
  onCerrar: () => void;
  onConfirmar: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4">
      <section className="w-full max-w-lg rounded-3xl border border-red-500/30 bg-[#1a2b24] p-7 shadow-2xl">
        <h2 className="text-2xl font-bold">Eliminar clase</h2>

        <p className="mt-2 text-gray-400">
          ¿Seguro que querés eliminar{" "}
          <strong className="text-white">{obtenerNombreGrupo(clase)}</strong>{" "}
          del {normalizarDia(clase.diaSemana)} a las{" "}
          {formatearHora(clase.horaInicio)}?
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCerrar}
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
            {eliminando ? "Eliminando..." : "Eliminar clase"}
          </button>
        </div>
      </section>
    </div>
  );
}

function ModalUbicacionClase({
  clase,
  onCerrar,
}: {
  clase: Clase;
  onCerrar: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4">
      <section className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-7 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Ubicación de la clase</h2>

            <p className="mt-1 text-gray-400">
              {obtenerNombreGrupo(clase)} · {normalizarDia(clase.diaSemana)} ·{" "}
              {formatearHora(clase.horaInicio)} - {formatearHora(clase.horaFin)}
            </p>
          </div>

          <button
            type="button"
            onClick={onCerrar}
            className="rounded-xl border border-[#2d463b] bg-[#12201b] px-4 py-2 hover:border-[#4adea8]"
          >
            Cerrar
          </button>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl">
          <ClassLocationMap
            latitud={clase.latitud}
            longitud={clase.longitud}
            radio={clase.radioGeolocalizacion}
          />
        </div>

        <p className="mt-3 text-xs text-gray-500">
          Radio configurado: {clase.radioGeolocalizacion} metros
        </p>
      </section>
    </div>
  );
}

function compararClases(a: Clase, b: Clase) {
  const diaA = DIAS_ORDENADOS.indexOf(
    normalizarDia(a.diaSemana) as (typeof DIAS_ORDENADOS)[number],
  );

  const diaB = DIAS_ORDENADOS.indexOf(
    normalizarDia(b.diaSemana) as (typeof DIAS_ORDENADOS)[number],
  );

  if (diaA !== diaB) {
    return diaA - diaB;
  }

  const horaA = formatearHora(a.horaInicio);
  const horaB = formatearHora(b.horaInicio);

  if (horaA !== horaB) {
    return horaA.localeCompare(horaB);
  }

  return obtenerNombreGrupo(a).localeCompare(obtenerNombreGrupo(b), "es");
}

function normalizarDia(dia?: string) {
  const mapa: Record<string, string> = {
    Lunes: "Lunes",
    Martes: "Martes",
    Miércoles: "Miércoles",
    Miercoles: "Miércoles",
    Jueves: "Jueves",
    Viernes: "Viernes",
    Sábado: "Sábado",
    Sabado: "Sábado",
    Domingo: "Domingo",
  };

  return mapa[dia ?? ""] ?? dia ?? "Sin día";
}

function formatearHora(hora?: string) {
  if (!hora) return "--:--";

  const coincidencia = hora.match(/^(\d{1,2}):(\d{2})/);

  if (!coincidencia) {
    return "--:--";
  }

  return `${coincidencia[1].padStart(2, "0")}:${coincidencia[2]}`;
}

function formatearFechaGrupo(fecha: string) {
  if (!fecha || fecha === "Sin fecha") {
    return "Sin fecha definida";
  }

  const partes = fecha.split("-");

  if (partes.length !== 3) {
    return fecha;
  }

  const [anio, mes, dia] = partes;

  return `${dia}/${mes}/${anio}`;
}

function obtenerNombreGrupo(clase: Clase) {
  return clase.grupoNombre ?? `Grupo #${clase.grupoId}`;
}

function obtenerEntrenadores(clase: Clase) {
  const nombres =
    clase.entrenadores && clase.entrenadores.length > 0
      ? clase.entrenadores
      : clase.entrenadorNombre
        ? [clase.entrenadorNombre]
        : [];

  if (nombres.length === 0) {
    return [
      {
        nombre: "Sin asignar",
        esPrincipal: false,
      },
    ];
  }

  return nombres.map((nombre) => ({
    nombre,
    esPrincipal:
      nombre === clase.entrenadorPrincipal ||
      (!clase.entrenadorPrincipal && nombre === clase.entrenadorNombre),
  }));
}

function obtenerValorEstado(estado?: string): EstadoClaseValor {
  switch (estado?.toUpperCase()) {
    case "REALIZADA":
      return 1;
    case "CANCELADA":
      return 2;
    case "SUSPENDIDA":
      return 3;
    default:
      return 0;
  }
}

function obtenerTextoEstado(estado?: string) {
  switch (estado?.toUpperCase()) {
    case "PROGRAMADA":
      return "Programada";
    case "REALIZADA":
      return "Realizada";
    case "CANCELADA":
      return "Cancelada";
    case "SUSPENDIDA":
      return "Suspendida";
    default:
      return estado ?? "Sin estado";
  }
}

function obtenerClaseEstado(estado?: string) {
  switch (estado?.toUpperCase()) {
    case "PROGRAMADA":
      return "bg-[#4adea8]/10 text-[#4adea8] border-[#4adea8]/30";
    case "REALIZADA":
      return "bg-blue-500/10 text-blue-300 border-blue-500/30";
    case "CANCELADA":
      return "bg-red-500/10 text-red-400 border-red-500/30";
    case "SUSPENDIDA":
      return "bg-yellow-500/10 text-yellow-300 border-yellow-500/30";
    default:
      return "bg-[#12201b] text-gray-300 border-[#2d463b]";
  }
}

function obtenerFechaActualUruguay() {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Montevideo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const obtener = (tipo: Intl.DateTimeFormatPartTypes) =>
    partes.find((parte) => parte.type === tipo)?.value ?? "";

  return `${obtener("year")}-${obtener("month")}-${obtener("day")}`;
}

function sumarDias(fecha: string, cantidad: number) {
  const date = crearFechaLocal(fecha);

  date.setDate(date.getDate() + cantidad);

  return fechaAString(date);
}

function crearFechaLocal(fecha: string) {
  const [anio, mes, dia] = fecha.split("-").map(Number);

  return new Date(anio, mes - 1, dia);
}

function fechaAString(fecha: Date) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
}

function generarOcurrenciasRecurrentes(
  clase: Clase,
  inicioRango: string,
  finRango: string,
) {
  const resultado: string[] = [];

  const fechaInicioClase = clase.fechaInicio?.substring(0, 10);

  if (!fechaInicioClase) {
    return resultado;
  }

  const fechaFinClase = clase.fechaFin?.substring(0, 10);

  const inicioReal =
    fechaInicioClase > inicioRango ? fechaInicioClase : inicioRango;

  const finReal =
    fechaFinClase && fechaFinClase < finRango ? fechaFinClase : finRango;

  const numeroDiaClase = obtenerNumeroDiaSemana(clase.diaSemana);

  if (numeroDiaClase === null) {
    return resultado;
  }

  const fechaActual = crearFechaLocal(inicioReal);

  while (obtenerNumeroDiaDate(fechaActual) !== numeroDiaClase) {
    fechaActual.setDate(fechaActual.getDate() + 1);
  }

  while (fechaAString(fechaActual) <= finReal) {
    resultado.push(fechaAString(fechaActual));

    fechaActual.setDate(fechaActual.getDate() + 7);
  }

  return resultado;
}

function obtenerNumeroDiaSemana(dia?: string) {
  const normalizado = normalizarDia(dia);

  const mapa: Record<string, number> = {
    Lunes: 1,
    Martes: 2,
    Miércoles: 3,
    Jueves: 4,
    Viernes: 5,
    Sábado: 6,
    Domingo: 7,
  };

  return mapa[normalizado] ?? null;
}

function obtenerNumeroDiaDate(fecha: Date) {
  const dia = fecha.getDay();

  return dia === 0 ? 7 : dia;
}
