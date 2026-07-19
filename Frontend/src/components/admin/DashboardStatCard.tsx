import type { ReactNode } from "react";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";

type Props = {
  titulo: string;
  valor: string | number;
  icono: ReactNode;
  descripcion?: string;
  textoAccion?: string;
  onClick?: () => void;
};

export default function DashboardStatCard({
  titulo,
  valor,
  icono,
  descripcion,
  textoAccion,
  onClick,
}: Props) {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`
        group
        rounded-3xl
        border
        border-[#2d463b]
        bg-[#1a211d]
        p-7
        transition-all
        duration-300
        ${
          onClick
            ? "cursor-pointer hover:border-[#4adea8] hover:-translate-y-1"
            : ""
        }
      `}
    >
      <div className="w-16 h-16 rounded-2xl bg-[#4adea8]/10 flex items-center justify-center mb-8">
        {icono}
      </div>

      <p className="text-gray-400">{titulo}</p>

      <h2 className="text-5xl font-black mt-3">{valor}</h2>

      {descripcion && (
        <p className="text-gray-500 mt-5 text-sm">{descripcion}</p>
      )}

      {textoAccion && onClick && (
        <div className="mt-6 pt-5 border-t border-[#2d463b] flex items-center justify-between text-[#4adea8] text-sm font-bold">
          <span>{textoAccion}</span>
          <ArrowForwardOutlinedIcon
            fontSize="small"
            className="transition-transform group-hover:translate-x-1"
          />
        </div>
      )}
    </div>
  );
}