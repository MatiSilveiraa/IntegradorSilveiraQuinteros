import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import { nombreMes } from "../../utils/dateUtils";
import type { Cuota } from "../../types";

type Props = {
  cuota: Cuota;
};

export default function ResumenCuentaCard({ cuota }: Props) {
  const bonificada =
    cuota?.montoFinal === 0 ||
    cuota?.estado?.toUpperCase() === "BONIFICADA";

  const estado = bonificada
    ? "BONIFICADA"
    : cuota?.estado ?? "SIN CUOTA";

  const importe = cuota?.montoFinal ?? 0;

  const periodo =
    cuota?.mes && cuota?.anio
      ? `${nombreMes(cuota.mes)} ${cuota.anio}`
      : "Sin cuota";

  const badgeClasses =
    bonificada
      ? "bg-purple-500/10 text-purple-300 border-purple-500/20"
      : estado === "PAGADA"
      ? "bg-[#4adea8]/10 text-[#4adea8] border-[#4adea8]/20"
      : estado === "VENCIDA"
      ? "bg-red-500/10 text-red-400 border-red-500/20"
      : "bg-amber-500/10 text-amber-400 border-amber-500/20";

  return (
    <div
      className="
        bg-[#1a2b24]
        border
        border-[#2d463b]
        rounded-2xl
        p-6
        shadow-xl
        h-full
      "
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[#4adea8] font-semibold text-sm">
            Cuota actual
          </p>

          <p className="text-2xl font-bold mt-1 text-white">
            {periodo}
          </p>
        </div>

        <span
          className={`
            text-[10px]
            font-bold
            px-3
            py-1
            rounded-full
            uppercase
            border
            ${badgeClasses}
          `}
        >
          {estado}
        </span>
      </div>

      <div
        className="
          flex
          items-center
          gap-3
          py-5
          border-y
          border-[#2d463b]
          my-5
        "
      >
        <PaymentsOutlinedIcon className="text-gray-400" />

        <span className="text-4xl font-bold text-white">
          ${importe}

          <span className="text-sm font-normal text-gray-400 ml-2">
            UYU
          </span>
        </span>
      </div>

      <div className="text-gray-400 text-sm">
        <p>Período {periodo}</p>

        {bonificada ? (
          <p className="mt-2 text-purple-300">
            Esta cuota fue bonificada y no requiere pago.
          </p>
        ) : (
          (cuota?.descuento ?? 0) > 0 && (
            <p className="mt-2 text-[#4adea8]">
              Descuento aplicado: ${cuota.descuento}
            </p>
          )
        )}
      </div>
    </div>
  );
}