type Props = {
  nombre?: string;
  apellido?: string;
  editando: boolean;
  onEditar: () => void;
};

export default function PerfilHero({
  nombre,
  apellido,
  onEditar,
}: Props) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-[#4adea8]/20
        bg-gradient-to-r
        from-[#1a2b24]
        to-[#163129]
        p-8
        mb-8
      "
    >
      <div className="flex justify-between items-center">
        <div>
          <span
            className="
              inline-block
              px-3
              py-1
              rounded-full
              bg-[#4adea8]
              text-[#12201b]
              text-xs
              font-bold
            "
          >
            MI PERFIL
          </span>

          <h1 className="text-4xl font-bold mt-4">
            Hola, {nombre} {apellido} 
          </h1>

          <p className="text-gray-300 mt-2">
            Gestiona tu información personal y el estado de tu cuenta.
          </p>
        </div>

        <button
          onClick={onEditar}
          className="
            px-6
            py-3
            rounded-xl
            bg-[#4adea8]
            text-[#12201b]
            font-bold
            hover:opacity-90
            transition-all
          "
        >
          Editar Perfil
        </button>
      </div>
    </div>
  );
}