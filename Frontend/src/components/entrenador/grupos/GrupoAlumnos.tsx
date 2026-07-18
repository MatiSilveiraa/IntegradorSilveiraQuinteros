import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import LocalFireDepartmentOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

import type { AlumnoGrupo } from "../../../types/grupoDetalle";

type Props = {
  alumnos: AlumnoGrupo[];
};

export default function GrupoAlumnos({
  alumnos,
}: Props) {
  return (
    <section>
      {/* Cabecera */}
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#4adea8]">
            Plantel
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            Alumnos inscriptos
          </h2>
        </div>

        <span className="rounded-full border border-[#4adea8]/30 bg-[#4adea8]/10 px-3 py-1 text-sm font-bold text-[#4adea8]">
          {alumnos.length}
        </span>
      </div>

      {/* Sin alumnos */}
      {alumnos.length === 0 ? (
        <div className="rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-10 text-center">
          <PeopleOutlineOutlinedIcon
            sx={{
              color: "#4adea8",
              fontSize: 38,
            }}
          />

          <h3 className="mt-4 text-xl font-bold">
            Sin alumnos inscriptos
          </h3>

          <p className="mt-2 text-gray-400">
            Todavía no hay alumnos en este grupo.
          </p>
        </div>
      ) : (
        /* Lista de alumnos */
        <div className="space-y-4">
          {alumnos.map((alumno) => {
            const bloqueado =
              alumno.bloqueadoPorInasistencias ||
              alumno.bloqueadoPorDeuda;

            return (
              <article
  key={alumno.id}
  className="rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-5 transition-all hover:border-[#4adea8]/40"
>
  {/* Información del alumno */}
  <div className="flex items-start gap-4">
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#4adea8]/30 bg-[#4adea8]/10">
      <PersonOutlinedIcon
        sx={{
          color: "#4adea8",
        }}
      />
    </div>

    <div className="min-w-0 flex-1">
      <h3 className="text-lg font-bold">
        {alumno.nombre} {alumno.apellido}
      </h3>

      <span
        className={`mt-1 inline-flex items-center gap-1 text-sm ${
          bloqueado
            ? "text-red-400"
            : "text-green-400"
        }`}
      >
        {bloqueado ? (
          <LockOutlinedIcon fontSize="small" />
        ) : (
          <LockOpenOutlinedIcon fontSize="small" />
        )}

        {bloqueado ? "Bloqueado" : "Activo"}
      </span>

      {bloqueado && (
        <div className="mt-2 flex flex-wrap gap-2">
          {alumno.bloqueadoPorInasistencias && (
            <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2 py-1 text-[11px] font-semibold text-red-400">
              Por inasistencias
            </span>
          )}

          {alumno.bloqueadoPorDeuda && (
            <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2 py-1 text-[11px] font-semibold text-red-400">
              Por deuda
            </span>
          )}
        </div>
      )}
    </div>
  </div>

  {/* Estadísticas */}
  <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
    <DatoAlumno
      icono={<CheckCircleOutlineOutlinedIcon />}
      titulo="Asistencia"
      valor={`${alumno.porcentajeAsistencia ?? 0}%`}
      detalle={`${alumno.asistenciasPresentes ?? 0} de ${
        alumno.totalClasesEvaluadas ?? 0
      } clases`}
      claseValor={obtenerColorAsistencia(
        alumno.porcentajeAsistencia ?? 0,
      )}
    />

    <DatoAlumno
      icono={<LocalFireDepartmentOutlinedIcon />}
      titulo="Racha actual"
      valor={`${alumno.rachaActual ?? 0}`}
      detalle={
        (alumno.rachaActual ?? 0) === 1
          ? "clase consecutiva"
          : "clases consecutivas"
      }
    />

    <DatoAlumno
      icono={<EventAvailableOutlinedIcon />}
      titulo="Última asistencia"
      valor={formatearUltimaAsistencia(
        alumno.ultimaAsistencia,
      )}
    />

    <DatoAlumno
      icono={<WarningAmberOutlinedIcon />}
      titulo="Faltas consecutivas"
      valor={`${alumno.inasistenciasConsecutivas ?? 0}`}
      detalle={
        (alumno.inasistenciasConsecutivas ?? 0) === 1
          ? "inasistencia"
          : "inasistencias"
      }
      claseValor={obtenerColorInasistencias(
        alumno.inasistenciasConsecutivas ?? 0,
      )}
    />
  </div>
</article>
            );
          })}
        </div>
      )}
    </section>
  );
}

/* =====================================================
   TARJETA DE INFORMACIÓN
===================================================== */

function DatoAlumno({
  icono,
  titulo,
  valor,
  detalle,
  claseValor = "text-white",
}: {
  icono: React.ReactNode;
  titulo: string;
  valor: string;
  detalle?: string;
  claseValor?: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-[#2d463b] bg-[#12201b] p-4">
      {/* Título e icono */}
      <div className="flex items-center gap-2">
        <div className="flex shrink-0 items-center text-[#4adea8]">
          {icono}
        </div>

        <p className="text-xs font-medium text-gray-400">
          {titulo}
        </p>
      </div>

      {/* Valor */}
      <p
        className={`mt-3 text-xl font-bold ${claseValor}`}
      >
        {valor}
      </p>

      {/* Detalle */}
      {detalle && (
        <p className="mt-1 text-xs leading-relaxed text-gray-500">
          {detalle}
        </p>
      )}
    </div>
  );
}

/* =====================================================
   COLOR SEGÚN ASISTENCIA
===================================================== */

function obtenerColorAsistencia(
  porcentaje: number,
) {
  if (porcentaje >= 80) {
    return "text-[#4adea8]";
  }

  if (porcentaje >= 60) {
    return "text-yellow-300";
  }

  return "text-red-400";
}

/* =====================================================
   COLOR SEGÚN INASISTENCIAS
===================================================== */

function obtenerColorInasistencias(
  cantidad: number,
) {
  if (cantidad >= 3) {
    return "text-red-400";
  }

  if (cantidad > 0) {
    return "text-yellow-300";
  }

  return "text-[#4adea8]";
}

/* =====================================================
   FORMATEAR ÚLTIMA ASISTENCIA
===================================================== */

function formatearUltimaAsistencia(
  fecha?: string | null,
) {
  if (!fecha) {
    return "Sin registro";
  }

  const fechaAsistencia =
    new Date(fecha);

  if (Number.isNaN(fechaAsistencia.getTime())) {
    return "Sin registro";
  }

  return fechaAsistencia.toLocaleDateString(
    "es-UY",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  );
}