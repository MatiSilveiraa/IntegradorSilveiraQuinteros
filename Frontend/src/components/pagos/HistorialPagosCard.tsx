import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";

import { nombreMes } from "../../utils/dateUtils";
import type { Cuota } from "../../types";

type Props = {
  cuotas: Cuota[];
};

type EstadoVisual = {
  texto: string;
  clases: string;
};

export default function HistorialPagosCard({ cuotas }: Props) {
  const formatearDinero = (valor?: number) => {
    const monto = valor ?? 0;

    return `$${monto.toLocaleString("es-UY")}`;
  };

  const formatearFecha = (fecha?: string) => {
    if (!fecha) return null;

    return new Date(fecha).toLocaleDateString("es-UY", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const obtenerMonto = (cuota: Cuota) => {
    return cuota.montoFinal ?? cuota.monto ?? cuota.importe ?? 0;
  };

  const esBonificada = (cuota: Cuota) => {
    return (
      cuota.montoFinal === 0 ||
      cuota.estado?.toUpperCase() === "BONIFICADA"
    );
  };

  const obtenerEstadoVisual = (cuota: Cuota): EstadoVisual => {
    if (esBonificada(cuota)) {
      return {
        texto: "BONIFICADA",
        clases:
          "bg-purple-500/10 text-purple-300 border-purple-500/30",
      };
    }

    switch (cuota.estado?.toUpperCase()) {
      case "PAGADA":
        return {
          texto: "PAGADA",
          clases:
            "bg-[#4adea8]/10 text-[#4adea8] border-[#4adea8]/30",
        };

      case "VENCIDA":
        return {
          texto: "VENCIDA",
          clases:
            "bg-red-500/10 text-red-400 border-red-500/30",
        };

      case "PENDIENTE":
        return {
          texto: "PENDIENTE",
          clases:
            "bg-amber-500/10 text-amber-300 border-amber-500/30",
        };

      default:
        return {
          texto: cuota.estado?.toUpperCase() || "SIN ESTADO",
          clases:
            "bg-gray-500/10 text-gray-300 border-gray-500/30",
        };
    }
  };

  const cuotasOrdenadas = [...(cuotas ?? [])].sort((a, b) => {
    const anioA = a.anio ?? a.año ?? 0;
    const anioB = b.anio ?? b.año ?? 0;

    if (anioA !== anioB) {
      return anioB - anioA;
    }

    return (b.mes ?? 0) - (a.mes ?? 0);
  });

  return (
    <section className="mt-2">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
        <div>
          <p className="text-[#4adea8] text-sm font-bold uppercase tracking-wide">
            Historial
          </p>

          <h2 className="text-2xl font-bold text-white mt-2">
            Mis cuotas
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            Revisá el estado y los importes de tus cuotas.
          </p>
        </div>

        <span className="inline-flex self-start sm:self-auto px-3 py-1 rounded-full bg-[#12201b] border border-[#2d463b] text-sm text-gray-300">
          {cuotasOrdenadas.length}{" "}
          {cuotasOrdenadas.length === 1 ? "cuota" : "cuotas"}
        </span>
      </div>

      {!cuotasOrdenadas.length ? (
        <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-8 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#4adea8]/10 border border-[#4adea8]/30 flex items-center justify-center">
            <PaymentsOutlinedIcon className="text-[#4adea8]" />
          </div>

          <h3 className="text-xl font-bold text-white mt-5">
            No hay cuotas registradas
          </h3>

          <p className="text-gray-400 mt-2">
            Cuando se genere una cuota, aparecerá en esta sección.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {cuotasOrdenadas.map((cuota) => {
            const estado = obtenerEstadoVisual(cuota);
            const monto = obtenerMonto(cuota);
            const bonificada = esBonificada(cuota);
            const anio = cuota.anio ?? cuota.año;

            return (
              <article
                key={cuota.id}
                className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-5 hover:border-[#4adea8]/40 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#12201b] border border-[#2d463b] flex items-center justify-center">
                      <CalendarTodayOutlinedIcon
                        className="text-[#4adea8]"
                        fontSize="small"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-bold text-white">
                          {nombreMes(cuota.mes ?? 1)} {anio}
                        </h3>

                        <span
                          className={`inline-flex px-3 py-1 rounded-full border text-[10px] font-bold uppercase ${estado.clases}`}
                        >
                          {estado.texto}
                        </span>
                      </div>

                      {bonificada ? (
                        <p className="text-sm text-purple-300 mt-2">
                          Esta cuota fue bonificada y no requiere pago.
                        </p>
                      ) : cuota.fechaPago ? (
                        <p className="text-sm text-gray-400 mt-2">
                          Pagada el {formatearFecha(cuota.fechaPago)}
                        </p>
                      ) : cuota.fechaVencimiento ? (
                        <p className="text-sm text-gray-400 mt-2">
                          Vence el {formatearFecha(cuota.fechaVencimiento)}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500 mt-2">
                          Sin fecha registrada
                        </p>
                      )}

                      {(cuota.descuento ?? 0) > 0 && (
                        <p className="text-sm text-[#4adea8] mt-2">
                          Descuento aplicado:{" "}
                          {formatearDinero(cuota.descuento)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="md:text-right">
                    <p className="text-sm text-gray-400">
                      Monto final
                    </p>

                    <p className="text-2xl font-bold text-white mt-1">
                      {formatearDinero(monto)}
                    </p>

                    {bonificada && (
                      <p className="text-xs text-purple-300 mt-1">
                        Sin pago requerido
                      </p>
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