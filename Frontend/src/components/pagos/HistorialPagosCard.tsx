import { useEffect, useMemo, useState } from "react";

import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import RedeemOutlinedIcon from "@mui/icons-material/RedeemOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import NavigateBeforeRoundedIcon from "@mui/icons-material/NavigateBeforeRounded";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";

import { nombreMes } from "../../utils/dateUtils";
import type { Cuota } from "../../types";

type Props = {
  cuotas: Cuota[];
  onPagar: (cuota: Cuota) => void;
  cuotaProcesandoId?: number | null;
};

type FiltroEstado =
  | "TODAS"
  | "PAGADA"
  | "PENDIENTE"
  | "VENCIDA"
  | "BONIFICADA";

const REGISTROS_POR_PAGINA = 6;

export default function HistorialPagosCard({
  cuotas,
  onPagar,
  cuotaProcesandoId = null,
}: Props) {
  const [filtroEstado, setFiltroEstado] =
    useState<FiltroEstado>("TODAS");
  const [filtroAnio, setFiltroAnio] = useState("TODOS");
  const [pagina, setPagina] = useState(1);

  const cuotasOrdenadas = useMemo(
    () =>
      [...(cuotas ?? [])].sort((a, b) => {
        const anioA = a.anio ?? a.año ?? 0;
        const anioB = b.anio ?? b.año ?? 0;

        if (anioA !== anioB) {
          return anioB - anioA;
        }

        return (b.mes ?? 0) - (a.mes ?? 0);
      }),
    [cuotas],
  );

  const aniosDisponibles = useMemo(
    () =>
      Array.from(
        new Set(
          cuotasOrdenadas
            .map((cuota) => cuota.anio ?? cuota.año)
            .filter((anio): anio is number => typeof anio === "number"),
        ),
      ).sort((a, b) => b - a),
    [cuotasOrdenadas],
  );

  const cuotasFiltradas = useMemo(
    () =>
      cuotasOrdenadas.filter((cuota) => {
        const estado = normalizarEstado(cuota);
        const anio = cuota.anio ?? cuota.año;

        const coincideEstado =
          filtroEstado === "TODAS" || estado === filtroEstado;

        const coincideAnio =
          filtroAnio === "TODOS" || String(anio) === filtroAnio;

        return coincideEstado && coincideAnio;
      }),
    [cuotasOrdenadas, filtroEstado, filtroAnio],
  );

  const totalPaginas = Math.max(
    1,
    Math.ceil(cuotasFiltradas.length / REGISTROS_POR_PAGINA),
  );

  const cuotasPagina = cuotasFiltradas.slice(
    (pagina - 1) * REGISTROS_POR_PAGINA,
    pagina * REGISTROS_POR_PAGINA,
  );

  useEffect(() => {
    setPagina(1);
  }, [filtroEstado, filtroAnio]);

  useEffect(() => {
    if (pagina > totalPaginas) {
      setPagina(totalPaginas);
    }
  }, [pagina, totalPaginas]);

  return (
    <section id="historial-cuotas">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <p className="text-[#4adea8] text-xs sm:text-sm font-bold uppercase tracking-[0.14em]">
            Historial
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
            Mis cuotas
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            Filtrá el historial y pagá las cuotas pendientes o vencidas.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-400">Estado</span>

            <select
              value={filtroEstado}
              onChange={(event) =>
                setFiltroEstado(event.target.value as FiltroEstado)
              }
              className="w-40 rounded-xl border border-[#2d463b] bg-[#12201b] px-3 py-2.5 text-sm text-white outline-none focus:border-[#4adea8]"
            >
              <option value="TODAS">Todas</option>
              <option value="PAGADA">Pagadas</option>
              <option value="PENDIENTE">Pendientes</option>
              <option value="VENCIDA">Vencidas</option>
              <option value="BONIFICADA">Bonificadas</option>
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-400">Año</span>

            <select
              value={filtroAnio}
              onChange={(event) => setFiltroAnio(event.target.value)}
              className="w-32 rounded-xl border border-[#2d463b] bg-[#12201b] px-3 py-2.5 text-sm text-white outline-none focus:border-[#4adea8]"
            >
              <option value="TODOS">Todos</option>

              {aniosDisponibles.map((anio) => (
                <option key={anio} value={String(anio)}>
                  {anio}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {cuotasFiltradas.length === 0 ? (
        <EstadoVacio />
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-[#2d463b] bg-[#1a2b24]">
            <div className="hidden md:grid grid-cols-[1.2fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-[#2d463b] text-xs font-semibold uppercase tracking-wide text-gray-500">
              <span>Período</span>
              <span>Estado</span>
              <span className="text-right">Monto</span>
              <span className="min-w-48 text-center">Acción</span>
            </div>

            <div className="divide-y divide-[#2d463b]">
              {cuotasPagina.map((cuota) => (
                <FilaCuota
                  key={cuota.id}
                  cuota={cuota}
                  onPagar={onPagar}
                  cuotaProcesandoId={cuotaProcesandoId}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-xs sm:text-sm text-gray-500">
              Mostrando{" "}
              {(pagina - 1) * REGISTROS_POR_PAGINA + 1}–
              {Math.min(
                pagina * REGISTROS_POR_PAGINA,
                cuotasFiltradas.length,
              )}{" "}
              de {cuotasFiltradas.length}
            </p>

            {totalPaginas > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setPagina((actual) => Math.max(1, actual - 1))
                  }
                  disabled={pagina === 1}
                  className="h-10 px-3 rounded-xl border border-[#2d463b] bg-[#12201b] text-gray-300 inline-flex items-center gap-1 disabled:opacity-40"
                >
                  <NavigateBeforeRoundedIcon fontSize="small" />
                  Anterior
                </button>

                <span className="px-3 text-sm text-gray-400">
                  {pagina} / {totalPaginas}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setPagina((actual) =>
                      Math.min(totalPaginas, actual + 1),
                    )
                  }
                  disabled={pagina === totalPaginas}
                  className="h-10 px-3 rounded-xl border border-[#2d463b] bg-[#12201b] text-gray-300 inline-flex items-center gap-1 disabled:opacity-40"
                >
                  Siguiente
                  <NavigateNextRoundedIcon fontSize="small" />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}

function FilaCuota({
  cuota,
  onPagar,
  cuotaProcesandoId,
}: {
  cuota: Cuota;
  onPagar: (cuota: Cuota) => void;
  cuotaProcesandoId: number | null;
}) {
  const estado = normalizarEstado(cuota);
  const visual = obtenerEstadoVisual(estado);

  const monto =
    cuota.montoFinal ??
    cuota.monto ??
    cuota.importe ??
    0;

  const anio = cuota.anio ?? cuota.año ?? "";
  const pagable = estado === "PENDIENTE" || estado === "VENCIDA";
  const procesando = cuotaProcesandoId === cuota.id;

  return (
    <article className="p-4 sm:p-5 md:grid md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-center gap-4">
      <div>
        <p className="font-bold text-white">
          {nombreMes(cuota.mes ?? 1)} {anio}
        </p>

        <p className="text-xs text-gray-500 mt-1">
          {obtenerDetalleFecha(cuota, estado)}
        </p>

        {(cuota.descuento ?? 0) > 0 && (
          <p className="text-xs text-[#4adea8] mt-1">
            Beneficio: -{formatearDinero(cuota.descuento)}
          </p>
        )}
      </div>

      <div className="mt-3 md:mt-0">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${visual.clases}`}
        >
          {visual.icono}
          {visual.texto}
        </span>
      </div>

      <div className="mt-3 md:mt-0 md:text-right">
        <p className="text-xs text-gray-500 md:hidden">
          Monto final
        </p>

        <p className="text-lg sm:text-xl font-bold text-white">
          {formatearDinero(monto)}
        </p>
      </div>

      <div className="mt-4 md:mt-0 md:min-w-48">
        {pagable ? (
          <button
            type="button"
            onClick={() => onPagar(cuota)}
            disabled={cuotaProcesandoId !== null}
            className="w-full min-h-11 px-4 py-2.5 rounded-xl bg-[#009ee3] text-white text-sm font-bold inline-flex items-center justify-center gap-2 hover:bg-[#00aaf3] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {procesando ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Preparando...
              </>
            ) : (
              <>
                <CreditCardOutlinedIcon fontSize="small" />
                Pagar
              </>
            )}
          </button>
        ) : estado === "PAGADA" ? (
          <div className="w-full min-h-11 px-4 py-2.5 rounded-xl border border-[#4adea8]/30 bg-[#4adea8]/10 text-[#4adea8] text-sm font-semibold inline-flex items-center justify-center gap-2">
            <CheckCircleOutlineOutlinedIcon fontSize="small" />
            Confirmado
          </div>
        ) : estado === "BONIFICADA" ? (
          <div className="w-full min-h-11 px-4 py-2.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-semibold inline-flex items-center justify-center gap-2">
            <RedeemOutlinedIcon fontSize="small" />
            Sin pago
          </div>
        ) : (
          <span className="text-sm text-gray-500">Sin acción</span>
        )}
      </div>
    </article>
  );
}

function EstadoVacio() {
  return (
    <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-8 text-center">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-[#4adea8]/10 border border-[#4adea8]/30 flex items-center justify-center">
        <PaymentsOutlinedIcon className="text-[#4adea8]" />
      </div>

      <h3 className="text-xl font-bold text-white mt-5">
        No hay cuotas para mostrar
      </h3>

      <p className="text-sm text-gray-400 mt-2">
        Probá cambiando los filtros seleccionados.
      </p>
    </div>
  );
}

function normalizarEstado(cuota: Cuota) {
  return String(cuota.estado ?? "").trim().toUpperCase();
}

function obtenerDetalleFecha(cuota: Cuota, estado: string) {
  if (estado === "PAGADA" && cuota.fechaPago) {
    return `Pagada el ${formatearFecha(cuota.fechaPago)}`;
  }

  if (estado === "BONIFICADA") {
    return "No requiere pago";
  }

  if (cuota.fechaVencimiento) {
    return estado === "VENCIDA"
      ? `Venció el ${formatearFecha(cuota.fechaVencimiento)}`
      : `Vence el ${formatearFecha(cuota.fechaVencimiento)}`;
  }

  return "Sin fecha registrada";
}

function obtenerEstadoVisual(estado: string) {
  switch (estado) {
    case "PAGADA":
      return {
        texto: "Pagada",
        clases:
          "bg-[#4adea8]/10 text-[#4adea8] border-[#4adea8]/30",
        icono: <CheckCircleOutlineOutlinedIcon fontSize="inherit" />,
      };

    case "VENCIDA":
      return {
        texto: "Vencida",
        clases:
          "bg-red-500/10 text-red-400 border-red-500/30",
        icono: <WarningAmberOutlinedIcon fontSize="inherit" />,
      };

    case "PENDIENTE":
      return {
        texto: "Pendiente",
        clases:
          "bg-amber-500/10 text-amber-300 border-amber-500/30",
        icono: <ScheduleOutlinedIcon fontSize="inherit" />,
      };

    case "BONIFICADA":
      return {
        texto: "Bonificada",
        clases:
          "bg-purple-500/10 text-purple-300 border-purple-500/30",
        icono: <RedeemOutlinedIcon fontSize="inherit" />,
      };

    default:
      return {
        texto: estado || "Sin estado",
        clases:
          "bg-gray-500/10 text-gray-300 border-gray-500/30",
        icono: <PaymentsOutlinedIcon fontSize="inherit" />,
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
  return `$ ${Number(valor ?? 0).toLocaleString("es-UY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
