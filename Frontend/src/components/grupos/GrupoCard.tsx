import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { useNavigate } from "react-router-dom";

type Props = {
  id: number;
  nombre: string;
  horario: string;
  nivel: string;
  cantidadClases?: number;
};
export default function GrupoCard({
  id,
  nombre,
  horario,
  nivel,
  cantidadClases,
}: Props)  {
  const navigate = useNavigate();

  return (
    <div
      className="
      bg-[#1a2b24]
      border
      border-[#2d463b]
      rounded-3xl
      p-6
      hover:border-[#4adea8]/40
      hover:-translate-y-1
      transition-all
      flex
      flex-col
      h-full
    "
    >
      <div className="flex items-center justify-between">
        <h3 className="text-3xl font-bold text-white">{nombre}</h3>

        <span
          className="
          px-3
          py-1
          rounded-full
          text-xs
          font-bold
          bg-[#4adea8]/10
          text-[#4adea8]
        "
        >
          {nivel}
        </span>
      </div>

      <p className="text-gray-400 mt-2 text-sm">
        Grupo de entrenamiento {nivel?.toLowerCase()}
      </p>

      <div className="mt-6 space-y-3">
        <div
          className="
          flex
          items-center
          gap-3
          bg-[#12201b]
          rounded-xl
          px-4
          py-3
        "
        >
          <CalendarTodayOutlinedIcon sx={{ fontSize: 18 }} />

          <span className="text-sm text-gray-300">{horario}</span>
        </div>
      </div>

      {cantidadClases !== undefined && (
        <div
          className="
          mt-5
          flex
          items-center
          justify-between
          bg-[#12201b]
          rounded-xl
          px-4
          py-3
        "
        >
          <span className="text-gray-400 text-sm">Clases semanales</span>

          <span className="font-bold text-[#4adea8]">{cantidadClases}</span>
        </div>
      )}

      <div className="flex-1" />

      <button
        onClick={() => navigate(`/alumno/grupos/${id}`)}
        className="
        w-full
        h-14
        mt-6
        rounded-2xl
        bg-[#4adea8]
        text-[#12201b]
        font-bold
        text-lg
        hover:opacity-90
        transition-all
      "
      >
        Ver clases
      </button>
    </div>
  );
}
