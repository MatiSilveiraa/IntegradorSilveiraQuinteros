import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useNavigate } from "react-router-dom";

type Props = {
  nombre?: string;
};

export default function GruposHeader({
  nombre,
}: Props) {

  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between mb-6">

      <button
        onClick={() => navigate(-1)}
        className="
          w-10
          h-10
          rounded-full
          bg-[#1a2b24]
          border
          border-[#2d463b]
          flex
          items-center
          justify-center
          text-white
        "
      >
        <ArrowBackOutlinedIcon />
      </button>

      <h1 className="text-2xl font-bold text-white">
        Grupos
      </h1>

      <div
        className="
          w-10
          h-10
          rounded-full
          border-2
          border-[#4adea8]/30
          flex
          items-center
          justify-center
          bg-[#1a2b24]
        "
      >
        <span className="text-[#4adea8] font-semibold">
          {nombre?.charAt(0).toUpperCase() || "A"}
        </span>
      </div>

    </header>
  );
}