import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { nombreMes } from "../../utils/dateUtils";


type Props = {
  cuotas: any[];
};

export default function HistorialPagosCard({ cuotas }: Props) {
  return (
    <div>
      <h2 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">
        Historial de Pagos
      </h2>

      <div className="space-y-3">
        {!cuotas?.length ? (
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 text-center">
            <p className="text-slate-400">No existen pagos registrados.</p>
          </div>
        ) : (
          cuotas.map((cuota) => (
            <div
              key={cuota.id}
              className="
                bg-slate-800/40
                border
                border-slate-700/50
                rounded-xl
                p-4
                flex
                items-center
                justify-between
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
    size-10
    rounded-full
    bg-[#2d463b]
    flex
    items-center
    justify-center
  "
                >
                  <CalendarTodayOutlinedIcon
                    className="text-gray-400"
                    fontSize="small"
                  />
                </div>

                <div>
                  <p className="font-medium text-white">
                    {nombreMes(cuota.mes)} {cuota.anio}
                  </p>
                  <p className="text-xs text-slate-400">
                    {cuota.fechaPago
                      ? `Pagado el ${new Date(
                          cuota.fechaPago,
                        ).toLocaleDateString()}`
                      : "Sin fecha registrada"}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-slate-100">${cuota.importe}</p>

                <span
                  className="
                    inline-flex
                    items-center
                    px-2
                    py-0.5
                    rounded-full
                    text-[10px]
                    font-bold
                    bg-[#4adea8]/10
                    text-[#4adea8]
                    border
                    border-[#4adea8]/20
                    uppercase
                  "
                >
                  {cuota.estado}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
