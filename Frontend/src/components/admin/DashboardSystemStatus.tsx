import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { useNavigate } from "react-router-dom";

 type Props = {
  dashboard: any;
};

export default function DashboardSystemStatus({ dashboard }: Props) {
  const navigate = useNavigate();

  const cuotasVencidas = dashboard.cuotasVencidas ?? 0;
  const beneficiosPendientes = dashboard.beneficiosPendientes ?? 0;
  const premiosFisicosPendientes = dashboard.premiosFisicosPendientes ?? 0;

  const totalPendientesManuales =
  cuotasVencidas + premiosFisicosPendientes;

  const sistemaOk = totalPendientesManuales === 0;

  return (
    <div className="rounded-3xl border border-[#2d463b] bg-[#1a211d] p-7 h-full">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold">Estado del sistema</h2>

          <p className="text-gray-400 mt-1">
            Resumen de alertas y tareas pendientes.
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full border text-xs font-bold whitespace-nowrap ${
            sistemaOk
              ? "bg-[#4adea8]/10 text-[#4adea8] border-[#4adea8]/30"
              : "bg-yellow-500/10 text-yellow-300 border-yellow-500/30"
          }`}
        >
          {sistemaOk ? "Todo al día" : `${totalPendientesManuales} acciones pendientes`}
        </span>
      </div>

      <div className="space-y-4">
        <StatusCard
          icon={<CalendarMonthOutlinedIcon />}
          color="bg-red-500/10 text-red-400"
          titulo="Cuotas vencidas"
          valor={cuotasVencidas}
          descripcion={
            cuotasVencidas > 0
              ? "Hay pagos atrasados que requieren revisión."
              : "No hay cuotas vencidas registradas."
          }
          alerta={cuotasVencidas > 0}
          accionTexto="Ver alumnos"
          onClick={() => navigate("/admin/alumnos?filtro=cuotas-pendientes")}
        />

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
  onClick={() => navigate("/admin/beneficios-pendientes")}
/>

        <StatusCard
          icon={<EmojiEventsOutlinedIcon />}
          color="bg-yellow-500/10 text-yellow-300"
          titulo="Premios físicos"
          valor={premiosFisicosPendientes}
          descripcion={
            premiosFisicosPendientes > 0
              ? "Hay premios pendientes de entrega."
              : "No hay premios físicos pendientes."
          }
          alerta={premiosFisicosPendientes > 0}
          accionTexto="Ver premios"
          onClick={() => navigate("/admin/premios")}
        />

        <StatusCard
          icon={
            sistemaOk ? (
              <CheckCircleOutlineOutlinedIcon />
            ) : (
              <WarningAmberOutlinedIcon />
            )
          }
          color={
            sistemaOk
              ? "bg-[#4adea8]/10 text-[#4adea8]"
              : "bg-yellow-500/10 text-yellow-300"
          }
          titulo="Sistema"
          valor={sistemaOk ? "Todo funcionando" : "Requiere atención"}
          descripcion={
            sistemaOk
              ? "No hay tareas críticas pendientes."
              : "Hay alertas administrativas por revisar."
          }
          alerta={!sistemaOk}
          accionTexto="Revisar alumnos"
          onClick={() => navigate("/admin/alumnos")}
        />
      </div>
    </div>
  );
}

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
      className={`rounded-2xl border p-5 transition-all ${
        alerta
          ? "border-yellow-500/30 bg-yellow-500/5"
          : "border-[#2d463b] bg-transparent"
      }`}
    >
      <div className="flex items-start gap-5">
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${color}`}
        >
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-gray-400">{titulo}</p>

              <h3 className="text-2xl font-bold mt-1">{valor}</h3>
            </div>

            {alerta && <span className="text-yellow-300 text-xl">⚠</span>}
          </div>

          <p className="text-xs text-gray-500 mt-2">{descripcion}</p>
        </div>
      </div>

      {onClick && accionTexto && (
        <button
          type="button"
          onClick={onClick}
          className={`mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
            alerta
              ? "bg-[#4adea8] text-[#12201b] border-[#4adea8] hover:opacity-90"
              : "bg-[#12201b] text-[#4adea8] border-[#2d463b] hover:border-[#4adea8]"
          }`}
        >
          {accionTexto}
          <ArrowForwardOutlinedIcon sx={{ fontSize: 18 }} />
        </button>
      )}
    </div>
  );
}
