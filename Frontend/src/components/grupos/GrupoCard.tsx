import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { useNavigate } from "react-router-dom";

type Props = {
  id: number;
  nombre: string;
  horario: string;
  ubicacion: string;
  nivel: string;
  cuposOcupados: number;
  cuposTotales: number;
  completo?: boolean;
};
export default function GrupoCard({
  id,
  nombre,
  horario,
  ubicacion,
  nivel,
  cuposOcupados,
  cuposTotales,
  completo = false,
}: Props) {
  const navigate = useNavigate();

  const disponibles = cuposTotales - cuposOcupados;

  const porcentaje = (cuposOcupados * 100) / cuposTotales;

  return (
    <div
      className="
        bg-[#1a2b24]
        border
        border-[#2d463b]
        rounded-2xl
        p-5
      "
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold text-white">{nombre}</h3>

          <div className="flex items-center gap-2 mt-3 text-gray-400">
            <CalendarTodayOutlinedIcon sx={{ fontSize: 18 }} />

            <span className="text-sm">{horario}</span>
          </div>

          <div className="flex items-center gap-2 mt-2 text-gray-400">
            <LocationOnOutlinedIcon sx={{ fontSize: 18 }} />

            <span className="text-sm">{ubicacion}</span>
          </div>
        </div>

        <div className="text-right">
          <span
            className={`
              px-3
              py-1
              rounded-lg
              text-xs
              font-bold
              uppercase
              ${
                completo
                  ? "bg-red-500/10 text-red-400"
                  : "bg-[#4adea8]/10 text-[#4adea8]"
              }
            `}
          >
            {nivel}
          </span>

          {completo && (
            <p className="text-red-400 text-xs mt-2 italic font-semibold">
              Grupo Completo
            </p>
          )}
        </div>
      </div>

      <div className="mt-5">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">
            Cupos: {cuposOcupados}/{cuposTotales}
          </span>

          <span className={completo ? "text-gray-400" : "text-[#4adea8]"}>
            {disponibles} disponibles
          </span>
        </div>

        <div className="h-2 rounded-full bg-[#2d463b] overflow-hidden">
          <div
            className={`
              h-full
              rounded-full
              ${completo ? "bg-gray-500" : "bg-[#4adea8]"}
            `}
            style={{
              width: `${porcentaje}%`,
            }}
          />
        </div>
      </div>

      <button
        onClick={() => navigate(`/alumno/grupos/${id}`)}
        className="
    w-full
    h-14
    mt-6
    bg-[#4adea8]
    text-[#12201b]
    rounded-xl
    font-bold
  "
      >
        Ver clases
      </button>
    </div>
  );
}
