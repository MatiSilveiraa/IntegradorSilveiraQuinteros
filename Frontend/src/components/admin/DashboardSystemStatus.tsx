import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

type Props = {
  dashboard: any;
};

export default function DashboardSystemStatus({
  dashboard,
}: Props) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-[#2d463b]
        bg-[#1a211d]
        p-7
        h-full
      "
    >
      <h2 className="text-2xl font-bold mb-8">
        Estado del sistema
      </h2>

      <div className="space-y-5">

        <StatusCard
          icon={
            <CalendarMonthOutlinedIcon />
          }
          color="bg-red-500/10 text-red-400"
          titulo="Cuotas vencidas"
          valor={dashboard.cuotasVencidas}
        />

        <StatusCard
          icon={
            <CardGiftcardOutlinedIcon />
          }
          color="bg-amber-500/10 text-amber-400"
          titulo="Beneficios pendientes"
          valor={dashboard.beneficiosPendientes}
        />

        <StatusCard
          icon={
            <EmojiEventsOutlinedIcon />
          }
          color="bg-sky-500/10 text-sky-400"
          titulo="Premios físicos"
          valor={dashboard.premiosFisicosPendientes}
        />

        <StatusCard
          icon={
            <CheckCircleOutlineOutlinedIcon />
          }
          color="bg-[#4adea8]/10 text-[#4adea8]"
          titulo="Sistema"
          valor="Todo funcionando"
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
};

function StatusCard({
  titulo,
  valor,
  color,
  icon,
}: CardProps) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-[#2d463b]
        p-5
        flex
        items-center
        gap-5
      "
    >
      <div
        className={`
          w-14
          h-14
          rounded-xl
          flex
          items-center
          justify-center
          ${color}
        `}
      >
        {icon}
      </div>

      <div>
        <p className="text-gray-400">
          {titulo}
        </p>

        <h3 className="text-2xl font-bold mt-1">
          {valor}
        </h3>
      </div>

    </div>
  );
}