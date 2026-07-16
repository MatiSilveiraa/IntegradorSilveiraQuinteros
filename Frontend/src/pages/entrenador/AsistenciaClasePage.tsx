import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import LockClockOutlinedIcon from "@mui/icons-material/LockClockOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { useSearchParams } from "react-router-dom";
import TopBar from "../../components/navigation/DashboardTopBar";
import FullScreenLoading from "../../components/FullScreenSpinner";
import { obtenerDetalleClase } from "../../services/Entrenador.Service";
import { registrarAsistencia } from "../../services/Asistencia.Service";
import type { AlumnoClase, ClaseDetalle } from "../../types/claseDetalle";

export default function AsistenciaClasePage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

const fechaOcurrencia =
    searchParams.get("fecha") ?? undefined;
  const navigate = useNavigate();

  const claseId = Number(id);
  const [registrandoAlumnoId, setRegistrandoAlumnoId] = useState<number | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [clase, setClase] = useState<ClaseDetalle | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [ahora, setAhora] = useState(() => new Date());

  useEffect(() => {
    let activo = true;
    const cargar = async () => {
      if (!Number.isFinite(claseId) || claseId <= 0) {
        toast.error("La clase seleccionada no es válida.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const detalle =
    await obtenerDetalleClase(
        claseId,
        fechaOcurrencia,
    );
        if (activo) setClase(detalle);
      } catch (error: any) {
        if (!activo) return;
        if (!error?.response || error.response.status >= 500) {
          console.error("[Tomar asistencia]", error);
        }
        toast.error(
          error?.response?.data?.mensaje ?? "No fue posible cargar la clase.",
        );
      } finally {
        if (activo) setLoading(false);
      }
    };

    void cargar();
    return () => {
      activo = false;
    };
  }, [claseId]);

  useEffect(() => {
    const intervalo = window.setInterval(() => {
      setAhora(new Date());
    }, 30_000);

    return () => window.clearInterval(intervalo);
  }, []);

  const handleRegistrarAsistencia = async (
  alumnoId: number,
  presente: boolean,
) => {
  if (!clase) return;

  if (!fechaOcurrencia) {
    toast.error(
      "No se pudo determinar la fecha de la ocurrencia.",
    );
    return;
  }

  const disponibilidad =
    obtenerDisponibilidadAsistencia(
      clase.diaSemana,
      clase.horaInicio,
      clase.horaFin,
      ahora,
    );

  if (!disponibilidad.habilitada) {
    toast.error(disponibilidad.mensaje);
    return;
  }

  try {
    setRegistrandoAlumnoId(alumnoId);

    await registrarAsistencia(
      alumnoId,
      claseId,
      presente,
      fechaOcurrencia,
    );

    setClase((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        alumnos: prev.alumnos.map((alumno) =>
          alumno.id === alumnoId
            ? {
                ...alumno,
                asistenciaRegistrada: true,
                presente,
              }
            : alumno,
        ),
      };
    });

    toast.success(
      presente
        ? "Asistencia registrada"
        : "Inasistencia registrada",
    );
  } catch (error: any) {
    console.error(
      "[Registrar asistencia]",
      error,
    );

    toast.error(
      error?.response?.data?.mensaje ??
        "No se pudo registrar la asistencia",
    );
  } finally {
    setRegistrandoAlumnoId(null);
  }
};

  const alumnosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    return (clase?.alumnos ?? []).filter((alumno) =>
      `${alumno.nombre} ${alumno.apellido}`.toLowerCase().includes(termino),
    );
  }, [clase, busqueda]);

  const registradas =
    clase?.alumnos.filter((alumno) => alumno.asistenciaRegistrada).length ?? 0;

  const pendientes = (clase?.alumnos.length ?? 0) - registradas;

  const disponibilidadAsistencia = clase
    ? obtenerDisponibilidadAsistencia(
        clase.diaSemana,
        clase.horaInicio,
        clase.horaFin,
        ahora,
      )
    : null;

  if (loading) return <FullScreenLoading />;

  if (!clase) {
    return (
      <div className="min-h-screen bg-[#12201b] text-white">
        <TopBar />
        <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 pt-16"></main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      <TopBar />

      <main className="mx-auto w-full max-w-[1500px] px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(`/entrenador/clases/${clase.id}`)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-[#4adea8]"
        >
          <ArrowBackOutlinedIcon fontSize="small" />
          Volver al detalle de la clase
        </button>

        <section className="rounded-3xl border border-[#4adea8]/20 bg-gradient-to-r from-[#1a2b24] to-[#163129] p-6 md:p-8">
          <span className="inline-flex rounded-full bg-[#4adea8] px-3 py-1 text-[11px] font-bold text-[#12201b]">
            REGISTRAR ASISTENCIA
          </span>
          <h1 className="mt-4 text-3xl font-bold md:text-4xl">{clase.grupo}</h1>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-300">
            <span className="inline-flex items-center gap-2">
              <CalendarMonthOutlinedIcon
                sx={{ color: "#4adea8", fontSize: 19 }}
              />
              {clase.diaSemana}
            </span>
            <span className="inline-flex items-center gap-2">
              <AccessTimeOutlinedIcon sx={{ color: "#4adea8", fontSize: 19 }} />
              {hora(clase.horaInicio)} - {hora(clase.horaFin)}
            </span>
            <span className="inline-flex items-center gap-2">
              <PeopleOutlineOutlinedIcon
                sx={{ color: "#4adea8", fontSize: 19 }}
              />
              {clase.inscriptos} / {clase.cupoMaximo} alumnos
            </span>
          </div>
        </section>

        {disponibilidadAsistencia && (
          <EstadoVentanaAsistencia
            disponibilidad={disponibilidadAsistencia}
          />
        )}

        <section className="mt-6 rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#4adea8]">
                Registro
              </p>
              <h2 className="mt-1 text-2xl font-bold">Lista de alumnos</h2>
              <p className="mt-2 text-sm text-gray-400">
                Revisá el estado de asistencia de cada alumno.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Resumen titulo="Total" valor={clase.alumnos.length} />
              <Resumen titulo="Registradas" valor={registradas} />
              <Resumen titulo="Pendientes" valor={pendientes} />
            </div>
          </div>

          <div className="relative mt-6">
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
              className="h-11 w-full rounded-xl border border-[#2d463b] bg-[#12201b] pl-11 pr-4 outline-none focus:border-[#4adea8]"
            />
          </div>

          {clase.alumnos.length === 0 ? (
            <div className="py-16 text-center text-gray-400">
              No hay alumnos inscriptos en esta clase.
            </div>
          ) : alumnosFiltrados.length === 0 ? (
            <div className="py-14 text-center text-gray-400">
              No encontramos alumnos con esa búsqueda.
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {alumnosFiltrados.map((alumno) => (
                <AlumnoEstado
                  key={alumno.id}
                  alumno={alumno}
                  registrado={alumno.asistenciaRegistrada}
                  registrando={registrandoAlumnoId === alumno.id}
                  registroHabilitado={
                    disponibilidadAsistencia?.habilitada ?? false
                  }
                  mensajeBloqueo={
                    disponibilidadAsistencia?.mensaje ??
                    "El registro no está disponible."
                  }
                  onRegistrar={(presente) =>
                    handleRegistrarAsistencia(
                      alumno.id,
                      presente,
                    )
                  }
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function AlumnoEstado({
  alumno,
  registrado,
  registrando,
  registroHabilitado,
  mensajeBloqueo,
  onRegistrar,
}: {
  alumno: AlumnoClase;
  registrado: boolean;
  registrando: boolean;
  registroHabilitado: boolean;
  mensajeBloqueo: string;
  onRegistrar: (presente: boolean) => void;
}) {
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

          <p className="mt-1 text-sm text-gray-400">Alumno inscripto</p>
        </div>
      </div>

      {registrado ? (
        alumno.presente ? (
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#4adea8]/30 bg-[#4adea8]/10 px-3 py-2 text-xs font-semibold text-[#4adea8]">
            <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 17 }} />
            Presente
          </div>
        ) : (
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400">
            ✕ Ausente
          </div>
        )
      ) : (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={registrando || !registroHabilitado}
            onClick={() => onRegistrar(true)}
            title={!registroHabilitado ? mensajeBloqueo : undefined}
            className="rounded-xl bg-[#4adea8] px-4 py-2 text-sm font-bold text-[#12201b] transition-all disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400 disabled:opacity-60"
          >
            {registrando
              ? "Registrando..."
              : "Registrar presente"}
          </button>

          <button
            type="button"
            disabled={registrando || !registroHabilitado}
            onClick={() => onRegistrar(false)}
            title={!registroHabilitado ? mensajeBloqueo : undefined}
            className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-400 transition-all disabled:cursor-not-allowed disabled:border-gray-700 disabled:bg-gray-800 disabled:text-gray-500 disabled:opacity-60"
          >
            {registrando
              ? "Registrando..."
              : "Registrar ausencia"}
          </button>
        </div>
      )}
    </article>
  );
}


type DisponibilidadAsistencia = {
  habilitada: boolean;
  estado: "disponible" | "anticipada" | "finalizada";
  titulo: string;
  mensaje: string;
  ventanaTexto: string;
};

function EstadoVentanaAsistencia({
  disponibilidad,
}: {
  disponibilidad: DisponibilidadAsistencia;
}) {
  const disponible = disponibilidad.habilitada;

  return (
    <section
      className={`mt-6 rounded-3xl border p-5 sm:p-6 ${
        disponible
          ? "border-[#4adea8]/30 bg-[#4adea8]/10"
          : "border-yellow-500/30 bg-yellow-500/10"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${
            disponible
              ? "border-[#4adea8]/30 bg-[#12201b] text-[#4adea8]"
              : "border-yellow-500/30 bg-[#12201b] text-yellow-300"
          }`}
        >
          {disponible ? (
            <EventAvailableOutlinedIcon />
          ) : disponibilidad.estado === "finalizada" ? (
            <LockClockOutlinedIcon />
          ) : (
            <WarningAmberOutlinedIcon />
          )}
        </div>

        <div>
          <p
            className={`text-xs font-bold uppercase tracking-wide ${
              disponible ? "text-[#4adea8]" : "text-yellow-300"
            }`}
          >
            Control de horario
          </p>

          <h2 className="mt-1 text-xl font-bold">
            {disponibilidad.titulo}
          </h2>

          <p className="mt-2 text-sm text-gray-300">
            {disponibilidad.mensaje}
          </p>

          <p className="mt-3 text-xs text-gray-400">
            Ventana permitida: {disponibilidad.ventanaTexto}
          </p>
        </div>
      </div>
    </section>
  );
}

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
  const finMinutosBase = obtenerMinutosHora(horaFin);

  if (
    diaClase === null ||
    inicioMinutos === null ||
    finMinutosBase === null
  ) {
    return {
      habilitada: false,
      estado: "anticipada",
      titulo: "No se pudo validar el horario",
      mensaje:
        "La información de día u horario de la clase no es válida.",
      ventanaTexto: "Horario no disponible",
    };
  }

  const ahoraUruguay = obtenerFechaUruguay(fechaActual);
  const minutoSemanaActual =
    (ahoraUruguay.diaSemana - 1) * 1440 +
    ahoraUruguay.hora * 60 +
    ahoraUruguay.minuto;

  const inicioClaseSemana =
    (diaClase - 1) * 1440 + inicioMinutos;

  let finClaseSemana =
    (diaClase - 1) * 1440 + finMinutosBase;

  if (finClaseSemana <= inicioClaseSemana) {
    finClaseSemana += 1440;
  }

  const inicioVentana =
    inicioClaseSemana - MINUTOS_ANTES;
  const finVentana =
    finClaseSemana + MINUTOS_DESPUES;

  const candidatosActuales = [
    minutoSemanaActual,
    minutoSemanaActual + MINUTOS_SEMANA,
    minutoSemanaActual - MINUTOS_SEMANA,
  ];

  const habilitada = candidatosActuales.some(
    (actual) =>
      actual >= inicioVentana && actual <= finVentana,
  );

  const ventanaTexto = `${normalizarDiaTexto(
    diaSemana,
  )}, ${formatearMinutoSemana(
    inicioVentana,
  )} a ${formatearMinutoSemana(finVentana)}`;

  if (habilitada) {
    return {
      habilitada: true,
      estado: "disponible",
      titulo: "Registro de asistencia disponible",
      mensaje:
        "Podés registrar presentes y ausencias durante esta ventana.",
      ventanaTexto,
    };
  }

  const diferenciaHastaInicio = distanciaFuturaSemanal(
    minutoSemanaActual,
    inicioVentana,
    MINUTOS_SEMANA,
  );

  const diferenciaDesdeFin = distanciaPasadaSemanal(
    minutoSemanaActual,
    finVentana,
    MINUTOS_SEMANA,
  );

  const esMismoDia =
    ahoraUruguay.diaSemana === diaClase;

  if (
    esMismoDia &&
    minutoSemanaActual > finVentana &&
    diferenciaDesdeFin < 12 * 60
  ) {
    return {
      habilitada: false,
      estado: "finalizada",
      titulo: "La ventana de registro finalizó",
      mensaje:
        "Ya no se pueden modificar asistencias desde esta pantalla.",
      ventanaTexto,
    };
  }

  return {
    habilitada: false,
    estado: "anticipada",
    titulo: "Registro de asistencia no disponible",
    mensaje:
      diferenciaHastaInicio < 24 * 60
        ? `Se habilitará en ${formatearDuracion(
            diferenciaHastaInicio,
          )}.`
        : `Solo se habilita el ${normalizarDiaTexto(
            diaSemana,
          )} dentro del horario permitido.`,
    ventanaTexto,
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

function obtenerMinutosHora(horaValor: string) {
  const coincidencia = horaValor?.match(
    /^(\d{1,2}):(\d{2})/,
  );

  if (!coincidencia) return null;

  const horas = Number(coincidencia[1]);
  const minutos = Number(coincidencia[2]);

  if (
    horas < 0 ||
    horas > 23 ||
    minutos < 0 ||
    minutos > 59
  ) {
    return null;
  }

  return horas * 60 + minutos;
}

function formatearMinutoSemana(minutoSemana: number) {
  const MINUTOS_SEMANA = 7 * 24 * 60;
  const normalizado =
    ((minutoSemana % MINUTOS_SEMANA) +
      MINUTOS_SEMANA) %
    MINUTOS_SEMANA;

  const minutoDia = normalizado % 1440;
  const horas = Math.floor(minutoDia / 60);
  const minutos = minutoDia % 60;

  return `${String(horas).padStart(2, "0")}:${String(
    minutos,
  ).padStart(2, "0")}`;
}

function distanciaFuturaSemanal(
  actual: number,
  objetivo: number,
  minutosSemana: number,
) {
  return (
    ((objetivo - actual) % minutosSemana) +
    minutosSemana
  ) % minutosSemana;
}

function distanciaPasadaSemanal(
  actual: number,
  objetivo: number,
  minutosSemana: number,
) {
  return (
    ((actual - objetivo) % minutosSemana) +
    minutosSemana
  ) % minutosSemana;
}

function formatearDuracion(minutosTotales: number) {
  if (minutosTotales < 60) {
    return `${minutosTotales} minutos`;
  }

  const horas = Math.floor(minutosTotales / 60);
  const minutos = minutosTotales % 60;

  if (minutos === 0) {
    return `${horas} ${
      horas === 1 ? "hora" : "horas"
    }`;
  }

  return `${horas} ${
    horas === 1 ? "hora" : "horas"
  } y ${minutos} minutos`;
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

function Resumen({ titulo, valor }: { titulo: string; valor: number }) {
  return (
    <div className="rounded-2xl border border-[#2d463b] bg-[#12201b] px-4 py-3 text-center">
      <p className="text-xs text-gray-400">{titulo}</p>
      <p className="mt-1 text-xl font-bold">{valor}</p>
    </div>
  );
}

function hora(value: string) {
  return value?.substring(0, 5) ?? "--:--";
}
