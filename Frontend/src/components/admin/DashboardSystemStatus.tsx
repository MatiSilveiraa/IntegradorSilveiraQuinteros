import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";

import { useNavigate } from "react-router-dom";

type Props = {
  dashboard: any;
  twoFactorEnabled: boolean;
};

export default function DashboardSystemStatus({
  dashboard,
  twoFactorEnabled,
}: Props) {
  const navigate = useNavigate();

  const cuotasVencidas =
    dashboard.cuotasVencidas ?? 0;

  const beneficiosPendientes =
    dashboard.beneficiosPendientes ?? 0;

  const premiosFisicosPendientes =
    dashboard.premiosFisicosPendientes ?? 0;

  const reactivacionesPendientes =
    dashboard.reactivacionesPendientes ?? 0;

  /*
   * Tareas que requieren intervención
   */

  const seguridadPendiente =
    !twoFactorEnabled ? 1 : 0;

  const totalPendientesManuales =
    cuotasVencidas +
    premiosFisicosPendientes +
    reactivacionesPendientes +
    seguridadPendiente;

  const sistemaOk =
    totalPendientesManuales === 0;

  return (
    <div
      className="
        rounded-3xl
        border
        border-[#2d463b]
        bg-[#1a211d]
        p-4
        sm:p-7
        h-full
      "
    >
      {/* CABECERA */}

      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-start
          sm:justify-between
          gap-4
          mb-6
        "
      >
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">
            Detalle de alertas
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            Situaciones que pueden requerir tu atención.
          </p>
        </div>

        <span
          className={`
            self-start
            px-3
            py-1
            rounded-full
            border
            text-xs
            font-bold
            whitespace-nowrap

            ${
              sistemaOk
                ? `
                  bg-[#4adea8]/10
                  text-[#4adea8]
                  border-[#4adea8]/30
                `
                : `
                  bg-amber-500/10
                  text-amber-300
                  border-amber-500/30
                `
            }
          `}
        >
          {sistemaOk
            ? "Todo al día"
            : `${totalPendientesManuales} ${
                totalPendientesManuales === 1
                  ? "tarea pendiente"
                  : "tareas pendientes"
              }`}
        </span>
      </div>

      <div className="space-y-3">

        {/* ================================================== */}
        {/* SEGURIDAD / 2FA */}
        {/* ================================================== */}

        {!twoFactorEnabled && (
          <StatusCard
            icon={<SecurityOutlinedIcon />}
            color="bg-amber-500/10 text-amber-400"
            titulo="Seguridad recomendada"
            valor="2FA"
            descripcion="Activá la autenticación en dos pasos para proteger tu cuenta."
            alerta
            accionTexto="Activar 2FA"
            onClick={() =>
              navigate("/admin/seguridad")
            }
          />
        )}

        {/* ================================================== */}
        {/* CUOTAS VENCIDAS */}
        {/* ================================================== */}

        <StatusCard
          icon={<CalendarMonthOutlinedIcon />}
          color="bg-red-500/10 text-red-400"
          titulo="Cuotas vencidas"
          valor={cuotasVencidas}
          descripcion={
            cuotasVencidas > 0
              ? cuotasVencidas === 1
                ? "Hay una cuota vencida que requiere revisión."
                : `Hay ${cuotasVencidas} cuotas vencidas que requieren revisión.`
              : "No hay cuotas vencidas registradas."
          }
          alerta={cuotasVencidas > 0}
          accionTexto="Revisar cuotas"
          onClick={() =>
            navigate("/admin/cuotas")
          }
        />

        {/* ================================================== */}
        {/* REACTIVACIONES */}
        {/* ================================================== */}

        <StatusCard
          icon={<AutorenewOutlinedIcon />}
          color="bg-orange-500/10 text-orange-300"
          titulo="Solicitudes de reactivación"
          valor={reactivacionesPendientes}
          descripcion={
            reactivacionesPendientes > 0
              ? reactivacionesPendientes === 1
                ? "Hay una solicitud esperando revisión."
                : `Hay ${reactivacionesPendientes} solicitudes esperando revisión.`
              : "No hay solicitudes de reactivación pendientes."
          }
          alerta={
            reactivacionesPendientes > 0
          }
          accionTexto="Revisar solicitudes"
          onClick={() =>
            navigate("/admin/reactivaciones")
          }
        />

        {/* ================================================== */}
        {/* PREMIOS */}
        {/* ================================================== */}

        <StatusCard
          icon={<EmojiEventsOutlinedIcon />}
          color="bg-yellow-500/10 text-yellow-300"
          titulo="Premios físicos"
          valor={premiosFisicosPendientes}
          descripcion={
            premiosFisicosPendientes > 0
              ? premiosFisicosPendientes === 1
                ? "Hay un premio pendiente de entrega."
                : `Hay ${premiosFisicosPendientes} premios pendientes de entrega.`
              : "No hay premios físicos pendientes."
          }
          alerta={
            premiosFisicosPendientes > 0
          }
          accionTexto="Ver premios"
          onClick={() =>
            navigate("/admin/premios")
          }
        />

        {/* ================================================== */}
        {/* BENEFICIOS */}
        {/* ================================================== */}

        <StatusCard
          icon={<CardGiftcardOutlinedIcon />}
          color="bg-sky-500/10 text-sky-400"
          titulo="Beneficios económicos"
          valor={beneficiosPendientes}
          descripcion={
            beneficiosPendientes > 0
              ? "Se aplicarán automáticamente en las próximas cuotas."
              : "No hay beneficios económicos pendientes."
          }
          alerta={false}
          accionTexto="Ver beneficios"
          onClick={() =>
            navigate(
              "/admin/beneficios-pendientes",
            )
          }
        />

      </div>
    </div>
  );
}

/*
 * CARD DE ESTADO
 */

type CardProps = {
  titulo: string;
  valor: string | number;
  color: string;
  icon: React.ReactNode;
  descripcion: string;
  alerta?: boolean;
  accionTexto?: string;
  onClick?: () => void;
};

function StatusCard({
  titulo,
  valor,
  color,
  icon,
  descripcion,
  alerta = false,
  accionTexto,
  onClick,
}: CardProps) {
  return (
    <div
      className={`
        rounded-2xl
        border
        p-4
        sm:p-5
        transition-all

        ${
          alerta
            ? `
              border-amber-500/30
              bg-amber-500/5
            `
            : `
              border-[#2d463b]
              bg-transparent
            `
        }
      `}
    >
      <div
        className="
          flex
          items-start
          gap-4
        "
      >
        {/* ICONO */}

        <div
          className={`
            w-11
            h-11
            sm:w-14
            sm:h-14
            rounded-xl
            flex
            items-center
            justify-center
            shrink-0
            ${color}
          `}
        >
          {icon}
        </div>

        {/* INFORMACIÓN */}

        <div className="flex-1 min-w-0">

          <div
            className="
              flex
              items-start
              justify-between
              gap-3
            "
          >

            <div className="min-w-0">

              <p className="text-sm text-gray-400">
                {titulo}
              </p>

              <h3 className="text-xl sm:text-2xl font-bold mt-1">
                {valor}
              </h3>

            </div>

            {alerta && (
              <span
                className="
                  shrink-0
                  text-amber-400
                  text-lg
                "
              >
                ⚠
              </span>
            )}

          </div>

          <p className="text-xs text-gray-500 mt-2">
            {descripcion}
          </p>

        </div>
      </div>

      {/* ACCIÓN */}

      {onClick && accionTexto && (
        <button
          type="button"
          onClick={onClick}
          className={`
            mt-4
            w-full
            flex
            items-center
            justify-center
            gap-2
            px-4
            py-2.5
            rounded-xl
            border
            text-sm
            font-bold
            transition-all

            ${
              alerta
                ? `
                  bg-[#4adea8]
                  text-[#12201b]
                  border-[#4adea8]
                  hover:brightness-110
                `
                : `
                  bg-[#12201b]
                  text-[#4adea8]
                  border-[#2d463b]
                  hover:border-[#4adea8]
                `
            }
          `}
        >
          {accionTexto}

          <ArrowForwardOutlinedIcon
            sx={{
              fontSize: 18,
            }}
          />
        </button>
      )}

    </div>
  );
}