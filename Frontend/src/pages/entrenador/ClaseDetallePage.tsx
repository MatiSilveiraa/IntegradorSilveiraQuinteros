import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import LockClockOutlinedIcon from "@mui/icons-material/LockClockOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import { useSearchParams } from "react-router-dom";
import TopBar from "../../components/navigation/DashboardTopBar";
import FullScreenLoading from "../../components/FullScreenSpinner";
import ClassLocationMap from "../../components/maps/ClassLocationMap";

import { obtenerMiPerfil } from "../../services/Perfil.service";
import { obtenerDetalleClase } from "../../services/Entrenador.Service";

import type { Perfil } from "../../types";
import type { AlumnoClase, ClaseDetalle } from "../../types/claseDetalle";

export default function ClaseDetallePage() {
  const { id } = useParams();

  const [searchParams] = useSearchParams();

  const fechaOcurrencia = searchParams.get("fecha") ?? undefined;
  const navigate = useNavigate();

  const claseId = Number(id);

  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [clase, setClase] = useState<ClaseDetalle | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [ahora, setAhora] = useState(() => new Date());

  useEffect(() => {
    let componenteActivo = true;

    const cargar = async () => {
      if (!Number.isFinite(claseId) || claseId <= 0) {
        toast.error("La clase seleccionada no es válida.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const [perfilData, claseData] = await Promise.all([
          obtenerMiPerfil(),
          obtenerDetalleClase(claseId, fechaOcurrencia),
        ]);

        if (!componenteActivo) return;

        setPerfil(perfilData);
        setClase(claseData);
      } catch (error: any) {
        if (!componenteActivo) return;

        if (!error?.response || error.response.status >= 500) {
          console.error("[Detalle clase entrenador]", error);
        }

        toast.error(
          error?.response?.data?.mensaje ?? "No fue posible cargar la clase.",
        );
      } finally {
        if (componenteActivo) {
          setLoading(false);
        }
      }
    };

    void cargar();

    return () => {
      componenteActivo = false;
    };
  }, [claseId]);

  useEffect(() => {
    const intervalo = window.setInterval(() => {
      setAhora(new Date());
    }, 30_000);

    return () => window.clearInterval(intervalo);
  }, []);

  const alumnosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    if (!clase?.alumnos) return [];

    return clase.alumnos.filter((alumno) =>
      `${alumno.nombre} ${alumno.apellido}`.toLowerCase().includes(termino),
    );
  }, [clase, busqueda]);

  const presentes =
    clase?.alumnos.filter((alumno) => alumno.presente).length ?? 0;

  const pendientes = (clase?.alumnos.length ?? 0) - presentes;

  const tieneUbicacionValida =
    clase !== null &&
    Number.isFinite(clase.latitud) &&
    Number.isFinite(clase.longitud);

  const disponibilidadAsistencia = clase
    ? obtenerDisponibilidadAsistencia(
        clase.diaSemana,
        clase.horaInicio,
        clase.horaFin,
        ahora,
      )
    : null;

  if (loading) {
    return <FullScreenLoading />;
  }

  if (!clase) {
    return (
      <div className="min-h-screen bg-[#12201b] text-white">
        <TopBar nombre={perfil?.nombre} />

        <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 pt-16">
          <section className="w-full rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-10 text-center">
            <h1 className="text-2xl font-bold">No se encontró la clase</h1>

            <p className="mt-2 text-gray-400">
              La clase puede haber sido eliminada o ya no estar disponible.
            </p>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      <TopBar nombre={perfil?.nombre} />

      <main className="mx-auto w-full max-w-[1500px] px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-[#4adea8]/20 bg-gradient-to-r from-[#1a2b24] to-[#163129] p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#4adea8]/20 bg-[#12201b]">
                <FitnessCenterOutlinedIcon
                  sx={{ color: "#4adea8", fontSize: 30 }}
                />
              </div>

              <div>
                <span className="inline-flex rounded-full bg-[#4adea8] px-3 py-1 text-[11px] font-bold text-[#12201b]">
                  CLASE
                </span>

                <h1 className="mt-3 text-3xl font-bold md:text-4xl">
                  {clase.grupo}
                </h1>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-300">
                  <span className="inline-flex items-center gap-2">
                    <CalendarMonthOutlinedIcon
                      sx={{ color: "#4adea8", fontSize: 19 }}
                    />
                    {clase.diaSemana}
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <AccessTimeOutlinedIcon
                      sx={{ color: "#4adea8", fontSize: 19 }}
                    />
                    {formatearHora(clase.horaInicio)} -{" "}
                    {formatearHora(clase.horaFin)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-stretch gap-2 sm:items-end">
              <button
                type="button"
                disabled={!disponibilidadAsistencia?.habilitada}
                onClick={() => {
                  const fechaEfectiva =
                    fechaOcurrencia ?? clase.fechaOcurrencia?.substring(0, 10);

                  if (!fechaEfectiva) {
                    toast.error(
                      "No se pudo determinar la fecha de la ocurrencia.",
                    );
                    return;
                  }

                  navigate(
                    `/entrenador/clases/${clase.id}/asistencia?fecha=${fechaEfectiva}`,
                  );
                }}
                title={
                  !disponibilidadAsistencia?.habilitada
                    ? disponibilidadAsistencia?.mensaje
                    : undefined
                }
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#4adea8] px-5 font-bold text-[#12201b] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400 disabled:hover:brightness-100"
              >
                {disponibilidadAsistencia?.habilitada ? (
                  <FactCheckOutlinedIcon fontSize="small" />
                ) : (
                  <LockClockOutlinedIcon fontSize="small" />
                )}

                {disponibilidadAsistencia?.habilitada
                  ? "Tomar asistencia"
                  : "Asistencia no disponible"}
              </button>

              {disponibilidadAsistencia && (
                <p
                  className={`max-w-sm text-right text-xs ${
                    disponibilidadAsistencia.habilitada
                      ? "text-[#4adea8]"
                      : "text-yellow-300"
                  }`}
                >
                  {disponibilidadAsistencia.mensaje}
                </p>
              )}
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <section className="rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-5 sm:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#4adea8]">
                  Participantes
                </p>

                <h2 className="mt-1 text-2xl font-bold">Alumnos</h2>

                <p className="mt-1 text-sm text-gray-400">
                  {clase.inscriptos}{" "}
                  {clase.inscriptos === 1
                    ? "alumno inscripto"
                    : "alumnos inscriptos"}
                </p>
              </div>

              <div className="relative w-full md:max-w-sm">
                <SearchOutlinedIcon
                  sx={{
                    color: "#9ca3af",
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />

                <input
                  value={busqueda}
                  onChange={(event) => setBusqueda(event.target.value)}
                  placeholder="Buscar alumno..."
                  className="h-11 w-full rounded-xl border border-[#2d463b] bg-[#12201b] pl-11 pr-4 outline-none transition-all focus:border-[#4adea8]"
                />
              </div>
            </div>

            {clase.alumnos.length === 0 ? (
              <div className="py-16 text-center">
                <PeopleOutlineOutlinedIcon
                  sx={{ color: "#4adea8", fontSize: 40 }}
                />

                <h3 className="mt-4 text-xl font-bold">
                  No hay alumnos inscriptos
                </h3>

                <p className="mt-2 text-gray-400">
                  Cuando haya alumnos inscriptos aparecerán en esta lista.
                </p>
              </div>
            ) : alumnosFiltrados.length === 0 ? (
              <div className="py-14 text-center text-gray-400">
                No encontramos alumnos con esa búsqueda.
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {alumnosFiltrados.map((alumno) => (
                  <AlumnoDetalleCard key={alumno.id} alumno={alumno} />
                ))}
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-5">
              <h2 className="text-xl font-bold">Resumen</h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                <ResumenDato
                  icono={<PeopleOutlineOutlinedIcon />}
                  titulo="Alumnos inscriptos"
                  valor={`${clase.inscriptos} / ${clase.cupoMaximo}`}
                />

                <ResumenDato
                  icono={<CheckCircleOutlineOutlinedIcon />}
                  titulo="Asistencias registradas"
                  valor={String(presentes)}
                />

                <ResumenDato
                  icono={<PendingActionsOutlinedIcon />}
                  titulo="Pendientes"
                  valor={String(pendientes)}
                />
              </div>
            </section>

            <section className="rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#4adea8]/20 bg-[#4adea8]/10">
                  <LocationOnOutlinedIcon sx={{ color: "#4adea8" }} />
                </div>

                <div>
                  <h2 className="text-xl font-bold">Ubicación</h2>

                  <p className="mt-1 text-sm text-gray-400">
                    Radio permitido: {clase.radio} metros
                  </p>
                </div>
              </div>

              {tieneUbicacionValida ? (
                <div className="mt-5 overflow-hidden rounded-2xl border border-[#2d463b]">
                  <ClassLocationMap
                    latitud={clase.latitud}
                    longitud={clase.longitud}
                    radio={clase.radio}
                    editable={false}
                  />
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-[#2d463b] bg-[#12201b] p-6 text-center">
                  <LocationOnOutlinedIcon
                    sx={{ color: "#6b7280", fontSize: 34 }}
                  />

                  <p className="mt-3 font-semibold">Ubicación no disponible</p>

                  <p className="mt-1 text-sm text-gray-400">
                    Esta clase todavía no tiene coordenadas válidas.
                  </p>
                </div>
              )}
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

function AlumnoDetalleCard({ alumno }: { alumno: AlumnoClase }) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-[#2d463b] bg-[#20362d] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#12201b] text-[#4adea8]">
          <PeopleOutlineOutlinedIcon fontSize="small" />
        </div>

        <div>
          <h3 className="font-bold">
            {alumno.nombre} {alumno.apellido}
          </h3>

          <p className="mt-1 text-sm text-gray-400">
            Alumno inscripto en esta clase
          </p>
        </div>
      </div>

      <div
        className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${
          alumno.presente
            ? "border-[#4adea8]/30 bg-[#4adea8]/10 text-[#4adea8]"
            : "border-amber-500/30 bg-amber-500/10 text-amber-300"
        }`}
      >
        {alumno.presente ? (
          <>
            <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 17 }} />
            Asistencia registrada
          </>
        ) : (
          <>
            <PendingActionsOutlinedIcon sx={{ fontSize: 17 }} />
            Pendiente de registrar
          </>
        )}
      </div>
    </article>
  );
}

function ResumenDato({
  icono,
  titulo,
  valor,
}: {
  icono: React.ReactNode;
  titulo: string;
  valor: string;
}) {
  return (
    <div className="rounded-2xl border border-[#2d463b] bg-[#12201b] p-4">
      <div className="text-[#4adea8]">{icono}</div>

      <p className="mt-3 text-xs text-gray-500">{titulo}</p>

      <p className="mt-1 text-2xl font-bold">{valor}</p>
    </div>
  );
}

type DisponibilidadAsistencia = {
  habilitada: boolean;
  mensaje: string;
};

function obtenerDisponibilidadAsistencia(
  diaSemana: string,
  horaInicio: string,
  horaFin: string,
  fechaActual: Date,
): DisponibilidadAsistencia {
  const MINUTOS_ANTES = 15;
  const MINUTOS_DESPUES = 30;
  const MINUTOS_SEMANA = 7 * 24 * 60;

  const diaClase = obtenerNumeroDiaSemana(diaSemana);
  const inicioMinutos = obtenerMinutosHora(horaInicio);
  const finMinutos = obtenerMinutosHora(horaFin);

  if (diaClase === null || inicioMinutos === null || finMinutos === null) {
    return {
      habilitada: false,
      mensaje: "No se pudo validar el horario de la clase.",
    };
  }

  const ahoraUruguay = obtenerFechaUruguay(fechaActual);

  const minutoActualSemana =
    (ahoraUruguay.diaSemana - 1) * 1440 +
    ahoraUruguay.hora * 60 +
    ahoraUruguay.minuto;

  const inicioClaseSemana = (diaClase - 1) * 1440 + inicioMinutos;

  let finClaseSemana = (diaClase - 1) * 1440 + finMinutos;

  if (finClaseSemana <= inicioClaseSemana) {
    finClaseSemana += 1440;
  }

  const inicioVentana = inicioClaseSemana - MINUTOS_ANTES;
  const finVentana = finClaseSemana + MINUTOS_DESPUES;

  const candidatos = [
    minutoActualSemana,
    minutoActualSemana + MINUTOS_SEMANA,
    minutoActualSemana - MINUTOS_SEMANA,
  ];

  const habilitada = candidatos.some(
    (actual) => actual >= inicioVentana && actual <= finVentana,
  );

  if (habilitada) {
    return {
      habilitada: true,
      mensaje: "Registro habilitado dentro de la ventana permitida.",
    };
  }

  return {
    habilitada: false,
    mensaje: `Disponible el ${normalizarDiaTexto(
      diaSemana,
    )} de ${formatearMinutosDia(
      inicioMinutos - MINUTOS_ANTES,
    )} a ${formatearMinutosDia(finMinutos + MINUTOS_DESPUES)}.`,
  };
}

function obtenerFechaUruguay(fecha: Date) {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Montevideo",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(fecha);

  const valor = (tipo: Intl.DateTimeFormatPartTypes) =>
    partes.find((parte) => parte.type === tipo)?.value ?? "";

  const mapaDias: Record<string, number> = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 7,
  };

  return {
    diaSemana: mapaDias[valor("weekday")] ?? 1,
    hora: Number(valor("hour")),
    minuto: Number(valor("minute")),
  };
}

function obtenerNumeroDiaSemana(dia: string) {
  const normalizado = dia
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

  const mapa: Record<string, number> = {
    lunes: 1,
    martes: 2,
    miercoles: 3,
    jueves: 4,
    viernes: 5,
    sabado: 6,
    domingo: 7,
  };

  return mapa[normalizado] ?? null;
}

function obtenerMinutosHora(hora: string) {
  const coincidencia = hora?.match(/^(\d{1,2}):(\d{2})/);

  if (!coincidencia) return null;

  const horas = Number(coincidencia[1]);
  const minutos = Number(coincidencia[2]);

  if (horas < 0 || horas > 23 || minutos < 0 || minutos > 59) {
    return null;
  }

  return horas * 60 + minutos;
}

function formatearMinutosDia(minutosTotales: number) {
  const normalizado = ((minutosTotales % 1440) + 1440) % 1440;

  const horas = Math.floor(normalizado / 60);
  const minutos = normalizado % 60;

  return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(
    2,
    "0",
  )}`;
}

function normalizarDiaTexto(dia: string) {
  const normalizado = dia
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

  const mapa: Record<string, string> = {
    lunes: "lunes",
    martes: "martes",
    miercoles: "miércoles",
    jueves: "jueves",
    viernes: "viernes",
    sabado: "sábado",
    domingo: "domingo",
  };

  return mapa[normalizado] ?? dia;
}

function formatearHora(value: string) {
  return value?.substring(0, 5) ?? "--:--";
}
