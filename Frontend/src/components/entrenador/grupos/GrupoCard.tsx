import { Link } from "react-router-dom";

import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";

import type { GrupoEntrenador } from "../../../types/grupoEntrenador";

type Props = {
  grupo: GrupoEntrenador;
};

export default function GrupoCard({ grupo }: Props) {
  const tieneProximaClase =
    grupo.claseId !== null &&
    grupo.fechaProximaClase !== null;

  const inscriptos = grupo.inscriptos ?? 0;
  const cupoMaximo = grupo.cupoMaximo ?? 0;
  const cuposDisponibles = grupo.cuposDisponibles ?? 0;

  const porcentajeOcupacion =
    cupoMaximo > 0
      ? Math.min(
          100,
          Math.round((inscriptos * 100) / cupoMaximo),
        )
      : 0;

  const estadoActivo =
    grupo.estado.toUpperCase() === "ACTIVO";

  return (
    <article className="h-full flex flex-col rounded-3xl bg-[#1a2b24] border border-[#2d463b] p-5 sm:p-6 hover:border-[#4adea8]/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0">
          <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#4adea8]/10 border border-[#4adea8]/20 flex items-center justify-center">
            <FitnessCenterOutlinedIcon
              sx={{ fontSize: 26, color: "#4adea8" }}
            />
          </div>

          <div className="min-w-0">
            <h3 className="text-xl font-bold leading-snug break-words">
              {grupo.nombre}
            </h3>

            <p className="text-sm text-gray-400 mt-1">
              Nivel {grupo.nivel}
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 px-3 py-1 rounded-full border text-[11px] font-bold ${
            estadoActivo
              ? "bg-[#4adea8]/10 border-[#4adea8]/30 text-[#4adea8]"
              : "bg-amber-500/10 border-amber-500/30 text-amber-300"
          }`}
        >
          {grupo.estado}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">
        <InfoMini
          icono={<GroupsOutlinedIcon />}
          titulo="Alumnos"
          valor={`${grupo.cantidadAlumnos} ${
            grupo.cantidadAlumnos === 1 ? "alumno" : "alumnos"
          }`}
        />

        <InfoMini
          icono={<CalendarMonthOutlinedIcon />}
          titulo="Frecuencia"
          valor={`${grupo.cantidadClases} ${
            grupo.cantidadClases === 1 ? "clase" : "clases"
          }`}
        />
      </div>

      <div className="mt-4 rounded-2xl bg-[#12201b] border border-[#2d463b] p-4">
        <div className="flex items-center gap-2 text-[#4adea8]">
          <EventAvailableOutlinedIcon fontSize="small" />

          <p className="text-xs font-bold uppercase tracking-wide">
            Próxima clase
          </p>
        </div>

        {tieneProximaClase ? (
          <>
            <p className="font-bold mt-3 capitalize">
              {formatearFechaProximaClase(
                grupo.fechaProximaClase as string,
              )}
            </p>

            <div className="flex items-center gap-2 text-sm text-gray-300 mt-1">
              <AccessTimeOutlinedIcon fontSize="small" />

              <span>
                {formatearHora(grupo.proximaHoraInicio)} -{" "}
                {formatearHora(grupo.proximaHoraFin)}
              </span>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between gap-4 text-xs">
                <span className="text-gray-400">
                  Ocupación
                </span>

                <span className="font-semibold">
                  {inscriptos}/{cupoMaximo}
                </span>
              </div>

              <div className="h-2 mt-2 rounded-full bg-[#1a2b24] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#4adea8]"
                  style={{ width: `${porcentajeOcupacion}%` }}
                />
              </div>

              <p className="text-xs text-gray-500 mt-2">
                {cuposDisponibles}{" "}
                {cuposDisponibles === 1
                  ? "lugar disponible"
                  : "lugares disponibles"}
              </p>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-400 mt-3">
            Este grupo no tiene una próxima clase programada.
          </p>
        )}
      </div>

      <div
        className={`grid gap-3 mt-auto pt-5 ${
          tieneProximaClase
            ? "grid-cols-1 sm:grid-cols-2"
            : "grid-cols-1"
        }`}
      >
        <Link
          to={`/entrenador/grupos/${grupo.id}`}
          className="h-12 rounded-xl bg-[#4adea8] text-[#12201b] font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all"
        >
          Ver grupo
          <ArrowForwardOutlinedIcon fontSize="small" />
        </Link>

        {tieneProximaClase && grupo.claseId !== null && (
          <Link
            to={`/entrenador/clases/${grupo.claseId}`}
            className="h-12 rounded-xl bg-[#12201b] border border-[#2d463b] text-white font-semibold flex items-center justify-center gap-2 hover:border-[#4adea8] transition-all"
          >
            Ver próxima
          </Link>
        )}
      </div>
    </article>
  );
}

function InfoMini({
  icono,
  titulo,
  valor,
}: {
  icono: React.ReactNode;
  titulo: string;
  valor: string;
}) {
  return (
    <div className="rounded-2xl bg-[#12201b] border border-[#2d463b] p-4">
      <div className="text-[#4adea8]">{icono}</div>
      <p className="text-xs text-gray-500 mt-3">{titulo}</p>
      <p className="font-semibold mt-1">{valor}</p>
    </div>
  );
}

function formatearHora(hora?: string | null) {
  return hora?.substring(0, 5) ?? "--:--";
}

function formatearFechaProximaClase(fecha: string) {
  return new Date(fecha).toLocaleDateString("es-UY", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    timeZone: "America/Montevideo",
  });
}
