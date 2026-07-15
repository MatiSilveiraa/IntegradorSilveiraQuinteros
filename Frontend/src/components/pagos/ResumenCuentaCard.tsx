import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";

import { nombreMes } from "../../utils/dateUtils";
import type { Cuota } from "../../types";

type Props = {
  cuota: Cuota;
};

export default function ResumenCuentaCard({ cuota }: Props) {
  const bonificada =
    cuota?.estado?.toUpperCase() === "BONIFICADA" ||
    (cuota?.montoFinal === 0 &&
      cuota?.estado?.toUpperCase() !== "PENDIENTE");

  const estado = bonificada
    ? "BONIFICADA"
    : cuota?.estado?.toUpperCase() ?? "SIN CUOTA";

  const importe =
    cuota?.montoFinal ??
    cuota?.monto ??
    cuota?.importe ??
    0;

  const periodo =
    cuota?.mes && (cuota?.anio || cuota?.año)
      ? `${nombreMes(cuota.mes)} ${cuota.anio ?? cuota.año}`
      : "Sin cuota";

  const descuento = cuota?.descuento ?? 0;
  const visual = obtenerVisualEstado(estado);

  return (
    <div className="h-full rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-6 shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#4adea8]">
            Cuota actual
          </p>

          <p className="mt-1 text-2xl font-bold text-white">
            {periodo}
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase ${visual.clases}`}
        >
          {visual.icono}
          {estado}
        </span>
      </div>

      <div className="my-5 flex items-center gap-3 border-y border-[#2d463b] py-5">
        <PaymentsOutlinedIcon className="text-gray-400" />

        <span className="text-4xl font-bold text-white">
          {formatearDinero(importe)}

          <span className="ml-2 text-sm font-normal text-gray-400">
            UYU
          </span>
        </span>
      </div>

      <div className="space-y-3 text-sm">
        <p className="text-gray-400">
          {obtenerTextoEstado(cuota, bonificada)}
        </p>

        {bonificada && (
          <p className="rounded-xl border border-purple-500/20 bg-purple-500/5 px-3 py-2 text-purple-300">
            Esta cuota fue bonificada y no requiere pago.
          </p>
        )}

        {!bonificada && descuento > 0 && (
          <div className="inline-flex items-center gap-2 rounded-xl border border-[#4adea8]/20 bg-[#4adea8]/5 px-3 py-2 text-[#4adea8]">
            <SavingsOutlinedIcon sx={{ fontSize: 18 }} />
            Beneficio aplicado: -{formatearDinero(descuento)}
          </div>
        )}
      </div>
    </div>
  );
}

function obtenerTextoEstado(cuota: Cuota, bonificada: boolean) {
  if (bonificada) {
    return "Cuota cubierta mediante un beneficio.";
  }

  const estado = cuota.estado?.toUpperCase();

  if (estado === "PAGADA") {
    return cuota.fechaPago
      ? `Pagada el ${formatearFecha(cuota.fechaPago)}`
      : "Pago confirmado";
  }

  if (estado === "PENDIENTE") {
    return cuota.fechaVencimiento
      ? `Vence el ${formatearFecha(cuota.fechaVencimiento)}`
      : "Pendiente de pago";
  }

  if (estado === "VENCIDA") {
    return cuota.fechaVencimiento
      ? `Venció el ${formatearFecha(cuota.fechaVencimiento)}`
      : "La cuota se encuentra vencida";
  }

  return `Período ${nombreMes(cuota.mes ?? 1)} ${
    cuota.anio ?? cuota.año ?? ""
  }`;
}

function obtenerVisualEstado(estado: string) {
  switch (estado) {
    case "PAGADA":
      return {
        clases:
          "bg-[#4adea8]/10 text-[#4adea8] border-[#4adea8]/20",
        icono: <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 14 }} />,
      };

    case "BONIFICADA":
      return {
        clases:
          "bg-purple-500/10 text-purple-300 border-purple-500/20",
        icono: <CardGiftcardOutlinedIcon sx={{ fontSize: 14 }} />,
      };

    case "VENCIDA":
      return {
        clases:
          "bg-red-500/10 text-red-400 border-red-500/20",
        icono: <AccessTimeOutlinedIcon sx={{ fontSize: 14 }} />,
      };

    default:
      return {
        clases:
          "bg-amber-500/10 text-amber-400 border-amber-500/20",
        icono: <AccessTimeOutlinedIcon sx={{ fontSize: 14 }} />,
      };
  }
}

function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString("es-UY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Montevideo",
  });
}

function formatearDinero(valor?: number) {
  return new Intl.NumberFormat("es-UY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor ?? 0);
}
