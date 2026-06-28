import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import type { ReactNode } from "react";

type Props = {
  titulo: string;
  descripcion: string;
  icono: ReactNode;
  onClick: () => void;
  badge?: number;
};

export default function DashboardQuickAction({
  titulo,
  descripcion,
  icono,
  onClick,
  badge,
}: Props) {
  return (
    <button
      onClick={onClick}
      className="
        group
        w-full
        rounded-3xl
        border
        border-[#2d463b]
        bg-[#1a211d]
        p-6
        text-left
        transition-all
        duration-300
        hover:border-[#4adea8]
        hover:-translate-y-1
      "
    >
      <div className="flex justify-between items-start gap-4">
        <div>
          <div
            className="
              w-14
              h-14
              rounded-2xl
              bg-[#4adea8]/10
              text-[#4adea8]
              flex
              items-center
              justify-center
              mb-6
              transition-all
              duration-300
              group-hover:scale-110
            "
          >
            {icono}
          </div>

          <h3 className="text-xl font-bold">{titulo}</h3>

          <p className="text-gray-400 mt-2">{descripcion}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          {badge !== undefined && (
            <span
              className={`
                min-w-[36px]
                h-9
                px-3
                rounded-full
                flex
                items-center
                justify-center
                text-sm
                font-bold
                ${
                  badge > 0
                    ? "bg-yellow-500/20 text-yellow-300"
                    : "bg-[#4adea8]/10 text-[#4adea8]"
                }
              `}
            >
              {badge}
            </span>
          )}

          <ArrowForwardRoundedIcon
            className="
              text-[#4adea8]
              opacity-0
              translate-x-2
              transition-all
              duration-300
              group-hover:opacity-100
              group-hover:translate-x-0
            "
          />
        </div>
      </div>
    </button>
  );
}