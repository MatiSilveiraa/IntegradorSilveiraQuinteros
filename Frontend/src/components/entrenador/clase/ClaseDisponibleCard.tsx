import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

import type {
  ClaseDisponibleEntrenador,
} from "../../../types/entrenadorClases";

type Props = {
  clase: ClaseDisponibleEntrenador;
  uniendose?: boolean;
  onVerDetalle: (clase: ClaseDisponibleEntrenador) => void;
  onUnirme: (clase: ClaseDisponibleEntrenador) => void;
};

export default function ClaseDisponibleCard({
  clase,
  uniendose = false,
  onVerDetalle,
  onUnirme,
}: Props) {
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
    <article className="flex h-full flex-col rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-5 transition-all hover:-translate-y-1 hover:border-[#4adea8]/50 hover:shadow-xl hover:shadow-black/20 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[#4adea8]/30 bg-[#4adea8]/10 px-3 py-1 text-[11px] font-bold text-[#4adea8]">
              {clase.estado}
            </span>

            {clase.tieneConflictoHorario && (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-bold text-amber-300">
                <WarningAmberOutlinedIcon sx={{ fontSize: 15 }} />
                Posible conflicto
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
          <PersonAddAltOutlinedIcon sx={{ color: "#4adea8" }} />
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

        <Dato
          icono={<CalendarMonthOutlinedIcon />}
          titulo="Vigencia"
          valor={
            clase.fechaFin
              ? `${fecha(clase.fechaInicio)} - ${fecha(
                  clase.fechaFin,
                )}`
              : `Desde ${fecha(clase.fechaInicio)}`
          }
        />

        <Dato
          icono={<LocationOnOutlinedIcon />}
          titulo="Radio"
          valor={`${clase.radioGeolocalizacion} m`}
        />
      </div>

      <div className="mt-4 rounded-2xl border border-[#2d463b] bg-[#12201b] p-4">
        <div className="flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 text-sm text-gray-300">
            <PeopleOutlineOutlinedIcon
              sx={{ color: "#4adea8", fontSize: 20 }}
            />
            {clase.cantidadAlumnos}/{clase.cupoMaximo} alumnos
          </span>

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

      {clase.tieneConflictoHorario && (
        <p className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm leading-relaxed text-amber-100">
          Ya tenés una clase en un horario superpuesto. Podés revisar
          los datos y confirmar igualmente al intentar unirte.
        </p>
      )}

      <div className="mt-auto grid gap-3 pt-5 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onVerDetalle(clase)}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#2d463b] bg-[#12201b] font-semibold transition-all hover:border-[#4adea8]"
        >
          <VisibilityOutlinedIcon fontSize="small" />
          Ver detalle
        </button>

        <button
          type="button"
          disabled={uniendose}
          onClick={() => onUnirme(clase)}
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#4adea8] font-bold text-[#12201b] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <PersonAddAltOutlinedIcon fontSize="small" />
          {uniendose ? "Uniéndome..." : "Unirme"}
        </button>
      </div>
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
    <div className="min-w-0 rounded-2xl border border-[#2d463b] bg-[#12201b] p-4">
      <div className="text-[#4adea8]">{icono}</div>
      <p className="mt-3 text-xs text-gray-500">{titulo}</p>
      <p className="mt-1 break-words text-sm font-semibold">
        {valor}
      </p>
    </div>
  );
}

function hora(value: string) {
  return value?.substring(0, 5) ?? "--:--";
}

function fecha(value: string) {
  return new Date(value).toLocaleDateString("es-UY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Montevideo",
  });
}
