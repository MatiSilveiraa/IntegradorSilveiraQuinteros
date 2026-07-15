import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";

import { nombreMes } from "../../utils/dateUtils";
import type { Cuota } from "../../types";

type Props = {
  cuotas: Cuota[];
};

type EstadoVisual = {
  texto: string;
  clases: string;
  icono: React.ReactNode;
};

export default function HistorialPagosCard({ cuotas }: Props) {
  const cuotasOrdenadas = [...(cuotas ?? [])].sort((a, b) => {
    const anioA = a.anio ?? a.año ?? 0;
    const anioB = b.anio ?? b.año ?? 0;

    if (anioA !== anioB) return anioB - anioA;
    return (b.mes ?? 0) - (a.mes ?? 0);
  });

  const resumen = calcularResumen(cuotasOrdenadas);

  return (
    <section className="mt-2">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-[#4adea8]">
            Historial
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Mis cuotas
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Revisá el estado, los importes y los beneficios aplicados.
          </p>
        </div>

        <span className="inline-flex self-start rounded-full border border-[#2d463b] bg-[#12201b] px-3 py-1 text-sm text-gray-300 sm:self-auto">
          {cuotasOrdenadas.length}{" "}
          {cuotasOrdenadas.length === 1 ? "cuota" : "cuotas"}
        </span>
      </div>

      {cuotasOrdenadas.length > 0 && (
        <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <ResumenItem
            titulo="Pagadas"
            valor={resumen.pagadas}
            icono={<CheckCircleOutlineOutlinedIcon />}
          />

          <ResumenItem
            titulo="Pendientes"
            valor={resumen.pendientes}
            icono={<AccessTimeOutlinedIcon />}
          />

          <ResumenItem
            titulo="Bonificadas"
            valor={resumen.bonificadas}
            icono={<CardGiftcardOutlinedIcon />}
          />

          <ResumenItem
            titulo="Ahorro acumulado"
            valor={formatearDinero(resumen.ahorro)}
            icono={<SavingsOutlinedIcon />}
            valorTexto
          />
        </div>
      )}

      {!cuotasOrdenadas.length ? (
        <div className="rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#4adea8]/30 bg-[#4adea8]/10">
            <PaymentsOutlinedIcon className="text-[#4adea8]" />
          </div>

          <h3 className="mt-5 text-xl font-bold text-white">
            No hay cuotas registradas
          </h3>

          <p className="mt-2 text-gray-400">
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
            const descuento = cuota.descuento ?? 0;

            return (
              <article
                key={cuota.id}
                className="rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-5 transition-all hover:border-[#4adea8]/40 hover:shadow-lg hover:shadow-black/10"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#2d463b] bg-[#12201b]">
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
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase ${estado.clases}`}
                        >
                          {estado.icono}
                          {estado.texto}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-gray-400">
                        {obtenerTextoFecha(cuota)}
                      </p>

                      {bonificada && (
                        <p className="mt-2 text-sm text-purple-300">
                          Esta cuota fue bonificada y no requiere pago.
                        </p>
                      )}

                      {descuento > 0 && (
                        <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-[#4adea8]/20 bg-[#4adea8]/5 px-3 py-2 text-sm text-[#4adea8]">
                          <SavingsOutlinedIcon sx={{ fontSize: 18 }} />
                          Beneficio aplicado: -{formatearDinero(descuento)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="md:text-right">
                    <p className="text-sm text-gray-400">
                      Monto final
                    </p>

                    <p className="mt-1 text-2xl font-bold text-white">
                      {formatearDinero(monto)}
                    </p>

                    {bonificada && (
                      <p className="mt-1 text-xs text-purple-300">
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

function ResumenItem({
  titulo,
  valor,
  icono,
  valorTexto = false,
}: {
  titulo: string;
  valor: number | string;
  icono: React.ReactNode;
  valorTexto?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#2d463b] bg-[#1a2b24] p-4">
      <div className="text-[#4adea8]">{icono}</div>
      <p className={`mt-3 font-bold text-white ${valorTexto ? "text-lg" : "text-2xl"}`}>
        {valor}
      </p>
      <p className="mt-1 text-xs text-gray-400">{titulo}</p>
    </div>
  );
}

function obtenerMonto(cuota: Cuota) {
  return cuota.montoFinal ?? cuota.monto ?? cuota.importe ?? 0;
}

function esBonificada(cuota: Cuota) {
  return (
    cuota.estado?.toUpperCase() === "BONIFICADA" ||
    (cuota.montoFinal === 0 &&
      cuota.estado?.toUpperCase() !== "PENDIENTE")
  );
}

function obtenerEstadoVisual(cuota: Cuota): EstadoVisual {
  if (esBonificada(cuota)) {
    return {
      texto: "BONIFICADA",
      clases:
        "bg-purple-500/10 text-purple-300 border-purple-500/30",
      icono: <CardGiftcardOutlinedIcon sx={{ fontSize: 14 }} />,
    };
  }

  switch (cuota.estado?.toUpperCase()) {
    case "PAGADA":
      return {
        texto: "PAGADA",
        clases:
          "bg-[#4adea8]/10 text-[#4adea8] border-[#4adea8]/30",
        icono: <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 14 }} />,
      };

    case "VENCIDA":
      return {
        texto: "VENCIDA",
        clases:
          "bg-red-500/10 text-red-400 border-red-500/30",
        icono: <ErrorOutlineOutlinedIcon sx={{ fontSize: 14 }} />,
      };

    case "PENDIENTE":
      return {
        texto: "PENDIENTE",
        clases:
          "bg-amber-500/10 text-amber-300 border-amber-500/30",
        icono: <AccessTimeOutlinedIcon sx={{ fontSize: 14 }} />,
      };

    default:
      return {
        texto: cuota.estado?.toUpperCase() || "SIN ESTADO",
        clases:
          "bg-gray-500/10 text-gray-300 border-gray-500/30",
        icono: <PaymentsOutlinedIcon sx={{ fontSize: 14 }} />,
      };
  }
}

function obtenerTextoFecha(cuota: Cuota) {
  const estado = cuota.estado?.toUpperCase();

  if (estado === "PAGADA") {
    return cuota.fechaPago
      ? `Pagada el ${formatearFecha(cuota.fechaPago)}`
      : "Pago confirmado";
  }

  if (estado === "VENCIDA") {
    return cuota.fechaVencimiento
      ? `Venció el ${formatearFecha(cuota.fechaVencimiento)}`
      : "La cuota se encuentra vencida";
  }

  if (estado === "PENDIENTE") {
    return cuota.fechaVencimiento
      ? `Vence el ${formatearFecha(cuota.fechaVencimiento)}`
      : "Pendiente de pago";
  }

  if (esBonificada(cuota)) {
    return "Cuota cubierta mediante un beneficio";
  }

  if (cuota.fechaCreacion) {
    return `Generada el ${formatearFecha(cuota.fechaCreacion)}`;
  }

  return "Estado actualizado";
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
    style: "currency",
    currency: "UYU",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor ?? 0);
}

function calcularResumen(cuotas: Cuota[]) {
  return cuotas.reduce(
    (acumulado, cuota) => {
      const estado = cuota.estado?.toUpperCase();

      if (esBonificada(cuota)) {
        acumulado.bonificadas += 1;
      } else if (estado === "PAGADA") {
        acumulado.pagadas += 1;
      } else if (
        estado === "PENDIENTE" ||
        estado === "VENCIDA"
      ) {
        acumulado.pendientes += 1;
      }

      acumulado.ahorro += cuota.descuento ?? 0;
      return acumulado;
    },
    {
      pagadas: 0,
      pendientes: 0,
      bonificadas: 0,
      ahorro: 0,
    },
  );
}
