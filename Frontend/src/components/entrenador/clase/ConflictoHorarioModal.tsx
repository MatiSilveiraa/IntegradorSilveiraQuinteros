import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";

import type {
  ConflictoHorarioEntrenador,
} from "../../../types/entrenadorClases";

type Props = {
  abierto: boolean;
  mensaje: string;
  conflictos: ConflictoHorarioEntrenador[];
  procesando: boolean;
  onCancelar: () => void;
  onConfirmar: () => void;
};

export default function ConflictoHorarioModal({
  abierto,
  mensaje,
  conflictos,
  procesando,
  onCancelar,
  onConfirmar,
}: Props) {
  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cerrar advertencia"
        onClick={procesando ? undefined : onCancelar}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
      />

      <section
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-amber-500/30 bg-[#17251f] p-6 sm:p-8 shadow-2xl"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10">
            <WarningAmberOutlinedIcon
              sx={{ color: "#fbbf24", fontSize: 32 }}
            />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-amber-300">
              Conflicto horario
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              Ya tenés otra clase en ese horario
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-gray-300">
              {mensaje}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {conflictos.map((conflicto, index) => (
            <article
              key={`${conflicto.claseId}-${index}`}
              className="rounded-2xl border border-[#2d463b] bg-[#12201b] p-4"
            >
              <div className="flex items-center gap-2 font-bold text-white">
                <GroupsOutlinedIcon
                  sx={{ color: "#4adea8", fontSize: 20 }}
                />
                {conflicto.grupo}
              </div>

              <div className="mt-3 flex items-center gap-2 text-sm text-gray-300">
                <AccessTimeOutlinedIcon
                  sx={{ color: "#4adea8", fontSize: 19 }}
                />

                {conflicto.diaSemana} ·{" "}
                {formatearHora(conflicto.horaInicio)} a{" "}
                {formatearHora(conflicto.horaFin)}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            disabled={procesando}
            onClick={onCancelar}
            className="h-12 rounded-xl border border-[#2d463b] bg-[#12201b] font-semibold text-gray-200 transition-all hover:border-white/40 disabled:opacity-50"
          >
            Volver
          </button>

          <button
            type="button"
            disabled={procesando}
            onClick={onConfirmar}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-amber-400 font-bold text-[#12201b] transition-all hover:brightness-110 disabled:opacity-50"
          >
            {procesando ? "Uniéndome..." : "Unirme igualmente"}
          </button>
        </div>
      </section>
    </div>
  );
}

function formatearHora(hora: string) {
  return hora.substring(0, 5);
}
