import type { ReactNode } from "react";

type Props = {
  titulo: string;
  valor: number | string;
  icono: ReactNode;
};

export default function DashboardStatCard({
  titulo,
  valor,
  icono,
}: Props) {
  return (
    <div
      className="
        bg-[#1a2b24]
        border
        border-[#2d463b]
        rounded-3xl
        p-6
        hover:border-[#4adea8]
        hover:-translate-y-1
        transition-all
      "
    >
      <div className="flex justify-between">

        <div>

          <p className="text-gray-400 text-sm">
            {titulo}
          </p>

          <h2 className="text-4xl font-bold mt-3">
            {valor}
          </h2>

        </div>

        <div className="text-[#4adea8]">
          {icono}
        </div>

      </div>
    </div>
  );
}