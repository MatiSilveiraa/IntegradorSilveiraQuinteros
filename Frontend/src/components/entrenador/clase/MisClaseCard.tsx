import { useNavigate } from "react-router-dom";

import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";

import type {
  ClaseAsignadaEntrenador,
} from "../../../types/entrenadorClases";

type Props = {
  clase: ClaseAsignadaEntrenador;
  abandonando?: boolean;
  onAbandonar: (clase: ClaseAsignadaEntrenador) => void;
};

export default function MisClaseCard({
  clase,
  abandonando = false,
  onAbandonar,
}: Props) {
  const navigate = useNavigate();

  const porcentaje =
    clase.cupoMaximo > 0
      ? Math.min(
          100,
          Math.round(
            (clase.cantidadAlumnos * 100) /
              clase.cupoMaximo,
          ),
        )
      : 0;

  return (
    <article className="h-full rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-5 sm:p-6 transition-all hover:-translate-y-1 hover:border-[#4adea8]/50 hover:shadow-xl hover:shadow-black/20">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[#4adea8]/30 bg-[#4adea8]/10 px-3 py-1 text-[11px] font-bold text-[#4adea8]">
              {clase.estado}
            </span>

            {clase.esPrincipal && (
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-bold text-amber-300">
                Principal
              </span>
            )}
          </div>

          <h2 className="mt-4 break-words text-2xl font-bold">
            {clase.grupo}
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            {clase.diaSemana}
          </p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#4adea8]/20 bg-[#4adea8]/10">
          <CalendarMonthOutlinedIcon
            sx={{ color: "#4adea8" }}
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Dato
          icono={<AccessTimeOutlinedIcon />}
          titulo="Horario"
          valor={`${hora(clase.horaInicio)} - ${hora(
            clase.horaFin,
          )}`}
        />

        <Dato
          icono={<GroupsOutlinedIcon />}
          titulo="Entrenadores"
          valor={String(clase.cantidadEntrenadores)}
        />
      </div>

      <div className="mt-4 rounded-2xl border border-[#2d463b] bg-[#12201b] p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <PeopleOutlineOutlinedIcon
              sx={{ color: "#4adea8", fontSize: 20 }}
            />

            {clase.cantidadAlumnos}/{clase.cupoMaximo} alumnos
          </div>

          <span className="text-sm font-semibold">
            {porcentaje}%
          </span>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#1a2b24]">
          <div
            className="h-full rounded-full bg-[#4adea8]"
            style={{ width: `${porcentaje}%` }}
          />
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() =>
            navigate(
              `/entrenador/clases/${clase.claseId}`,
            )
          }
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#2d463b] bg-[#12201b] font-semibold transition-all hover:border-[#4adea8]"
        >
          <VisibilityOutlinedIcon fontSize="small" />
          Ver detalle
        </button>

        <button
          type="button"
          onClick={() =>
            navigate(
              `/entrenador/clases/${clase.claseId}/asistencia`,
            )
          }
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#4adea8] font-bold text-[#12201b] transition-all hover:brightness-110"
        >
          <FactCheckOutlinedIcon fontSize="small" />
          Asistencia
        </button>
      </div>

      <button
        type="button"
        disabled={abandonando}
        onClick={() => onAbandonar(clase)}
        className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 font-semibold text-red-400 transition-all hover:bg-red-500/20 disabled:opacity-50"
      >
        <ExitToAppOutlinedIcon fontSize="small" />
        Abandonar clase
      </button>
    </article>
  );
}

function Dato({
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
      <p className="mt-1 font-semibold">{valor}</p>
    </div>
  );
}

function hora(value: string) {
  return value.substring(0, 5);
}
