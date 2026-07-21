import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import BuscadorGrupos from "../components/grupos/BuscadorGrupos";
import GrupoCard from "../components/grupos/GrupoCard";
import AlumnoLayout from "../components/layout/DashboardLayout";
import FullScreenLoading from "../components/FullScreenSpinner";

import { obtenerMiPerfil } from "../services/Perfil.service";
import { obtenerGrupos } from "../services/Grupo.Service";
import {
  obtenerMisClases,
  desinscribirseClase,
} from "../services/Inscripciones.Service";

import { obtenerDias, obtenerHora } from "../utils/grupoUtils";
import { obtenerImagenGrupo } from "../utils/grupoImageUtils";
import { obtenerProximaClase } from "../utils/proximaClaseUtils";

import type { Perfil } from "../types";
import type { ReactNode } from "react";

const CLASES_POR_PAGINA = 4;
const GRUPOS_POR_PAGINA = 6;

type EntrenadorClase = {
  id?: number;
  nombre?: string;
  apellido?: string;
};

type ClaseAlumno = {
  id: number;
  grupoId: number;

  nombreGrupo?: string;

  diaSemana: string;
  horaInicio: string;
  horaFin: string;

  ubicacion?: string;
  latitud?: number;
  longitud?: number;

  estadoClase?: string | number;

  entrenador?: EntrenadorClase | null;

  esFija?: boolean;
  fechaInicio?: string | null;
  fechaFin?: string | null;
};

type EstadoVisual = {
  texto: string;
  clases: string;
  punto: string;
};

type PaginacionProps = {
  paginaActual: number;
  totalPaginas: number;
  onCambiarPagina: (pagina: number) => void;
};

export default function GruposPage() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [loading, setLoading] = useState(true);

  const [grupos, setGrupos] = useState<any[]>([]);
  const [misClases, setMisClases] = useState<ClaseAlumno[]>([]);

  const [busqueda, setBusqueda] = useState("");

  const [paginaClases, setPaginaClases] = useState(1);
  const [paginaGrupos, setPaginaGrupos] = useState(1);

  const [claseParaDesinscribir, setClaseParaDesinscribir] =
    useState<ClaseAlumno | null>(null);

  const [desinscribiendo, setDesinscribiendo] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);

        const [perfilData, gruposData, clasesData] = await Promise.all([
          obtenerMiPerfil(),
          obtenerGrupos(),
          obtenerMisClases(),
        ]);

        setPerfil(perfilData);
        setGrupos(gruposData);
        setMisClases(clasesData);
      } catch (error) {
        console.error(error);
        toast.error("No fue posible cargar la información");
      } finally {
        setLoading(false);
      }
    };

    void cargarDatos();
  }, []);

  const proximaClase = obtenerProximaClase(
    misClases as any[],
  ) as ClaseAlumno | null;

  const gruposFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    if (!termino) {
      return grupos;
    }

    return grupos.filter((grupo) => {
      const nombre = String(grupo.nombre ?? "").toLowerCase();
      const nivel = String(grupo.nivel ?? "").toLowerCase();

      const informacionClases = Array.isArray(grupo.clases)
        ? grupo.clases
            .map((clase: any) =>
              [
                clase.diaSemana,
                clase.horaInicio,
                clase.horaFin,
              ]
                .filter(Boolean)
                .join(" "),
            )
            .join(" ")
            .toLowerCase()
        : "";

      return (
        nombre.includes(termino) ||
        nivel.includes(termino) ||
        informacionClases.includes(termino)
      );
    });
  }, [grupos, busqueda]);

  const totalPaginasClases = Math.max(
    1,
    Math.ceil(misClases.length / CLASES_POR_PAGINA),
  );

  const totalPaginasGrupos = Math.max(
    1,
    Math.ceil(gruposFiltrados.length / GRUPOS_POR_PAGINA),
  );

  const clasesPaginadas = useMemo(() => {
    const inicio = (paginaClases - 1) * CLASES_POR_PAGINA;
    const fin = inicio + CLASES_POR_PAGINA;

    return misClases.slice(inicio, fin);
  }, [misClases, paginaClases]);

  const gruposPaginados = useMemo(() => {
    const inicio = (paginaGrupos - 1) * GRUPOS_POR_PAGINA;
    const fin = inicio + GRUPOS_POR_PAGINA;

    return gruposFiltrados.slice(inicio, fin);
  }, [gruposFiltrados, paginaGrupos]);

  useEffect(() => {
    if (paginaClases > totalPaginasClases) {
      setPaginaClases(totalPaginasClases);
    }
  }, [paginaClases, totalPaginasClases]);

  useEffect(() => {
    if (paginaGrupos > totalPaginasGrupos) {
      setPaginaGrupos(totalPaginasGrupos);
    }
  }, [paginaGrupos, totalPaginasGrupos]);

  const handleBusquedaChange = (
    evento: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setBusqueda(evento.target.value);
    setPaginaGrupos(1);
  };

  const obtenerNombreGrupo = (clase: ClaseAlumno) => {
    if (clase.nombreGrupo?.trim()) {
      return clase.nombreGrupo;
    }

    return (
      grupos.find((grupo) => grupo.id === clase.grupoId)?.nombre ??
      "Grupo"
    );
  };

  const obtenerNombreEntrenador = (clase: ClaseAlumno) => {
    if (!clase.entrenador) {
      return "No especificado";
    }

    const nombreCompleto = [
      clase.entrenador.nombre,
      clase.entrenador.apellido,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    return nombreCompleto || "No especificado";
  };

  const tieneUbicacionValida = (clase: ClaseAlumno) => {
    const latitud = Number(clase.latitud);
    const longitud = Number(clase.longitud);

    return Number.isFinite(latitud) && Number.isFinite(longitud);
  };

  const abrirGoogleMaps = (clase: ClaseAlumno) => {
    if (!tieneUbicacionValida(clase)) {
      toast.error("Esta clase no tiene una ubicación disponible");
      return;
    }

    const latitud = Number(clase.latitud);
    const longitud = Number(clase.longitud);

    const url =
      "https://www.google.com/maps/search/?api=1" +
      `&query=${latitud},${longitud}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const confirmarDesinscripcion = async () => {
    if (!claseParaDesinscribir) {
      return;
    }

    try {
      setDesinscribiendo(true);

      await desinscribirseClase(claseParaDesinscribir.id);

      setMisClases((clasesActuales) =>
        clasesActuales.filter(
          (clase) => clase.id !== claseParaDesinscribir.id,
        ),
      );

      setClaseParaDesinscribir(null);

      toast.success("Te desinscribiste correctamente");
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.mensaje ??
          "No fue posible desinscribirse",
      );
    } finally {
      setDesinscribiendo(false);
    }
  };

  const formatearHora = (hora?: string) => {
    if (!hora) {
      return "--:--";
    }

    return hora.substring(0, 5);
  };

  const obtenerEstadoVisual = (
    estado?: string | number,
  ): EstadoVisual => {
    const valor = normalizarEstado(estado);

    if (valor === "realizada") {
      return {
        texto: "Realizada",
        clases:
          "border-blue-500/30 bg-blue-500/10 text-blue-300",
        punto: "bg-blue-400",
      };
    }

    if (valor === "cancelada") {
      return {
        texto: "Cancelada",
        clases:
          "border-red-500/30 bg-red-500/10 text-red-300",
        punto: "bg-red-400",
      };
    }

    if (valor === "suspendida") {
      return {
        texto: "Suspendida",
        clases:
          "border-amber-500/30 bg-amber-500/10 text-amber-300",
        punto: "bg-amber-400",
      };
    }

    return {
      texto: "Programada",
      clases:
        "border-[#4adea8]/30 bg-[#4adea8]/10 text-[#4adea8]",
      punto: "bg-[#4adea8]",
    };
  };

  if (loading) {
    return <FullScreenLoading />;
  }

  return (
    <AlumnoLayout nombre={perfil?.nombre}>
      <main className="mx-auto max-w-7xl">
        {/* ENCABEZADO */}

        <section className="mb-8 rounded-3xl border border-[#4adea8]/20 bg-gradient-to-r from-[#1a2b24] to-[#163129] p-6 md:p-8">
          <span className="inline-flex rounded-full bg-[#4adea8] px-3 py-1 text-xs font-bold text-[#12201b]">
            ENTRENAMIENTOS
          </span>

          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">
                Mis entrenamientos
              </h1>

              <p className="mt-2 max-w-2xl text-gray-300">
                Consultá tus próximas clases y descubrí nuevos grupos
                disponibles.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("grupos-disponibles")
                  ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
              }
              className="
                inline-flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-[#4adea8]/30
                bg-[#12201b]
                px-5
                py-3
                font-bold
                text-[#4adea8]
                transition-all
                hover:border-[#4adea8]
                sm:w-auto
              "
            >
              Explorar grupos
              <ArrowForwardRoundedIcon fontSize="small" />
            </button>
          </div>
        </section>

        {/* RESUMEN */}

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <ResumenCard
            titulo="Clases activas"
            valor={misClases.length}
            icono={
              <CalendarMonthRoundedIcon
                sx={{ color: "#4adea8", fontSize: 34 }}
              />
            }
            onClick={() =>
              document.getElementById("mis-clases")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
          />

          <ResumenCard
            titulo="Racha actual"
            valor={perfil?.rachaAsistenciaMensual ?? 0}
            icono={
              <LocalFireDepartmentRoundedIcon
                sx={{ color: "#fb923c", fontSize: 34 }}
              />
            }
          />

          <ResumenCard
            titulo="Grupos disponibles"
            valor={grupos.length}
            icono={
              <GroupsRoundedIcon
                sx={{ color: "#4adea8", fontSize: 34 }}
              />
            }
            onClick={() =>
              document
                .getElementById("grupos-disponibles")
                ?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
            }
          />
        </div>

        {/* BLOQUEO */}

        {perfil?.bloqueadoPorInasistencias && (
          <section className="mb-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
            <h3 className="font-bold text-red-400">
              Cuenta bloqueada
            </h3>

            <p className="mt-2 text-gray-300">
              Tu cuenta se encuentra bloqueada por inasistencias. No
              podrás inscribirte a nuevas clases hasta que tu solicitud
              de reactivación sea aprobada.
            </p>
          </section>
        )}

        {/* PRÓXIMA CLASE */}

        <section className="mb-10 overflow-hidden rounded-3xl border border-[#4adea8]/20 bg-gradient-to-r from-[#1a2b24] to-[#163129]">
          {proximaClase ? (
            <div className="grid md:grid-cols-[180px_1fr]">
              <div className="h-36 md:h-full md:min-h-48">
                <img
                  src={obtenerImagenGrupo(
                    obtenerNombreGrupo(proximaClase),
                  )}
                  alt={obtenerNombreGrupo(proximaClase)}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <span className="inline-flex rounded-full bg-[#4adea8] px-3 py-1 text-xs font-bold text-[#12201b]">
                      PRÓXIMA CLASE
                    </span>

                    <h2 className="mt-3 text-2xl font-bold">
                      {obtenerNombreGrupo(proximaClase)}
                    </h2>

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <DatoConIcono
                        icono={<CalendarMonthRoundedIcon />}
                        etiqueta="Día"
                        valor={proximaClase.diaSemana}
                      />

                      <DatoConIcono
                        icono={<AccessTimeRoundedIcon />}
                        etiqueta="Horario"
                        valor={`${formatearHora(
                          proximaClase.horaInicio,
                        )} - ${formatearHora(
                          proximaClase.horaFin,
                        )}`}
                      />

                      <DatoConIcono
                        icono={<PersonOutlineRoundedIcon />}
                        etiqueta="Entrenador"
                        valor={obtenerNombreEntrenador(
                          proximaClase,
                        )}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!tieneUbicacionValida(proximaClase)}
                    onClick={() => abrirGoogleMaps(proximaClase)}
                    className="
                      inline-flex
                      w-full
                      shrink-0
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-[#4adea8]
                      px-5
                      py-3
                      font-bold
                      text-[#12201b]
                      transition-all
                      hover:brightness-110
                      disabled:cursor-not-allowed
                      disabled:bg-gray-600
                      disabled:text-gray-300
                      lg:w-auto
                    "
                  >
                    <MapOutlinedIcon fontSize="small" />
                    Ver ubicación
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <CalendarMonthRoundedIcon
                sx={{ color: "#4adea8", fontSize: 48 }}
              />

              <h2 className="mt-4 text-2xl font-bold">
                No tenés próximas clases
              </h2>

              <p className="mt-2 text-gray-400">
                Explorá los grupos disponibles para inscribirte.
              </p>
            </div>
          )}
        </section>

        {/* MIS CLASES */}

        <section id="mis-clases" className="scroll-mt-6">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold">
                Mis clases
              </h2>

              <p className="mt-1 text-gray-400">
                Tus entrenamientos semanales.
              </p>
            </div>

            <span className="text-sm text-gray-400">
              {misClases.length}{" "}
              {misClases.length === 1 ? "clase" : "clases"}
            </span>
          </div>

          {misClases.length === 0 ? (
            <div className="rounded-2xl border border-[#2d463b] bg-[#1a2b24] p-8 text-center">
              <CalendarMonthRoundedIcon
                sx={{ color: "#4adea8", fontSize: 44 }}
              />

              <h3 className="mt-4 text-xl font-bold">
                Todavía no tenés clases
              </h3>

              <p className="mt-2 text-gray-400">
                Explorá los grupos disponibles y elegí un horario.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-5 xl:grid-cols-2">
                {clasesPaginadas.map((clase) => {
                  const estado = obtenerEstadoVisual(
                    clase.estadoClase,
                  );

                  return (
                    <article
                      key={clase.id}
                      className="
                        overflow-hidden
                        rounded-3xl
                        border
                        border-[#2d463b]
                        bg-[#1a2b24]
                        transition-all
                        hover:border-[#4adea8]/40
                      "
                    >
                      <div className="h-32 w-full">
                        <img
                          src={obtenerImagenGrupo(
                            obtenerNombreGrupo(clase),
                          )}
                          alt={obtenerNombreGrupo(clase)}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="text-xl font-bold">
                              {obtenerNombreGrupo(clase)}
                            </h3>

                            <p className="mt-1 text-sm text-gray-400">
                              {clase.esFija
                                ? "Clase semanal fija"
                                : "Clase por período"}
                            </p>
                          </div>

                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-2
                              rounded-full
                              border
                              px-3
                              py-1
                              text-xs
                              font-bold
                              ${estado.clases}
                            `}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${estado.punto}`}
                            />

                            {estado.texto}
                          </span>
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                          <DatoConIcono
                            icono={<CalendarMonthRoundedIcon />}
                            etiqueta="Día"
                            valor={clase.diaSemana}
                          />

                          <DatoConIcono
                            icono={<AccessTimeRoundedIcon />}
                            etiqueta="Horario"
                            valor={`${formatearHora(
                              clase.horaInicio,
                            )} - ${formatearHora(
                              clase.horaFin,
                            )}`}
                          />

                          <DatoConIcono
                            icono={<PersonOutlineRoundedIcon />}
                            etiqueta="Entrenador"
                            valor={obtenerNombreEntrenador(clase)}
                          />
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                          <button
                            type="button"
                            disabled={!tieneUbicacionValida(clase)}
                            onClick={() => abrirGoogleMaps(clase)}
                            className="
                              inline-flex
                              items-center
                              justify-center
                              gap-2
                              rounded-xl
                              bg-[#4adea8]
                              px-4
                              py-3
                              font-bold
                              text-[#12201b]
                              transition-all
                              hover:brightness-110
                              disabled:cursor-not-allowed
                              disabled:bg-gray-600
                              disabled:text-gray-300
                            "
                          >
                            <MapOutlinedIcon fontSize="small" />
                            Ver ubicación
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setClaseParaDesinscribir(clase)
                            }
                            className="
                              inline-flex
                              items-center
                              justify-center
                              gap-2
                              rounded-xl
                              border
                              border-red-500/30
                              bg-red-500/10
                              px-4
                              py-3
                              font-semibold
                              text-red-400
                              transition-all
                              hover:bg-red-500/20
                            "
                          >
                            <DeleteOutlineRoundedIcon fontSize="small" />
                            Desinscribirme
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <Paginacion
                paginaActual={paginaClases}
                totalPaginas={totalPaginasClases}
                onCambiarPagina={(pagina) => {
                  setPaginaClases(pagina);

                  document
                    .getElementById("mis-clases")
                    ?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                }}
              />
            </>
          )}
        </section>

        {/* GRUPOS DISPONIBLES */}

        <section
          id="grupos-disponibles"
          className="mt-12 scroll-mt-6"
        >
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold">
                Grupos disponibles
              </h2>

              <p className="mt-1 text-gray-400">
                Encontrá nuevas opciones de entrenamiento.
              </p>
            </div>

            <span className="text-sm text-gray-400">
              {gruposFiltrados.length}{" "}
              {gruposFiltrados.length === 1
                ? "grupo encontrado"
                : "grupos encontrados"}
            </span>
          </div>

          <div className="mb-8">
            <BuscadorGrupos
              value={busqueda}
              onChange={handleBusquedaChange}
            />
          </div>

          {gruposFiltrados.length === 0 ? (
            <div className="rounded-2xl border border-[#2d463b] bg-[#1a2b24] p-8 text-center">
              <p className="text-gray-400">
                No se encontraron grupos que coincidan con la búsqueda.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {gruposPaginados.map((grupo) => (
                  <GrupoCard
                    key={grupo.id}
                    id={grupo.id}
                    nombre={grupo.nombre}
                    horario={`${obtenerDias(
                      grupo.clases,
                    )} — ${obtenerHora(grupo.clases)}`}
                    nivel={grupo.nivel}
                    cantidadClases={grupo.clases?.length ?? 0}
                  />
                ))}
              </div>

              <Paginacion
                paginaActual={paginaGrupos}
                totalPaginas={totalPaginasGrupos}
                onCambiarPagina={(pagina) => {
                  setPaginaGrupos(pagina);

                  document
                    .getElementById("grupos-disponibles")
                    ?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                }}
              />
            </>
          )}
        </section>
      </main>

      {/* MODAL DE DESINSCRIPCIÓN */}

      {claseParaDesinscribir && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 px-4">
          <div className="w-full max-w-md rounded-3xl border border-red-500/30 bg-[#1a2b24] p-7 shadow-2xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400">
              <DeleteOutlineRoundedIcon fontSize="large" />
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              ¿Querés desinscribirte?
            </h2>

            <p className="mt-3 leading-relaxed text-gray-300">
              Vas a perder tu lugar en la clase de{" "}
              <strong className="text-white">
                {obtenerNombreGrupo(claseParaDesinscribir)}
              </strong>{" "}
              del día {claseParaDesinscribir.diaSemana}, de{" "}
              {formatearHora(claseParaDesinscribir.horaInicio)} a{" "}
              {formatearHora(claseParaDesinscribir.horaFin)}.
            </p>

            <p className="mt-3 text-sm text-gray-500">
              Si la clase se completa, es posible que luego debas
              ingresar a la lista de espera.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={desinscribiendo}
                onClick={() =>
                  setClaseParaDesinscribir(null)
                }
                className="
                  rounded-xl
                  border
                  border-[#2d463b]
                  bg-[#12201b]
                  px-5
                  py-3
                  font-semibold
                  transition-all
                  hover:border-[#4adea8]
                  disabled:opacity-50
                "
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={desinscribiendo}
                onClick={() => void confirmarDesinscripcion()}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-red-500
                  px-5
                  py-3
                  font-bold
                  text-white
                  transition-all
                  hover:brightness-110
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <DeleteOutlineRoundedIcon fontSize="small" />

                {desinscribiendo
                  ? "Desinscribiendo..."
                  : "Sí, desinscribirme"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AlumnoLayout>
  );
}

function normalizarEstado(
  estado?: string | number,
): string {
  if (typeof estado === "number") {
    if (estado === 1) return "realizada";
    if (estado === 2) return "cancelada";
    if (estado === 3) return "suspendida";

    return "programada";
  }

  const valor = String(estado ?? "")
    .trim()
    .toLowerCase()
    .replaceAll("_", " ");

  if (valor.includes("realizada")) {
    return "realizada";
  }

  if (valor.includes("cancelada")) {
    return "cancelada";
  }

  if (valor.includes("suspendida")) {
    return "suspendida";
  }

  return "programada";
}

function DatoConIcono({
  icono,
  etiqueta,
  valor,
}: {
  icono: ReactNode;
  etiqueta: string;
  valor: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-[#2d463b] bg-[#12201b] p-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#4adea8]/10 text-[#4adea8]">
        {icono}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
          {etiqueta}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-gray-200">
          {valor}
        </p>
      </div>
    </div>
  );
}

function ResumenCard({
  titulo,
  valor,
  icono,
  onClick,
}: {
  titulo: string;
  valor: number;
  icono: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        rounded-2xl
        border
        border-[#2d463b]
        bg-[#1a2b24]
        p-5
        text-left
        transition-all
        hover:border-[#4adea8]/60
        active:scale-[0.98]
      "
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400">
            {titulo}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {valor}
          </h2>
        </div>

        {icono}
      </div>
    </button>
  );
}

function Paginacion({
  paginaActual,
  totalPaginas,
  onCambiarPagina,
}: PaginacionProps) {
  if (totalPaginas <= 1) {
    return null;
  }

  const paginas = Array.from(
    { length: totalPaginas },
    (_, indice) => indice + 1,
  );

  return (
    <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        disabled={paginaActual === 1}
        onClick={() => onCambiarPagina(paginaActual - 1)}
        className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          border
          border-[#2d463b]
          bg-[#1a2b24]
          transition-all
          hover:border-[#4adea8]
          hover:text-[#4adea8]
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
        aria-label="Página anterior"
      >
        <ChevronLeftRoundedIcon />
      </button>

      {paginas.map((pagina) => (
        <button
          key={pagina}
          type="button"
          onClick={() => onCambiarPagina(pagina)}
          className={`
            flex
            h-11
            min-w-11
            items-center
            justify-center
            rounded-xl
            border
            px-3
            font-bold
            transition-all
            ${
              pagina === paginaActual
                ? "border-[#4adea8] bg-[#4adea8] text-[#12201b]"
                : "border-[#2d463b] bg-[#1a2b24] text-gray-300 hover:border-[#4adea8] hover:text-[#4adea8]"
            }
          `}
        >
          {pagina}
        </button>
      ))}

      <button
        type="button"
        disabled={paginaActual === totalPaginas}
        onClick={() => onCambiarPagina(paginaActual + 1)}
        className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          border
          border-[#2d463b]
          bg-[#1a2b24]
          transition-all
          hover:border-[#4adea8]
          hover:text-[#4adea8]
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
        aria-label="Página siguiente"
      >
        <ChevronRightRoundedIcon />
      </button>
    </div>
  );
}