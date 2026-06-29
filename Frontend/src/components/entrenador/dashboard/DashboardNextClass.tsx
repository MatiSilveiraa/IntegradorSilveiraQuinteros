import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import { useNavigate } from "react-router-dom";

type Props = {
  clase?: {
    claseId: number;
    grupo: string;
    horaInicio: string;
    horaFin: string;
  } | null;
};

export default function DashboardNextClass({ clase }: Props) {
  const navigate = useNavigate();

  return (
    <div
      className="
        bg-[#1a2b24]
        border
        border-[#2d463b]
        rounded-3xl
        p-8
      "
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Próxima clase
        </h2>

        <EventAvailableOutlinedIcon
          className="text-[#4adea8]"
          fontSize="large"
        />
      </div>

      {!clase ? (
        <p className="text-gray-400">
          No tienes clases programadas.
        </p>
      ) : (
        <>
          <h3 className="text-3xl font-bold">
            {clase.grupo}
          </h3>

          <div className="mt-6 space-y-3">

            <div className="flex items-center gap-3">
              <AccessTimeOutlinedIcon
                className="text-[#4adea8]"
              />

              <span>
                {clase.horaInicio} - {clase.horaFin}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <GroupsOutlinedIcon
                className="text-[#4adea8]"
              />

              <span>
                Gestiona la asistencia de esta clase.
              </span>
            </div>

          </div>

          <div className="flex gap-4 mt-8">

            <button
              onClick={() =>
                navigate(`/entrenador/asistencia/${clase.claseId}`)
              }
              className="
                flex-1
                h-12
                rounded-xl
                bg-[#4adea8]
                text-[#12201b]
                font-bold
              "
            >
              Tomar asistencia
            </button>

          </div>
        </>
      )}
    </div>
  );
}