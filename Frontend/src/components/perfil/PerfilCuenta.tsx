import { useNavigate } from "react-router-dom";
import type { Perfil } from "../../types";
import LocalFireDepartmentOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

type Props = {
  perfil: Perfil;
};

export default function PerfilCuenta({
  perfil,
}: Props) {
  const navigate = useNavigate();

  const bloqueado =
    perfil.bloqueadoPorDeuda ||
    perfil.bloqueadoPorInasistencias;

  return (
    <div
      className="
        bg-[#1a211d]
        border
        border-[#2d463b]
        rounded-2xl
        p-6
        mb-8
      "
    >
      <div className="flex items-center gap-3 mb-6">
  <div className="w-11 h-11 rounded-xl bg-[#4adea8]/10 flex items-center justify-center">
    <ShieldOutlinedIcon
      sx={{
        color: "#4adea8",
        fontSize: 26,
      }}
    />
  </div>

  <h2 className="text-2xl font-bold">
    Estado de la Cuenta
  </h2>
</div>

      <div className="grid md:grid-cols-2 gap-4">

        <div
  className="
    rounded-2xl
    bg-[#12201b]
    border
    border-[#2d463b]
    p-6
  "
>
  <div className="w-14 h-14 rounded-full bg-[#4adea8]/10 flex items-center justify-center mb-5">
    <LocalFireDepartmentOutlinedIcon
      sx={{
        color: "#4adea8",
        fontSize: 30,
      }}
    />
  </div>

  <p className="text-gray-400">
    Racha actual
  </p>

  <h2 className="text-5xl font-bold mt-2 text-[#4adea8]">
    {perfil.rachaAsistenciaMensual ?? 0}
  </h2>
</div>
        <div
  className="
    rounded-2xl
    bg-[#12201b]
    border
    border-[#2d463b]
    p-6
  "
>
  <div
    className={`
      w-14
      h-14
      rounded-full
      flex
      items-center
      justify-center
      mb-5
      ${
        bloqueado
          ? "bg-red-500/10"
          : "bg-[#4adea8]/10"
      }
    `}
  >
    {bloqueado ? (
      <ReportProblemOutlinedIcon
        sx={{
          color: "#ef4444",
          fontSize: 30,
        }}
      />
    ) : (
      <CheckCircleOutlineOutlinedIcon
        sx={{
          color: "#4adea8",
          fontSize: 30,
        }}
      />
    )}
  </div>

  <p className="text-gray-400">
    Estado
  </p>

  <span
    className={`
      inline-flex
      items-center
      gap-2
      mt-4
      px-4
      py-2
      rounded-full
      font-semibold
      ${
        bloqueado
          ? "bg-red-500/10 text-red-400"
          : "bg-[#4adea8]/10 text-[#4adea8]"
      }
    `}
  >
    {bloqueado ? "Bloqueado" : "Activo"}
  </span>
</div>
        </div>  


      {bloqueado && (
  <div
    className="
      mt-8
      rounded-2xl
      border
      border-amber-500/20
      bg-amber-500/5
      p-6
    "
  >
    <div className="flex gap-5 items-start">
      <ReportProblemOutlinedIcon
        sx={{
          color: "#fbbf24",
          fontSize: 42,
        }}
      />

      <div className="flex-1">
        <h3 className="text-xl font-bold">
          Tu cuenta está bloqueada
        </h3>

        <p className="text-gray-400 mt-2">
          Tenés una deuda pendiente o acumulaste
          inasistencias. Podés solicitar una
          reactivación para volver a entrenar.
        </p>

        <button
          onClick={() =>
            navigate("/alumno/reactivacion")
          }
          className="
            mt-6
            w-full
            flex
            justify-center
            items-center
            gap-3
            py-4
            rounded-xl
            bg-amber-500
            text-black
            font-bold
            hover:opacity-90
            transition-all
          "
        >
          Solicitar Reactivación

          <ArrowForwardRoundedIcon />
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}