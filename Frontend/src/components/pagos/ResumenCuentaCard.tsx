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
  const estadoNormalizado = String(cuota?.estado ?? "")
    .trim()
    .toUpperCase();

  const bonificada = estadoNormalizado === "BONIFICADA";
  const estado = bonificada
    ? "BONIFICADA"
    : estadoNormalizado || "SIN CUOTA";

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
  const textoEstado = obtenerTextoEstado(cuota, bonificada);

  return (
    <article className="rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-5 sm:p-6 shadow-lg shadow-black/10">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-[#4adea8]">
            Cuota actual
          </p>

          <h2 className="mt-1 text-xl sm:text-2xl font-bold text-white">
            {periodo}
          </h2>
        </div>

        <span
          className={`inline-flex self-start items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase ${visual.clases}`}
        >
          {visual.icono}
          {estado}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-4 sm:items-center">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#12201b] border border-[#2d463b] flex items-center justify-center">
            <PaymentsOutlinedIcon className="text-[#4adea8]" />
          </div>

          <div>
            <p className="text-xs text-gray-400">Monto final</p>

            <p className="text-3xl sm:text-4xl font-bold text-white leading-none mt-1">
              {formatearDinero(importe)}
              <span className="ml-2 text-xs sm:text-sm font-normal text-gray-400">
                UYU
              </span>
            </p>
          </div>
        </div>

        <div className="sm:border-l sm:border-[#2d463b] sm:pl-5">
          <p className="text-sm text-gray-300">
            {textoEstado}
          </p>

          {!bonificada && descuento > 0 && (
            <div className="inline-flex items-center gap-2 mt-3 rounded-xl border border-[#4adea8]/20 bg-[#4adea8]/5 px-3 py-2 text-xs sm:text-sm text-[#4adea8]">
              <SavingsOutlinedIcon sx={{ fontSize: 18 }} />
              Beneficio aplicado: -{formatearDinero(descuento)}
            </div>
          )}

          {bonificada && (
            <div className="inline-flex mt-3 rounded-xl border border-purple-500/20 bg-purple-500/5 px-3 py-2 text-xs sm:text-sm text-purple-300">
              Esta cuota no requiere pago.
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function obtenerTextoEstado(cuota: Cuota, bonificada: boolean) {
  if (bonificada) {
    return "Cuota cubierta mediante un beneficio.";
  }

  const estado = String(cuota.estado ?? "")
    .trim()
    .toUpperCase();

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
