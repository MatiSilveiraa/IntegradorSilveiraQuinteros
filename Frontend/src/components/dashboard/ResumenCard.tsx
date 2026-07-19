import { useNavigate } from "react-router-dom";
import Card from "../ui/Card";
import type { ReactNode } from "react";
import type { Historial } from "../../types";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";


type Props = {
  historial?: Historial;
};

export default function ResumenCard({ historial }: Props) {
  const navigate = useNavigate();

  const asistencias = historial?.asistencias?.length ?? 0;
  const pagos = historial?.pagos?.length ?? 0;
 

  return (
    <Card className="lg:col-span-2">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <p className="text-[#4adea8] text-sm font-bold uppercase tracking-wide">
            Tu actividad
          </p>

          <h3 className="text-2xl font-bold text-white mt-3">
            Resumen de tu cuenta
          </h3>

          <p className="text-gray-400 mt-2">
            Consultá rápidamente tus asistencias y movimientos.
          </p>
        </div>

        <div className="hidden md:flex w-14 h-14 shrink-0 rounded-2xl bg-blue-500/10 border border-blue-500/30 items-center justify-center">
          <DashboardRoundedIcon
            sx={{
              color: "#60a5fa",
              fontSize: 32,
            }}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ResumenItem
          titulo="Asistencias"
          valor={asistencias}
          descripcion="Registros acumulados"
          icono={
            <CalendarMonthRoundedIcon
              sx={{ color: "#60a5fa", fontSize: 24 }}
            />
          }
          onClick={() => navigate("/alumno/asistencias")}
        />

        <ResumenItem
          titulo="Pagos"
          valor={pagos}
          descripcion="Pagos confirmados"
          icono={
            <CreditCardRoundedIcon
              sx={{
                color: "#4adea8",
                fontSize: 28,
              }}
            />
          }
          onClick={() => navigate("/alumno/pagos")}
        />
      </div>
    </Card>
  );
}

function ResumenItem({
  titulo,
  valor,
  descripcion,
  icono,
  onClick,
}: {
  titulo: string;
  valor: number;
  descripcion: string;
  icono: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left bg-[#12201b] border border-[#2d463b] rounded-2xl p-5 hover:border-[#4adea8]/60 hover:bg-[#162720] transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-gray-400 text-sm">{titulo}</p>

          <p className="text-4xl font-bold text-white mt-3">{valor}</p>
        </div>

        <div className="w-11 h-11 rounded-xl bg-[#1a2b24] border border-[#2d463b] flex items-center justify-center text-xl">
          {icono}
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-4">{descripcion}</p>

      <p className="text-sm text-[#4adea8] font-semibold mt-4">
        Ver detalle →
      </p>
    </button>
  );
}
