import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";

import type {
  ClaseDisponibleEntrenador,
} from "../../../types/entrenadorClases";

type Props = {
  clase: ClaseDisponibleEntrenador;
  uniendose?: boolean;
  onUnirme: (clase: ClaseDisponibleEntrenador) => void;
};

export default function ClaseDisponibleCard({
  clase,
  uniendose = false,
  onUnirme,
}: Props) {
  return (
    <article className="h-full rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-5 sm:p-6 transition-all hover:-translate-y-1 hover:border-[#4adea8]/50">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-bold ${
              clase.tieneConflictoHorario
                ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                : "border-[#4adea8]/30 bg-[#4adea8]/10 text-[#4adea8]"
            }`}
          >
            {clase.tieneConflictoHorario && (
              <WarningAmberOutlinedIcon
                sx={{ fontSize: 16 }}
              />
            )}

            {clase.tieneConflictoHorario
              ? "Conflicto horario"
              : "Disponible"}
          </span>

          <h2 className="mt-4 break-words text-2xl font-bold">
            {clase.grupo}
          </h2>

          <p className="mt-1 text-gray-400">
            {clase.diaSemana}
          </p>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#4adea8]/20 bg-[#4adea8]/10">
          <PersonAddAltOutlinedIcon
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

      {clase.tieneConflictoHorario && (
        <p className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm leading-relaxed text-amber-100">
          Ya tenés una clase asignada en un horario superpuesto.
          Podrás confirmar igualmente antes de unirte.
        </p>
      )}

      <button
        type="button"
        disabled={uniendose}
        onClick={() => onUnirme(clase)}
        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#4adea8] font-bold text-[#12201b] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <PersonAddAltOutlinedIcon fontSize="small" />
        {uniendose ? "Uniéndome..." : "Unirme a la clase"}
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
