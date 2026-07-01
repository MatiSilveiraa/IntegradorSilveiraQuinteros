type Props = {
  texto: string;
  activo: boolean;
  onClick: () => void;
};

export default function BotonFiltro({
  texto,
  activo,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-5 py-3 rounded-xl border font-semibold transition-all ${
        activo
          ? "bg-[#4adea8] text-[#12201b] border-[#4adea8]"
          : "bg-[#12201b] text-gray-300 border-[#2d463b] hover:border-[#4adea8]"
      }`}
    >
      {texto}
    </button>
  );
}