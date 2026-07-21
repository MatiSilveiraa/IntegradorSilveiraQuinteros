import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";

import AlumnoLayout from "../../components/layout/DashboardLayout";
import FullScreenLoading from "../../components/FullScreenSpinner";

import { obtenerMiPerfil } from "../../services/Perfil.service";
import {
  obtenerMisClases,
  desinscribirseClase,
} from "../../services/Inscripciones.Service";

import { obtenerImagenGrupo } from "../../utils/grupoImageUtils";
import { obtenerProximaClase } from "../../utils/proximaClaseUtils";

import type { Perfil } from "../../types";
import type { ReactNode } from "react";

const CLASES_POR_PAGINA = 4;

const DIAS_SEMANA = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

type EntrenadorClase = {
  id?: number;
  nombre?: string;
  apellido?: string;
};

type ClaseAlumno = {
  id: number;
  grupoId: number;

  nombreGrupo?: string;
  grupoNombre?: string;

  diaSemana: string;
  horaInicio: string;
  horaFin: string;

  latitud?: number;
  longitud?: number;

  estadoClase?: string | number;
  estado?: string | number;

  entrenador?: EntrenadorClase | null;
  entrenadorNombre?: string | null;

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

export default function MisEntrenamientosPage() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [misClases, setMisClases] = useState<ClaseAlumno[]>([]);

  const [loading, setLoading] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);

  const [claseParaDesinscribir, setClaseParaDesinscribir] =
    useState<ClaseAlumno | null>(null);

  const [desinscribiendo, setDesinscribiendo] = useState(false);

  useEffect(() => {
    void cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      const [perfilData, clasesData] = await Promise.all([
        obtenerMiPerfil(),
        obtenerMisClases(),
      ]);

      setPerfil(perfilData);
      setMisClases((clasesData ?? []) as ClaseAlumno[]);
    } catch (error) {
      console.error(error);
      toast.error("No fue posible cargar tus entrenamientos");
    } finally {
      setLoading(false);
    }
  };

  const clasesOrdenadas = useMemo(() => {
    return [...misClases].sort((a, b) => {
      const indiceDiaA = obtenerIndiceDia(a.diaSemana);
      const indiceDiaB = obtenerIndiceDia(b.diaSemana);

      if (indiceDiaA !== indiceDiaB) {
        return indiceDiaA - indiceDiaB;
      }

      return formatearHora(a.horaInicio).localeCompare(
        formatearHora(b.horaInicio),
      );
    });
  }, [misClases]);

  const proximaClase = obtenerProximaClase(
    misClases as any[],
  ) as ClaseAlumno | null;

  const agendaPorDia = useMemo(() => {
    return DIAS_SEMANA.map((dia) => ({
      dia,
      clases: clasesOrdenadas.filter(
        (clase) => normalizarTexto(clase.diaSemana) === normalizarTexto(dia),
      ),
    }));
  }, [clasesOrdenadas]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(clasesOrdenadas.length / CLASES_POR_PAGINA),
  );

  const clasesPaginadas = useMemo(() => {
    const inicio = (paginaActual - 1) * CLASES_POR_PAGINA;
    const fin = inicio + CLASES_POR_PAGINA;

    return clasesOrdenadas.slice(inicio, fin);
  }, [clasesOrdenadas, paginaActual]);

  useEffect(() => {
    if (paginaActual > totalPaginas) {
      setPaginaActual(totalPaginas);
    }
  }, [paginaActual, totalPaginas]);

  const obtenerNombreGrupo = (clase: ClaseAlumno) => {
    return (
      clase.nombreGrupo?.trim() ||
      clase.grupoNombre?.trim() ||
      "Entrenamiento"
    );
  };

  const obtenerNombreEntrenador = (clase: ClaseAlumno) => {
    if (clase.entrenadorNombre?.trim()) {
      return clase.entrenadorNombre;
    }

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

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${latitud},${longitud}`,
      "_blank",
      "noopener,noreferrer",
    );
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
          "No fue posible desinscribirse de la clase",
      );
    } finally {
      setDesinscribiendo(false);
    }
  };

  if (loading) {
    return <FullScreenLoading />;
  }

  return (
    <AlumnoLayout nombre={perfil?.nombre}>
      <main className="mx-auto max-w-7xl">
        <section className="mb-8 rounded-3xl border border-[#4adea8]/20 bg-gradient-to-r from-[#1a2b24] to-[#163129] p-6 md:p-8">
          <span className="inline-flex rounded-full bg-[#4adea8] px-3 py-1 text-xs font-bold text-[#12201b]">
            MI SEMANA
          </span>

          <h1 className="mt-4 text-3xl font-bold md:text-4xl">
            Mis entrenamientos
          </h1>

          <p className="mt-2 max-w-2xl text-gray-300">
            Consultá tu próxima clase, organizá tu semana y administrá tus
            inscripciones.
          </p>
        </section>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <ResumenCard
            titulo="Clases activas"
            valor={misClases.length}
            descripcion="Horarios en los que estás inscripto"
            icono={
              <CalendarMonthRoundedIcon
                sx={{ color: "#4adea8", fontSize: 34 }}
              />
            }
          />

          <ResumenCard
            titulo="Racha actual"
            valor={perfil?.rachaAsistenciaMensual ?? 0}
            descripcion="Asistencias consecutivas del mes"
            icono={
              <FitnessCenterRoundedIcon
                sx={{ color: "#4adea8", fontSize: 34 }}
              />
            }
          />

          <ResumenCard
            titulo="Días de entrenamiento"
            valor={
              new Set(
                misClases.map((clase) => normalizarTexto(clase.diaSemana)),
              ).size
            }
            descripcion="Días diferentes durante la semana"
            icono={
              <AccessTimeRoundedIcon
                sx={{ color: "#4adea8", fontSize: 34 }}
              />
            }
          />
        </div>

        {perfil?.bloqueadoPorInasistencias && (
          <section className="mb-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
            <h2 className="font-bold text-red-400">Cuenta bloqueada</h2>

            <p className="mt-2 text-gray-300">
              Tu cuenta está bloqueada por inasistencias. Podés mantener tus
              clases actuales, pero no inscribirte a nuevos horarios hasta que
              se apruebe tu reactivación.
            </p>
          </section>
        )}

        <section className="mb-10 overflow-hidden rounded-3xl border border-[#4adea8]/20 bg-gradient-to-r from-[#1a2b24] to-[#163129]">
          {proximaClase ? (
            <div className="grid md:grid-cols-[190px_1fr]">
              <div className="h-40 md:h-full md:min-h-52">
                <img
                  src={obtenerImagenGrupo(
                    obtenerNombreGrupo(proximaClase),
                  )}
                  alt={obtenerNombreGrupo(proximaClase)}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-6 md:p-7">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <span className="inline-flex rounded-full bg-[#4adea8] px-3 py-1 text-xs font-bold text-[#12201b]">
                      PRÓXIMA CLASE
                    </span>

                    <h2 className="mt-3 break-words text-2xl font-bold">
                      {obtenerNombreGrupo(proximaClase)}
                    </h2>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
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
                        )} - ${formatearHora(proximaClase.horaFin)}`}
                      />

                      <DatoConIcono
                        icono={<PersonOutlineRoundedIcon />}
                        etiqueta="Entrenador"
                        valor={obtenerNombreEntrenador(proximaClase)}
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
            <div className="p-10 text-center">
              <CalendarMonthRoundedIcon
                sx={{ color: "#4adea8", fontSize: 48 }}
              />

              <h2 className="mt-4 text-2xl font-bold">
                No tenés próximas clases
              </h2>

              <p className="mt-2 text-gray-400">
                Explorá las clases disponibles para comenzar a entrenar.
              </p>
            </div>
          )}
        </section>

        <section className="mb-10">
          <div className="mb-5">
            <p className="text-sm font-bold uppercase tracking-wide text-[#4adea8]">
              Organización semanal
            </p>

            <h2 className="mt-2 text-3xl font-bold">Agenda semanal</h2>

            <p className="mt-1 text-gray-400">
              Una vista rápida de todos tus horarios.
            </p>
          </div>

          <div className="hidden grid-cols-7 gap-3 xl:grid">
            {agendaPorDia.map(({ dia, clases }) => (
              <div
                key={dia}
                className="min-w-0 rounded-2xl border border-[#2d463b] bg-[#1a2b24] p-3"
              >
                <div className="border-b border-[#2d463b] pb-3 text-center">
                  <p className="text-sm font-bold text-[#4adea8]">{dia}</p>
                </div>

                <div className="mt-3 space-y-3">
                  {clases.length === 0 ? (
                    <p className="py-5 text-center text-xs text-gray-500">
                      Sin clases
                    </p>
                  ) : (
                    clases.map((clase) => (
                      <AgendaClaseCard
                        key={clase.id}
                        clase={clase}
                        nombreGrupo={obtenerNombreGrupo(clase)}
                        onVerUbicacion={() => abrirGoogleMaps(clase)}
                        ubicacionDisponible={tieneUbicacionValida(clase)}
                      />
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 xl:hidden">
            {agendaPorDia.map(({ dia, clases }) => (
              <div
                key={dia}
                className="rounded-2xl border border-[#2d463b] bg-[#1a2b24] p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-bold text-[#4adea8]">{dia}</h3>

                  <span className="text-xs text-gray-500">
                    {clases.length} {clases.length === 1 ? "clase" : "clases"}
                  </span>
                </div>

                {clases.length === 0 ? (
                  <p className="mt-4 text-sm text-gray-500">
                    No tenés clases programadas.
                  </p>
                ) : (
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {clases.map((clase) => (
                      <AgendaClaseCard
                        key={clase.id}
                        clase={clase}
                        nombreGrupo={obtenerNombreGrupo(clase)}
                        onVerUbicacion={() => abrirGoogleMaps(clase)}
                        ubicacionDisponible={tieneUbicacionValida(clase)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section id="mis-clases" className="scroll-mt-6">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-[#4adea8]">
                Inscripciones
              </p>

              <h2 className="mt-2 text-3xl font-bold">Mis clases</h2>

              <p className="mt-1 text-gray-400">
                Administrá los horarios en los que estás inscripto.
              </p>
            </div>

            <span className="text-sm text-gray-400">
              {misClases.length} {misClases.length === 1 ? "clase" : "clases"}
            </span>
          </div>

          {misClases.length === 0 ? (
            <div className="rounded-2xl border border-[#2d463b] bg-[#1a2b24] p-10 text-center">
              <CalendarMonthRoundedIcon
                sx={{ color: "#4adea8", fontSize: 44 }}
              />

              <h3 className="mt-4 text-xl font-bold">
                Todavía no tenés clases
              </h3>

              <p className="mt-2 text-gray-400">
                Ingresá a Explorar clases para elegir un grupo y horario.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-5 xl:grid-cols-2">
                {clasesPaginadas.map((clase) => {
                  const estado = obtenerEstadoVisual(
                    clase.estadoClase ?? clase.estado,
                  );

                  return (
                    <article
                      key={clase.id}
                      className="overflow-hidden rounded-3xl border border-[#2d463b] bg-[#1a2b24] transition-all hover:border-[#4adea8]/40"
                    >
                      <div className="grid sm:grid-cols-[145px_1fr]">
                        <div className="h-36 sm:h-full">
                          <img
                            src={obtenerImagenGrupo(
                              obtenerNombreGrupo(clase),
                            )}
                            alt={obtenerNombreGrupo(clase)}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="min-w-0 p-5">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="break-words text-xl font-bold">
                                {obtenerNombreGrupo(clase)}
                              </h3>

                              <p className="mt-1 text-sm text-gray-400">
                                {clase.esFija
                                  ? "Entrenamiento semanal"
                                  : "Entrenamiento por período"}
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

                          <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            <DatoCompacto
                              etiqueta="Día y horario"
                              valor={`${clase.diaSemana} · ${formatearHora(
                                clase.horaInicio,
                              )} - ${formatearHora(clase.horaFin)}`}
                            />

                            <DatoCompacto
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
                              onClick={() => setClaseParaDesinscribir(clase)}
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
                      </div>
                    </article>
                  );
                })}
              </div>

              <Paginacion
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                onCambiarPagina={(pagina) => {
                  setPaginaActual(pagina);

                  document.getElementById("mis-clases")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
              />
            </>
          )}
        </section>
      </main>

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
              Vas a perder tu lugar en{" "}
              <strong className="text-white">
                {obtenerNombreGrupo(claseParaDesinscribir)}
              </strong>
              , el día {claseParaDesinscribir.diaSemana} de{" "}
              {formatearHora(claseParaDesinscribir.horaInicio)} a{" "}
              {formatearHora(claseParaDesinscribir.horaFin)}.
            </p>

            <p className="mt-3 text-sm text-gray-500">
              Si el horario se completa, puede que luego debas ingresar a la
              lista de espera.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={desinscribiendo}
                onClick={() => setClaseParaDesinscribir(null)}
                className="rounded-xl border border-[#2d463b] bg-[#12201b] px-5 py-3 font-semibold transition-all hover:border-[#4adea8] disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={desinscribiendo}
                onClick={() => void confirmarDesinscripcion()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 font-bold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
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

function AgendaClaseCard({
  clase,
  nombreGrupo,
  onVerUbicacion,
  ubicacionDisponible,
}: {
  clase: ClaseAlumno;
  nombreGrupo: string;
  onVerUbicacion: () => void;
  ubicacionDisponible: boolean;
}) {
  const estado = obtenerEstadoVisual(clase.estadoClase ?? clase.estado);
  const mostrarEstado =
    estado.texto === "Cancelada" || estado.texto === "Suspendida";

  return (
    <article className="rounded-xl border border-[#2d463b] bg-[#12201b] p-3">
      <p className="text-sm font-bold text-white">
        {formatearHora(clase.horaInicio)}
      </p>

      <p className="mt-1 break-words text-xs font-semibold text-gray-300">
        {nombreGrupo}
      </p>

      {mostrarEstado && (
        <span
          className={`mt-3 inline-flex rounded-full border px-2 py-1 text-[10px] font-bold ${estado.clases}`}
        >
          {estado.texto}
        </span>
      )}

      <button
        type="button"
        disabled={!ubicacionDisponible}
        onClick={onVerUbicacion}
        className="mt-3 block text-left text-xs font-semibold text-[#4adea8] hover:underline disabled:cursor-not-allowed disabled:text-gray-600 disabled:no-underline"
      >
        Ver ubicación
      </button>
    </article>
  );
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

function DatoCompacto({
  etiqueta,
  valor,
}: {
  etiqueta: string;
  valor: string;
}) {
  return (
    <div className="rounded-xl border border-[#2d463b] bg-[#12201b] p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
        {etiqueta}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-gray-200">
        {valor}
      </p>
    </div>
  );
}

function ResumenCard({
  titulo,
  valor,
  descripcion,
  icono,
}: {
  titulo: string;
  valor: number;
  descripcion: string;
  icono: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#2d463b] bg-[#1a2b24] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-400">{titulo}</p>

          <p className="mt-2 text-3xl font-bold">{valor}</p>

          <p className="mt-2 text-xs text-gray-500">{descripcion}</p>
        </div>

        {icono}
      </div>
    </div>
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

  return (
    <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        disabled={paginaActual === 1}
        onClick={() => onCambiarPagina(paginaActual - 1)}
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#2d463b] bg-[#1a2b24] transition-all hover:border-[#4adea8] hover:text-[#4adea8] disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Página anterior"
      >
        <ChevronLeftRoundedIcon />
      </button>

      {Array.from({ length: totalPaginas }, (_, indice) => indice + 1).map(
        (pagina) => (
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
        ),
      )}

      <button
        type="button"
        disabled={paginaActual === totalPaginas}
        onClick={() => onCambiarPagina(paginaActual + 1)}
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#2d463b] bg-[#1a2b24] transition-all hover:border-[#4adea8] hover:text-[#4adea8] disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Página siguiente"
      >
        <ChevronRightRoundedIcon />
      </button>
    </div>
  );
}

function obtenerEstadoVisual(
  estado?: string | number,
): EstadoVisual {
  const valor = normalizarEstado(estado);

  if (valor === "realizada") {
    return {
      texto: "Realizada",
      clases: "border-blue-500/30 bg-blue-500/10 text-blue-300",
      punto: "bg-blue-400",
    };
  }

  if (valor === "cancelada") {
    return {
      texto: "Cancelada",
      clases: "border-red-500/30 bg-red-500/10 text-red-300",
      punto: "bg-red-400",
    };
  }

  if (valor === "suspendida") {
    return {
      texto: "Suspendida",
      clases: "border-amber-500/30 bg-amber-500/10 text-amber-300",
      punto: "bg-amber-400",
    };
  }

  return {
    texto: "Programada",
    clases: "border-[#4adea8]/30 bg-[#4adea8]/10 text-[#4adea8]",
    punto: "bg-[#4adea8]",
  };
}

function normalizarEstado(estado?: string | number) {
  if (typeof estado === "number") {
    if (estado === 1) return "realizada";
    if (estado === 2) return "cancelada";
    if (estado === 3) return "suspendida";

    return "programada";
  }

  const valor = normalizarTexto(String(estado ?? ""));

  if (valor.includes("realizada")) return "realizada";
  if (valor.includes("cancelada")) return "cancelada";
  if (valor.includes("suspendida")) return "suspendida";

  return "programada";
}

function obtenerIndiceDia(dia?: string) {
  const indice = DIAS_SEMANA.findIndex(
    (item) => normalizarTexto(item) === normalizarTexto(dia),
  );

  return indice === -1 ? 99 : indice;
}

function normalizarTexto(texto?: string) {
  return (texto ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function formatearHora(hora?: string) {
  if (!hora) return "--:--";
  return hora.substring(0, 5);
}