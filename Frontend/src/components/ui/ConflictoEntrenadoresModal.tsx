import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

import type {
  ConflictoEntrenadorClase,
} from "../../types";

type Props = {
  abierto: boolean;
  mensaje: string;
  conflictos: ConflictoEntrenadorClase[];
  confirmando: boolean;
  onCancelar: () => void;
  onConfirmar: () => void;
};

export default function ConflictoEntrenadoresModal({
  abierto,
  mensaje,
  conflictos,
  confirmando,
  onCancelar,
  onConfirmar,
}: Props) {
  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cerrar advertencia"
        onClick={confirmando ? undefined : onCancelar}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-conflicto-entrenadores"
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
              Confirmación requerida
            </p>

            <h2
              id="titulo-conflicto-entrenadores"
              className="mt-2 text-2xl font-bold text-white"
            >
              Conflicto de horarios
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-gray-300">
              {mensaje}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {conflictos.map((conflicto, index) => (
            <article
              key={`${conflicto.entrenadorId}-${conflicto.claseId}-${index}`}
              className="rounded-2xl border border-[#2d463b] bg-[#12201b] p-4"
            >
              <div className="flex items-center gap-3">
                <PersonOutlineOutlinedIcon
                  sx={{ color: "#4adea8" }}
                />

                <p className="font-bold text-white">
                  {conflicto.entrenador}
                </p>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <GroupsOutlinedIcon
                    sx={{ color: "#4adea8", fontSize: 19 }}
                  />
                  {conflicto.grupo}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <AccessTimeOutlinedIcon
                    sx={{ color: "#4adea8", fontSize: 19 }}
                  />
                  {conflicto.diaSemana} ·{" "}
                  {formatearHora(conflicto.horaInicio)} a{" "}
                  {formatearHora(conflicto.horaFin)}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-7 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-sm leading-relaxed text-amber-100">
            Al continuar, la clase se guardará aunque uno o más
            entrenadores tengan otra asignación superpuesta.
          </p>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            disabled={confirmando}
            onClick={onCancelar}
            className="h-12 rounded-xl border border-[#2d463b] bg-[#12201b] font-semibold text-gray-200 transition-all hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Volver y revisar
          </button>

          <button
            type="button"
            disabled={confirmando}
            onClick={onConfirmar}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-amber-400 font-bold text-[#12201b] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {confirmando ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#12201b]/30 border-t-[#12201b]" />
                Guardando...
              </>
            ) : (
              "Guardar igualmente"
            )}
          </button>
        </div>
      </section>
    </div>
  );
}

function formatearHora(hora: string) {
  return hora?.substring(0, 5) ?? "--:--";
}
