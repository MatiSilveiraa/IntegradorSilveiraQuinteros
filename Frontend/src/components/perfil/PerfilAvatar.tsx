import type { Perfil } from "../../types";

type Props = {
  perfil: Perfil;
  editando?: boolean;
};

export default function PerfilAvatar({
  perfil,
  editando = false,
}: Props) {
  const iniciales = `${perfil.nombre?.charAt(0) ?? ""}${
    perfil.apellido?.charAt(0) ?? ""
  }`.toUpperCase();

  return (
    <section
      className={`
        border
        rounded-3xl
        p-8
        mb-8
        flex
        flex-col
        items-center
        transition-all
        ${
          editando
            ? "bg-[#1a2b24] border-[#4adea8]/40"
            : "bg-[#1a211d] border-[#2d463b]"
        }
      `}
    >
      <div className="relative">
        <div className="w-32 h-32 rounded-full border-4 border-[#4adea8] bg-gradient-to-br from-[#1f2d27] to-[#12201b] flex items-center justify-center shadow-lg shadow-[#4adea8]/10">
          <span className="text-5xl font-bold text-[#4adea8]">
            {iniciales}
          </span>
        </div>

        {editando && (
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full bg-[#4adea8] text-[#12201b] text-xs font-bold">
            Editando
          </span>
        )}
      </div>

      <h2 className="text-3xl font-bold mt-7 text-center">
        {perfil.nombre} {perfil.apellido}
      </h2>

      <p className="text-gray-400 mt-2 text-center break-all">
        {perfil.email}
      </p>

      <span className="mt-4 px-4 py-2 rounded-full bg-[#4adea8]/10 border border-[#4adea8]/20 text-[#4adea8] text-sm font-semibold">
        Alumno
      </span>
    </section>
  );
}