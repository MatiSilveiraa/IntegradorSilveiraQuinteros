type Props = {
  onGuardar: () => void;
  onCancelar: () => void;
};

export default function PerfilBotones({
  onGuardar,
  onCancelar,
}: Props) {
  return (
    <div className="flex gap-4 mt-8">

      <button
        onClick={onGuardar}
        className="
          flex-1
          py-4
          rounded-xl
          bg-[#4adea8]
          text-[#12201b]
          font-bold
          hover:opacity-90
          transition-all
        "
      >
        Guardar cambios
      </button>

      <button
        onClick={onCancelar}
        className="
          flex-1
          py-4
          rounded-xl
          border
          border-[#2d463b]
          hover:bg-[#1a211d]
          transition-all
        "
      >
        Cancelar
      </button>

    </div>
  );
}