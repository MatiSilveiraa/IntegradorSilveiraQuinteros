type Props = {
  onGuardar: () => void;
  onCancelar: () => void;
  guardando?: boolean;
};

export default function PerfilBotones({
  onGuardar,
  onCancelar,
  guardando = false,
}: Props) {
  return (
    <div className="sticky bottom-4 z-30 mt-8">
      <div className="rounded-3xl border border-[#4adea8]/30 bg-[#0e1914]/95 backdrop-blur-xl p-4 shadow-2xl shadow-black/40">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="hidden sm:block">
            <p className="font-bold text-white">
              Modo edición activo
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Guardá los cambios antes de salir.
            </p>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:ml-auto">
            <button
              type="button"
              onClick={onCancelar}
              disabled={guardando}
              className="px-6 py-3 rounded-xl border border-[#2d463b] bg-[#12201b] text-gray-200 font-semibold hover:border-amber-400 hover:text-amber-300 disabled:opacity-50 transition-all"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={onGuardar}
              disabled={guardando}
              className="px-6 py-3 rounded-xl bg-[#4adea8] text-[#12201b] font-bold hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all"
            >
              {guardando ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}