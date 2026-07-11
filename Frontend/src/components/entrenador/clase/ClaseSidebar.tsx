import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";

import { useNavigate } from "react-router-dom";

type Props = {
  claseId: number;
  latitud: number;
  longitud: number;
  inscriptos: number;
  cupoMaximo: number;
};

export default function ClaseSidebar({
  claseId,
  latitud,
  longitud,
  inscriptos,
  cupoMaximo,
}: Props) {
  const navigate = useNavigate();

  return (
    <aside
      className="
        bg-[#1a2b24]
        border
        border-[#2d463b]
        rounded-3xl
        p-6
        sticky
        top-24
      "
    >
      {/* RESUMEN */}

      <h2 className="text-2xl font-bold mb-6">
        Resumen
      </h2>

      <div
        className="
          flex
          items-center
          gap-4
          mb-8
        "
      >
        <div
          className="
            w-14
            h-14
            rounded-2xl
            bg-[#22372f]
            flex
            items-center
            justify-center
          "
        >
          <GroupsOutlinedIcon
            sx={{
              color: "#4adea8",
              fontSize: 30,
            }}
          />
        </div>

        <div>
          <p className="text-gray-400 text-sm">
            Alumnos inscriptos
          </p>

          <p className="text-3xl font-bold">
            {inscriptos} / {cupoMaximo}
          </p>
        </div>
      </div>

      <hr className="border-[#2d463b] mb-6" />

      {/* ACCIONES */}

      <h3 className="text-lg font-semibold mb-4">
        Acciones rápidas
      </h3>

      <div className="space-y-3">

        {/* Asistencia */}

        <button
          type="button"
          onClick={() =>
            navigate(`/entrenador/clases/${claseId}/asistencia`)
          }
          className="
            w-full
            flex
            justify-between
            items-center
            rounded-xl
            bg-[#4adea8]
            text-[#12201b]
            px-4
            py-3
            font-semibold
            hover:bg-[#6ef3bc]
            transition
          "
        >
          <div className="flex items-center gap-3">
            <AssignmentTurnedInOutlinedIcon />

            <span>Tomar asistencia</span>
          </div>

          <ArrowForwardIosOutlinedIcon fontSize="small" />
        </button>

        {/* Ubicación */}

        <button
          type="button"
          onClick={() =>
            window.open(
              `https://www.openstreetmap.org/?mlat=${latitud}&mlon=${longitud}&zoom=17`,
              "_blank"
            )
          }
          className="
            w-full
            flex
            justify-between
            items-center
            rounded-xl
            bg-[#22372f]
            px-4
            py-3
            hover:bg-[#294238]
            transition
          "
        >
          <div className="flex items-center gap-3">
            <LocationOnOutlinedIcon />

            <span>Ver ubicación</span>
          </div>

          <ArrowForwardIosOutlinedIcon fontSize="small" />
        </button>

        {/* Materiales */}

        <button
          type="button"
          onClick={() =>
            navigate(`/entrenador/clases/${claseId}/materiales`)
          }
          className="
            w-full
            flex
            justify-between
            items-center
            rounded-xl
            bg-[#22372f]
            px-4
            py-3
            hover:bg-[#294238]
            transition
          "
        >
          <div className="flex items-center gap-3">
            <MenuBookOutlinedIcon />

            <span>Materiales</span>
          </div>

          <ArrowForwardIosOutlinedIcon fontSize="small" />
        </button>

      </div>
    </aside>
  );
}