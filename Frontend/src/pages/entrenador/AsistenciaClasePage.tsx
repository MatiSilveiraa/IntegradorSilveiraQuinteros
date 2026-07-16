import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

import TopBar from "../../components/navigation/DashboardTopBar";
import FullScreenLoading from "../../components/FullScreenSpinner";
import { obtenerDetalleClase } from "../../services/Entrenador.Service";
import { registrarAsistencia } from "../../services/Asistencia.Service";
import type { AlumnoClase, ClaseDetalle } from "../../types/claseDetalle";

export default function AsistenciaClasePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const claseId = Number(id);
  const [registrandoAlumnoId, setRegistrandoAlumnoId] = useState<number | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [clase, setClase] = useState<ClaseDetalle | null>(null);
  const [busqueda, setBusqueda] = useState("");

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
        const detalle = await obtenerDetalleClase(claseId);
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

  const handleRegistrarAsistencia = async (
  alumnoId: number,
  presente: boolean,
) => {
  try {
    setRegistrandoAlumnoId(alumnoId);

    await registrarAsistencia(
      alumnoId,
      claseId,
      presente,
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
  onRegistrar={(presente) =>
    handleRegistrarAsistencia(alumno.id, presente)
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
  onRegistrar,
}: {
  alumno: AlumnoClase;
  registrado: boolean;
  registrando: boolean;
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
            disabled={registrando}
            onClick={() => onRegistrar(true)}
            className="rounded-xl bg-[#4adea8] px-4 py-2 text-sm font-bold text-[#12201b] disabled:opacity-50"
          >
            {registrando ? "Registrando..." : "Presente"}
          </button>

          <button
            type="button"
            disabled={registrando}
            onClick={() => onRegistrar(false)}
            className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-400 disabled:opacity-50"
          >
            {registrando ? "Registrando..." : "Ausente"}
          </button>
        </div>
      )}
    </article>
  );
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
