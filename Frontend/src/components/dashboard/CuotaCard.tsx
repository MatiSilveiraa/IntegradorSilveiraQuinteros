import { useNavigate } from "react-router-dom";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import Card from "../ui/Card";
import type { Cuota } from "../../types";

type Props = {
  cuota?: Cuota;
};

const meses = [
  "",
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];



export default function CuotaCard({ cuota }: Props) {
  const navigate = useNavigate();

  const estado = cuota?.estado?.toUpperCase() ?? "SIN CUOTA";
  const monto = cuota?.montoFinal ?? cuota?.monto ?? cuota?.importe;
  const mes = cuota?.mes ? meses[cuota.mes] : "";
  const anio = cuota?.anio ?? cuota?.año;

  const estaPagada = estado === "PAGADA";
  const estaBonificada =
    estado === "BONIFICADA" || (monto !== undefined && monto === 0);
  const estaPendiente = estado === "PENDIENTE" || estado === "VENCIDA";
  const sinCuota = estado === "SIN CUOTA";

  const colorIcono = estaPagada
  ? "#4adea8"
  : estaBonificada
  ? "#c084fc"
  : estado === "VENCIDA"
  ? "#ef4444"
  : "#facc15";

  const formatearDinero = (valor?: number) => {
    if (valor === undefined || valor === null) return null;

    return `$${valor.toLocaleString("es-UY")}`;
  };

  const formatearFecha = (fecha?: string) => {
    if (!fecha) return null;

    return new Date(fecha).toLocaleDateString("es-UY", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const obtenerEstadoVisual = () => {
    if (estaPagada) {
      return {
        texto: "Pagada",
        clases: "bg-[#4adea8]/10 text-[#4adea8] border-[#4adea8]/30",
        descripcion: "Tu cuota está al día.",
      };
    }

    if (estaBonificada) {
      return {
        texto: "Bonificada",
        clases: "bg-purple-500/10 text-purple-300 border-purple-500/30",
        descripcion: "Esta cuota no requiere pago.",
      };
    }

    if (estado === "VENCIDA") {
      return {
        texto: "Vencida",
        clases: "bg-red-500/10 text-red-400 border-red-500/30",
        descripcion: "Tenés una cuota vencida pendiente de pago.",
      };
    }

    if (estaPendiente) {
      return {
        texto: "Pendiente",
        clases: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30",
        descripcion: "Tenés una cuota pendiente de pago.",
      };
    }

    return {
      texto: "Sin cuota",
      clases: "bg-gray-500/10 text-gray-300 border-gray-500/30",
      descripcion: "No hay una cuota generada para el mes actual.",
    };
  };

  const estadoVisual = obtenerEstadoVisual();

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[#4adea8] text-sm font-bold uppercase tracking-wide">
            Mi cuota
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <span
              className={`inline-flex px-3 py-1 rounded-full border text-xs font-bold ${estadoVisual.clases}`}
            >
              {estadoVisual.texto}
            </span>

            {(mes || anio) && (
              <span className="text-sm text-gray-400">
                {mes} {anio}
              </span>
            )}
          </div>

          {!sinCuota && monto !== undefined && (
            <p className="text-4xl font-bold text-white mt-5">
              {formatearDinero(monto)}
            </p>
          )}

          <p className="text-gray-400 mt-3">{estadoVisual.descripcion}</p>

          {cuota?.fechaVencimiento && !estaPagada && !estaBonificada && (
            <p className="text-sm text-gray-500 mt-2">
              Vence el {formatearFecha(cuota.fechaVencimiento)}
            </p>
          )}

          {cuota?.fechaPago && estaPagada && (
            <p className="text-sm text-gray-500 mt-2">
              Pagada el {formatearFecha(cuota.fechaPago)}
            </p>
          )}

          <button
            type="button"
            onClick={() => navigate("/alumno/pagos")}
            className={`mt-6 px-5 py-3 rounded-xl font-bold transition-all ${
              estaPendiente && !estaBonificada
                ? "bg-[#4adea8] text-[#12201b] hover:brightness-110"
                : "bg-[#12201b] border border-[#2d463b] text-gray-200 hover:border-[#4adea8]"
            }`}
          >
            {estaPendiente && !estaBonificada
              ? "Ver opciones de pago"
              : "Ver mis cuotas"}
          </button>
        </div>

        <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#4adea8]/10 border border-[#4adea8]/30 flex items-center justify-center">
          <CreditCardRoundedIcon
            sx={{
              color: colorIcono,
              fontSize: 32,
            }}
          />
        </div>
      </div>
    </Card>
  );
}
