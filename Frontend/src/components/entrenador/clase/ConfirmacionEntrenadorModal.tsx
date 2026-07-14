import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

type Props = {
  abierto: boolean;
  titulo: string;
  descripcion: string;
  textoConfirmar: string;
  procesando?: boolean;
  peligro?: boolean;
  onCancelar: () => void;
  onConfirmar: () => void;
};

export default function ConfirmacionEntrenadorModal({
  abierto,
  titulo,
  descripcion,
  textoConfirmar,
  procesando = false,
  peligro = false,
  onCancelar,
  onConfirmar,
}: Props) {
  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cerrar confirmación"
        onClick={procesando ? undefined : onCancelar}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
      />

      <section
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-lg rounded-3xl border border-[#2d463b] bg-[#17251f] p-6 sm:p-8 shadow-2xl"
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${
              peligro
                ? "border-red-500/30 bg-red-500/10"
                : "border-amber-500/30 bg-amber-500/10"
            }`}
          >
            <WarningAmberOutlinedIcon
              sx={{
                color: peligro ? "#f87171" : "#fbbf24",
                fontSize: 32,
              }}
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">
              {titulo}
            </h2>

            <p className="mt-3 leading-relaxed text-gray-300">
              {descripcion}
            </p>
          </div>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            disabled={procesando}
            onClick={onCancelar}
            className="h-12 rounded-xl border border-[#2d463b] bg-[#12201b] font-semibold text-gray-200 transition-all hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={procesando}
            onClick={onConfirmar}
            className={`flex h-12 items-center justify-center gap-2 rounded-xl font-bold transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 ${
              peligro
                ? "bg-red-500 text-white"
                : "bg-[#4adea8] text-[#12201b]"
            }`}
          >
            {procesando ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-current/30 border-t-current" />
                Procesando...
              </>
            ) : (
              textoConfirmar
            )}
          </button>
        </div>
      </section>
    </div>
  );
}
