import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useNavigate } from "react-router-dom";

type Props = {
  nombre?: string;
};

export default function PagoHeader({
  nombre,
}: Props) {

  const navigate = useNavigate();

  return (
    <header className="flex items-center p-4 pt-6 gap-4">

      <button
        onClick={() => navigate("/alumno")}
        className="
          flex
          items-center
          justify-center
          size-10
          rounded-full
          bg-[#4adea8]/10
          text-[#4adea8]
        "
      >
        <ArrowBackOutlinedIcon />
      </button>

      <h1 className="text-xl font-bold tracking-tight text-white">
        Pagos
      </h1>

      <div className="ml-auto">

        <div
          className="
            size-10
            rounded-full
            border-2
            border-[#4adea8]/20
            bg-[#1a211d]
            flex
            items-center
            justify-center
          "
        >
          <span className="text-[#4adea8] font-semibold">
            {nombre?.charAt(0).toUpperCase() || "A"}
          </span>
        </div>

      </div>

    </header>
  );
}