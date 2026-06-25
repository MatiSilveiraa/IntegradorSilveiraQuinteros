import LocalFireDepartmentOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";

import type { Perfil } from "../../types";

type Props = {
  perfil: Perfil;
};

export default function PerfilStats({ perfil }: Props) {
  const bloqueado =
    perfil.bloqueadoPorDeuda ||
    perfil.bloqueadoPorInasistencias;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">

      {/* Racha */}

      <div className="bg-[#1a211d] border border-[#2d463b] rounded-2xl p-5">
        <div className="w-12 h-12 rounded-xl bg-[#4adea8]/10 flex items-center justify-center mb-4">
          <LocalFireDepartmentOutlinedIcon
            sx={{
              color: "#4adea8",
              fontSize: 28,
            }}
          />
        </div>

        <p className="text-sm text-gray-400">
          Racha
        </p>

        <h2 className="text-3xl font-bold mt-2">
          {perfil.rachaAsistenciaMensual ?? 0}
        </h2>
      </div>

      {/* Estado */}

      <div className="bg-[#1a211d] border border-[#2d463b] rounded-2xl p-5">
        <div
          className={`
            w-12
            h-12
            rounded-xl
            flex
            items-center
            justify-center
            mb-4
            ${
              bloqueado
                ? "bg-red-500/10"
                : "bg-[#4adea8]/10"
            }
          `}
        >
          <ShieldOutlinedIcon
            sx={{
              color: bloqueado
                ? "#ef4444"
                : "#4adea8",
              fontSize: 28,
            }}
          />
        </div>

        <p className="text-sm text-gray-400">
          Estado
        </p>

        <h2
          className={`text-xl font-bold mt-2 ${
            bloqueado
              ? "text-red-400"
              : "text-[#4adea8]"
          }`}
        >
          {bloqueado ? "Bloqueado" : "Activo"}
        </h2>
      </div>

      {/* Seguridad */}

      <div className="bg-[#1a211d] border border-[#2d463b] rounded-2xl p-5">
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
          <SecurityOutlinedIcon
            sx={{
              color: "#4adea8",
              fontSize: 28,
            }}
          />
        </div>

        <p className="text-sm text-gray-400">
          Seguridad
        </p>

        <h2
          className={`text-xl font-bold mt-2 ${
            perfil.twoFactorEnabled
              ? "text-[#4adea8]"
              : "text-gray-400"
          }`}
        >
          {perfil.twoFactorEnabled
            ? "2FA Activo"
            : "Sin 2FA"}
        </h2>
      </div>

      {/* Email */}

      <div className="bg-[#1a211d] border border-[#2d463b] rounded-2xl p-5">
        <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4">
          <MailOutlineOutlinedIcon
            sx={{
              color: "#4adea8",
              fontSize: 28,
            }}
          />
        </div>

        <p className="text-sm text-gray-400">
          Email
        </p>

        <h2 className="text-sm font-semibold mt-2 truncate">
          {perfil.email}
        </h2>
      </div>

    </div>
  );
}