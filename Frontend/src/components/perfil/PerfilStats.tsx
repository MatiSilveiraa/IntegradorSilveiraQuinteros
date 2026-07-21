import LocalFireDepartmentOutlinedIcon from "@mui/icons-material/LocalFireDepartmentOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";

import type { Perfil } from "../../types";

type Props = {
  perfil: Perfil;
};

export default function PerfilStats({ perfil }: Props) {
  const bloqueado =
    perfil.bloqueadoPorDeuda ||
    perfil.bloqueadoPorInasistencias;

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-2xl font-bold">
          Resumen de tu cuenta
        </h2>

        <p className="mt-1 text-sm text-gray-400">
          Tu actividad, estado y configuración de seguridad.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-[#2d463b] bg-[#1a211d] p-5">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#4adea8]/10">
            <LocalFireDepartmentOutlinedIcon
              sx={{
                color: "#4adea8",
                fontSize: 28,
              }}
            />
          </div>

          <p className="text-sm text-gray-400">
            Racha mensual
          </p>

          <div className="mt-2 flex items-end gap-2">
            <h3 className="text-3xl font-bold">
              {perfil.rachaAsistenciaMensual ?? 0}
            </h3>

            <span className="pb-1 text-sm text-gray-500">
              asistencias
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-[#2d463b] bg-[#1a211d] p-5">
          <div
            className={`
              mb-4
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-xl
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
            Estado de la cuenta
          </p>

          <h3
            className={`
              mt-2
              text-xl
              font-bold
              ${
                bloqueado
                  ? "text-red-400"
                  : "text-[#4adea8]"
              }
            `}
          >
            {bloqueado ? "Bloqueada" : "Activa"}
          </h3>
        </div>

        <div className="rounded-2xl border border-[#2d463b] bg-[#1a211d] p-5">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
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

          <h3
            className={`
              mt-2
              text-xl
              font-bold
              ${
                perfil.twoFactorEnabled
                  ? "text-[#4adea8]"
                  : "text-gray-400"
              }
            `}
          >
            {perfil.twoFactorEnabled
              ? "2FA activado"
              : "2FA desactivado"}
          </h3>
        </div>
      </div>
    </section>
  );
}