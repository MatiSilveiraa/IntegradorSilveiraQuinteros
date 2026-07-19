type Props = {
  nombre?: string;
  apellido?: string;
  editando: boolean;
  onEditar: () => void;
};

export default function PerfilHero({
  nombre,
  apellido,
  editando,
}: Props) {
  return (
    <section
      className={`
        rounded-3xl
        border
        p-6
        md:p-8
        mb-8
        transition-all
        ${
          editando
            ? "border-amber-500/40 bg-gradient-to-r from-[#1a2b24] to-amber-500/10"
            : "border-[#4adea8]/20 bg-gradient-to-r from-[#1a2b24] to-[#163129]"
        }
      `}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <span
            className={`
              inline-flex
              px-3
              py-1
              rounded-full
              text-xs
              font-bold
              ${
                editando
                  ? "bg-amber-500 text-black"
                  : "bg-[#4adea8] text-[#12201b]"
              }
            `}
          >
            {editando ? "EDITANDO PERFIL" : "MI PERFIL"}
          </span>

          <h1 className="text-3xl md:text-4xl font-bold mt-4">
            {editando
              ? "Editando tu información"
              : `Hola, ${nombre ?? ""} ${apellido ?? ""}`}
          </h1>

          <p className="text-gray-300 mt-2 max-w-2xl">
            {editando
              ? "Los campos editables están resaltados. El correo electrónico permanece bloqueado."
              : "Gestioná tu información personal y consultá el estado de tu cuenta."}
          </p>
        </div>
      </div>
    </section>
  );
}