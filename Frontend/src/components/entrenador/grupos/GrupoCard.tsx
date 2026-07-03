import { Link } from "react-router-dom";

import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";

import type { GrupoEntrenador } from "../../../types/grupoEntrenador";

type Props = {
  grupo: GrupoEntrenador;
};

export default function GrupoCard({ grupo }: Props) {
  return (
    <div
      className="
        h-full
        flex
        flex-col
        rounded-3xl
        bg-[#1a2b24]
        border
        border-[#2d463b]
        p-5
        sm:p-6
        transition-all
        duration-300
        hover:border-[#4adea8]
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      {/* Header */}

      <div className="flex items-start justify-between gap-3 mb-6">
        <div className="flex items-center gap-4 min-w-0">
          <div
            className="
              w-14
              h-14
              rounded-2xl
              bg-[#22372f]
              flex
              items-center
              justify-center
              shrink-0
            "
          >
            <FitnessCenterOutlinedIcon
              sx={{
                fontSize: 30,
                color: "#4adea8",
              }}
            />
          </div>

          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl font-bold truncate">
              {grupo.nombre}
            </h3>

            <p className="text-sm text-gray-400">{grupo.nivel}</p>
          </div>
        </div>

        <span
          className="
            shrink-0
            rounded-full
            bg-green-500/20
            px-3
            py-1
            text-xs
            font-semibold
            text-green-400
          "
        >
          {grupo.estado}
        </span>
      </div>

      {/* Información */}

      {/* Información */}

      <div className="space-y-4 mt-6">
        <div className="flex items-center gap-3">
          <GroupsOutlinedIcon
            sx={{
              color: "#4adea8",
              fontSize: 22,
            }}
          />

          <span>{grupo.cantidadAlumnos} alumnos</span>
        </div>

        <div className="flex items-center gap-3">
          <CalendarMonthOutlinedIcon
            sx={{
              color: "#4adea8",
              fontSize: 22,
            }}
          />

          <span>{grupo.cantidadClases} clases semanales</span>
        </div>
      </div>

      {/* Botón */}

      <Link
        to={`/entrenador/grupos/${grupo.id}`}
        className="
          mt-auto
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-[#4adea8]
          px-4
          py-3
          font-semibold
          text-[#12201b]
          transition-all
          duration-300
          hover:bg-[#6ef3bc]
        "
      >
        Ver grupo
        <ArrowForwardOutlinedIcon fontSize="small" />
      </Link>
    </div>
  );
}
