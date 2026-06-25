import type { ReactNode } from "react";

type Props = {
  titulo: string;
  valor: string | number;
  icono: ReactNode;
  descripcion?: string;
};

export default function DashboardStatCard({
  titulo,
  valor,
 icono,
  descripcion,
}: Props) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-[#2d463b]
        bg-[#1a211d]
        p-7
        hover:border-[#4adea8]
        hover:-translate-y-1
        transition-all
        duration-300
      "
    >
      <div
        className="
          w-16
          h-16
          rounded-2xl
          bg-[#4adea8]/10
          flex
          items-center
          justify-center
          mb-8
        "
      >
        {icono}
      </div>

      <p className="text-gray-400">
        {titulo}
      </p>

      <h2 className="text-5xl font-black mt-3">
        {valor}
      </h2>

      {descripcion && (
        <p className="text-gray-500 mt-5 text-sm">
          {descripcion}
        </p>
      )}
    </div>
  );
}