import type { Perfil } from "../../types";

type Props = {
  perfil: Perfil;
};

export default function PerfilAvatar({
  perfil,
}: Props) {
  return (
    <div
      className="
        bg-[#1a211d]
        border
        border-[#2d463b]
        rounded-2xl
        p-8
        mb-8
        flex
        flex-col
        items-center
      "
    >
      <div
        className="
          w-32
          h-32
          rounded-full
          border-4
          border-[#4adea8]
          bg-gradient-to-br
          from-[#1f2d27]
          to-[#12201b]
          flex
          items-center
          justify-center
          shadow-lg
        "
      >
        <span className="text-5xl font-bold text-[#4adea8]">
          {`${perfil.nombre.charAt(0)}${perfil.apellido.charAt(0)}`}
        </span>
      </div>

      <h2 className="text-3xl font-bold mt-5">
        {perfil.nombre} {perfil.apellido}
      </h2>

      <p className="text-gray-400 mt-2">
        {perfil.email}
      </p>

      <span
        className="
          mt-4
          px-4
          py-2
          rounded-full
          bg-[#4adea8]/10
          text-[#4adea8]
          text-sm
          font-semibold
        "
      >
        Alumno
      </span>
    </div>
  );
}