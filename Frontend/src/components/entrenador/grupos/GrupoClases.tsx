import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { useNavigate } from "react-router-dom";

import type { ClaseGrupo } from "../../../types/grupoDetalle";

type Props = {
  clases: ClaseGrupo[];
};

export default function GrupoClases({ clases }: Props) {
  const navigate = useNavigate();

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Clases del grupo</h2>

        <span
          className="
            px-3
            py-1
            rounded-full
            bg-[#4adea8]
            text-[#12201b]
            font-bold
          "
        >
          {clases.length}
        </span>
      </div>

      <div className="grid gap-5">
        {clases.map((clase) => {
          const porcentaje = (clase.inscriptos * 100) / clase.cupoMaximo;

          return (
            <div
              key={clase.id}
              className="
                bg-[#1a2b24]
                border
                border-[#2d463b]
                rounded-3xl
                p-6
                hover:border-[#4adea8]
                transition-all
              "
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">{clase.diaSemana}</h3>

                  <span
                    className={`
                      inline-block
                      mt-2
                      px-3
                      py-1
                      rounded-full
                      text-sm
                      font-semibold

                      ${
                        clase.activa
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }
                    `}
                  >
                    {clase.activa ? "ACTIVA" : "INACTIVA"}
                  </span>
                </div>

                <CalendarMonthOutlinedIcon
                  sx={{
                    color: "#4adea8",
                    fontSize: 34,
                  }}
                />
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <AccessTimeOutlinedIcon sx={{ color: "#4adea8" }} />

                  <span>
                    {clase.horaInicio.substring(0, 5)}

                    {" - "}

                    {clase.horaFin.substring(0, 5)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <GroupsOutlinedIcon sx={{ color: "#4adea8" }} />

                  <span>
                    {clase.inscriptos}

                    {" / "}

                    {clase.cupoMaximo}

                    {" alumnos"}
                  </span>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-400">Ocupación</span>

                    <span className="text-sm font-semibold">
                      {Math.round(porcentaje)}%
                    </span>
                  </div>

                  <div
                    className="
                      h-3
                      rounded-full
                      bg-[#12201b]
                      overflow-hidden
                    "
                  >
                    <div
                      className="h-full bg-[#4adea8]"
                      style={{
                        width: `${porcentaje}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => navigate(`/entrenador/clases/${clase.id}`)}
                  className="
      w-full
      flex
      items-center
      justify-center
      gap-2
      rounded-xl
      bg-[#4adea8]
      py-3
      font-semibold
      text-[#12201b]
      hover:bg-[#6ef3bc]
      transition-all
      duration-300
    "
                >
                  Administrar clase
                  <ArrowForwardOutlinedIcon />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
