import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import RedeemOutlinedIcon from "@mui/icons-material/RedeemOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

import { nombreMes } from "../../utils/dateUtils";
import type { Cuota } from "../../types";

type Props = {
  cuotas: Cuota[];
  onPagar: (cuota: Cuota) => void;
  cuotaProcesandoId?: number | null;
};

type EstadoVisual = {
  texto: string;
  clases: string;
  icono: React.ReactNode;
};

export default function HistorialPagosCard({
  cuotas,
  onPagar,
  cuotaProcesandoId = null,
}: Props) {
  const normalizarEstado = (cuota: Cuota) =>
    String(cuota.estado ?? "")
      .trim()
      .toUpperCase();

  const formatearDinero = (valor?: number) => {
    const monto = Number(valor ?? 0);

    return `$ ${monto.toLocaleString("es-UY", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatearFecha = (fecha?: string) => {
    if (!fecha) {
      return null;
    }

    const fechaConvertida = new Date(fecha);

    if (Number.isNaN(fechaConvertida.getTime())) {
      return null;
    }

    return fechaConvertida.toLocaleDateString(
      "es-UY",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      },
    );
  };

  const obtenerMonto = (cuota: Cuota) =>
    cuota.montoFinal ??
    cuota.monto ??
    cuota.importe ??
    0;

  const esBonificada = (cuota: Cuota) =>
    normalizarEstado(cuota) === "BONIFICADA";

  const esPagada = (cuota: Cuota) =>
    normalizarEstado(cuota) === "PAGADA";

  const esPagable = (cuota: Cuota) => {
    const estado = normalizarEstado(cuota);

    return (
      estado === "PENDIENTE" ||
      estado === "VENCIDA"
    );
  };

  const obtenerEstadoVisual = (
    cuota: Cuota,
  ): EstadoVisual => {
    const estado = normalizarEstado(cuota);

    switch (estado) {
      case "PAGADA":
        return {
          texto: "Pagada",
          clases:
            "bg-[#4adea8]/10 text-[#4adea8] border-[#4adea8]/30",
          icono: (
            <CheckCircleOutlineOutlinedIcon fontSize="inherit" />
          ),
        };

      case "VENCIDA":
        return {
          texto: "Vencida",
          clases:
            "bg-red-500/10 text-red-400 border-red-500/30",
          icono: (
            <WarningAmberOutlinedIcon fontSize="inherit" />
          ),
        };

      case "PENDIENTE":
        return {
          texto: "Pendiente",
          clases:
            "bg-amber-500/10 text-amber-300 border-amber-500/30",
          icono: (
            <ScheduleOutlinedIcon fontSize="inherit" />
          ),
        };

      case "BONIFICADA":
        return {
          texto: "Bonificada",
          clases:
            "bg-purple-500/10 text-purple-300 border-purple-500/30",
          icono: (
            <RedeemOutlinedIcon fontSize="inherit" />
          ),
        };

      default:
        return {
          texto: cuota.estado
            ? String(cuota.estado)
            : "Sin estado",
          clases:
            "bg-gray-500/10 text-gray-300 border-gray-500/30",
          icono: (
            <PaymentsOutlinedIcon fontSize="inherit" />
          ),
        };
    }
  };

  const cuotasOrdenadas = [...(cuotas ?? [])].sort(
    (a, b) => {
      const anioA = a.anio ?? a.año ?? 0;
      const anioB = b.anio ?? b.año ?? 0;

      if (anioA !== anioB) {
        return anioB - anioA;
      }

      return (b.mes ?? 0) - (a.mes ?? 0);
    },
  );

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
        <div>
          <p className="text-[#4adea8] text-xs sm:text-sm font-bold uppercase tracking-[0.14em]">
            Historial
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
            Mis cuotas
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            Seleccioná una cuota pendiente o vencida
            para realizar el pago.
          </p>
        </div>

        <span className="self-start sm:self-auto px-3 py-1.5 rounded-full bg-[#12201b] border border-[#2d463b] text-xs sm:text-sm text-gray-400">
          {cuotasOrdenadas.length}{" "}
          {cuotasOrdenadas.length === 1
            ? "cuota"
            : "cuotas"}
        </span>
      </div>

      {cuotasOrdenadas.length === 0 ? (
        <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-8 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#4adea8]/10 border border-[#4adea8]/30 flex items-center justify-center">
            <PaymentsOutlinedIcon className="text-[#4adea8]" />
          </div>

          <h3 className="text-xl font-bold text-white mt-5">
            No hay cuotas registradas
          </h3>

          <p className="text-sm text-gray-400 mt-2">
            Las cuotas generadas aparecerán en esta
            sección.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {cuotasOrdenadas.map((cuota) => {
            const estadoVisual =
              obtenerEstadoVisual(cuota);

            const monto = obtenerMonto(cuota);
            const pagable = esPagable(cuota);
            const pagada = esPagada(cuota);
            const bonificada = esBonificada(cuota);

            const anio =
              cuota.anio ?? cuota.año ?? "";

            const procesando =
              cuotaProcesandoId === cuota.id;

            const fechaPago = formatearFecha(
              cuota.fechaPago,
            );

            const fechaVencimiento = formatearFecha(
              cuota.fechaVencimiento,
            );

            return (
              <article
                key={cuota.id}
                className="
                  bg-[#1a2b24]
                  border
                  border-[#2d463b]
                  rounded-2xl
                  sm:rounded-3xl
                  p-4
                  sm:p-5
                  transition-all
                  duration-300
                  hover:border-[#4adea8]/40
                  hover:shadow-lg
                  hover:shadow-black/20
                "
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                  <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-xl sm:rounded-2xl bg-[#12201b] border border-[#2d463b] flex items-center justify-center">
                      <CalendarTodayOutlinedIcon
                        className="text-[#4adea8]"
                        fontSize="small"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <h3 className="text-lg sm:text-xl font-bold text-white">
                          {nombreMes(cuota.mes ?? 1)}{" "}
                          {anio}
                        </h3>

                        <span
                          className={`
                            inline-flex
                            items-center
                            gap-1.5
                            px-2.5
                            py-1
                            rounded-full
                            border
                            text-[10px]
                            sm:text-xs
                            font-bold
                            ${estadoVisual.clases}
                          `}
                        >
                          <span className="text-sm">
                            {estadoVisual.icono}
                          </span>

                          {estadoVisual.texto}
                        </span>
                      </div>

                      <div className="mt-2">
                        {bonificada ? (
                          <p className="text-sm text-purple-300">
                            Esta cuota no requiere pago.
                          </p>
                        ) : fechaPago ? (
                          <p className="text-sm text-gray-400">
                            Pagada el{" "}
                            <span className="text-gray-200">
                              {fechaPago}
                            </span>
                          </p>
                        ) : fechaVencimiento ? (
                          <p className="text-sm text-gray-400">
                            Vencimiento:{" "}
                            <span className="text-gray-200">
                              {fechaVencimiento}
                            </span>
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500">
                            Sin fecha registrada
                          </p>
                        )}
                      </div>

                      {(cuota.descuento ?? 0) > 0 && (
                        <span className="inline-flex mt-3 px-2.5 py-1 rounded-lg bg-[#4adea8]/10 border border-[#4adea8]/30 text-xs text-[#4adea8]">
                          Beneficio aplicado: -{" "}
                          {formatearDinero(
                            cuota.descuento,
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:justify-end">
                    <div className="sm:text-right">
                      <p className="text-xs sm:text-sm text-gray-400">
                        Monto final
                      </p>

                      <p className="text-2xl sm:text-3xl font-bold text-white mt-1">
                        {formatearDinero(monto)}
                      </p>
                    </div>

                    {pagable && (
                      <button
                        type="button"
                        onClick={() => onPagar(cuota)}
                        disabled={
                          cuotaProcesandoId !== null
                        }
                        className="
                          w-full
                          sm:w-auto
                          sm:min-w-52
                          min-h-12
                          px-5
                          py-3
                          rounded-xl
                          sm:rounded-2xl
                          bg-[#009ee3]
                          text-white
                          font-bold
                          inline-flex
                          items-center
                          justify-center
                          gap-3
                          hover:bg-[#00aaf3]
                          hover:-translate-y-0.5
                          active:scale-[0.98]
                          transition-all
                          duration-200
                          disabled:opacity-50
                          disabled:cursor-not-allowed
                          disabled:hover:translate-y-0
                        "
                      >
                        {procesando ? (
                          <>
                            <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                            Preparando...
                          </>
                        ) : (
                          <>
                            <CreditCardOutlinedIcon fontSize="small" />

                            <span>
                              Pagar con Mercado Pago
                            </span>
                          </>
                        )}
                      </button>
                    )}

                    {pagada && (
                      <div className="w-full sm:w-auto sm:min-w-52 min-h-12 px-5 py-3 rounded-xl sm:rounded-2xl bg-[#4adea8]/10 border border-[#4adea8]/30 text-[#4adea8] font-semibold inline-flex items-center justify-center gap-2">
                        <CheckCircleOutlineOutlinedIcon fontSize="small" />
                        Pago confirmado
                      </div>
                    )}

                    {bonificada && (
                      <div className="w-full sm:w-auto sm:min-w-52 min-h-12 px-5 py-3 rounded-xl sm:rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-300 font-semibold inline-flex items-center justify-center gap-2">
                        <RedeemOutlinedIcon fontSize="small" />
                        Sin pago requerido
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}