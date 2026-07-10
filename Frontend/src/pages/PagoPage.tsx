import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import ResumenCuentaCard from "../components/pagos/ResumenCuentaCard";
import MetodoPagoCard from "../components/pagos/MetodoPagoCard";
import HistorialPagosCard from "../components/pagos/HistorialPagosCard";
import SecurityNote from "../components/pagos/SecurityNote";
import PagoFooter from "../components/pagos/PageFooter";
import AlumnoLayout from "../components/layout/DashboardLayout";
import FullPageLoader from "../components/FullScreenSpinner";

import { generarPagoMercadoPago } from "../services/Pago.service";
import { obtenerMiPerfil } from "../services/Perfil.service";
import {
  obtenerMiCuota,
  obtenerMisCuotas,
} from "../services/Cuota.service";

import type { Perfil, Cuota } from "../types";

export default function PagosPage() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [loading, setLoading] = useState(true);

  const [cuotaActual, setCuotaActual] = useState<Cuota | null>(null);
  const [cuotas, setCuotas] = useState<Cuota[]>([]);

  const esCuotaBonificada = (cuota?: Cuota | null) => {
    if (!cuota) return false;

    return (
      cuota.montoFinal === 0 ||
      cuota.estado?.toUpperCase() === "BONIFICADA"
    );
  };

  const cuotaBonificada = esCuotaBonificada(cuotaActual);

  const cuotaPagada =
    cuotaActual?.estado?.toUpperCase() === "PAGADA";

  const sinCuota =
    !cuotaActual ||
    cuotaActual.id === 0 ||
    cuotaActual.estado?.toUpperCase() === "SIN CUOTA";

  const resumenCuotas = useMemo(() => {
    const esBonificada = (cuota: Cuota) =>
      cuota.montoFinal === 0 ||
      cuota.estado?.toUpperCase() === "BONIFICADA";

    const esPagada = (cuota: Cuota) =>
      cuota.estado?.toUpperCase() === "PAGADA";

    const esVencida = (cuota: Cuota) =>
      !esBonificada(cuota) &&
      cuota.estado?.toUpperCase() === "VENCIDA";

    const esPendiente = (cuota: Cuota) =>
      !esBonificada(cuota) &&
      !esPagada(cuota) &&
      !esVencida(cuota);

    return {
      total: cuotas.length,
      pagadas: cuotas.filter(esPagada).length,
      pendientes: cuotas.filter(esPendiente).length,
      bonificadas: cuotas.filter(esBonificada).length,
      vencidas: cuotas.filter(esVencida).length,
    };
  }, [cuotas]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);

        const [perfilData, cuotaData, cuotasData] = await Promise.all([
          obtenerMiPerfil(),

          obtenerMiCuota().catch((error) => {
            if (
              error.response?.data?.mensaje ===
              "No existe cuota generada para el mes actual"
            ) {
              return {
                id: 0,
                estado: "Sin cuota",
              } as Cuota;
            }

            throw error;
          }),

          obtenerMisCuotas(),
        ]);

        setPerfil(perfilData);
        setCuotaActual(cuotaData);
        setCuotas(cuotasData);
      } catch (error) {
        console.error(error);

        toast.error(
          "No fue posible cargar la información de pagos"
        );
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const handlePagar = async () => {
    if (cuotaBonificada) {
      toast.error(
        "Esta cuota fue bonificada y no requiere pago."
      );
      return;
    }

    if (cuotaPagada) {
      toast.error("Esta cuota ya fue pagada.");
      return;
    }

    if (sinCuota || !cuotaActual?.id) {
      toast.error("No existe una cuota pendiente.");
      return;
    }

    try {
      toast.loading("Preparando pago...", {
        id: "mercadopago",
      });

      const data = await generarPagoMercadoPago(
        cuotaActual.id
      );

      toast.success(
        "Redirigiendo a Mercado Pago...",
        {
          id: "mercadopago",
        }
      );

      window.location.href = data.urlPago;
    } catch (error) {
      console.error(error);

      toast.error(
        "No fue posible iniciar el pago",
        {
          id: "mercadopago",
        }
      );
    }
  };

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <AlumnoLayout nombre={perfil?.nombre}>
      <main className="max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-[#4adea8] text-sm font-bold uppercase tracking-wide">
            Mi cuenta
          </p>

          <h1 className="text-3xl lg:text-4xl font-bold mt-2">
            Pagos y cuotas
          </h1>

          <p className="text-gray-400 mt-2">
            Consultá el estado de tus cuotas y realizá pagos online.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5 mb-8">
          <ResumenPago
            titulo="Total"
            valor={resumenCuotas.total}
            descripcion="Cuotas registradas"
          />

          <ResumenPago
            titulo="Pagadas"
            valor={resumenCuotas.pagadas}
            descripcion="Pagos confirmados"
            variante="verde"
          />

          <ResumenPago
            titulo="Pendientes"
            valor={resumenCuotas.pendientes}
            descripcion="Pendientes de pago"
            variante="amarillo"
          />

          <ResumenPago
            titulo="Bonificadas"
            valor={resumenCuotas.bonificadas}
            descripcion="Sin pago requerido"
            variante="violeta"
          />

          <ResumenPago
            titulo="Vencidas"
            valor={resumenCuotas.vencidas}
            descripcion="Fuera de fecha"
            variante="rojo"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {cuotaActual && (
              <ResumenCuentaCard cuota={cuotaActual} />
            )}
          </div>

          <div>
            <MetodoPagoCard />
          </div>

          <div className="lg:col-span-3">
            <HistorialPagosCard cuotas={cuotas} />
          </div>
        </div>

        <SecurityNote />

        <div className="mt-8 flex justify-center">
          <div className="w-full lg:w-96">
            <PagoFooter
              onPagar={handlePagar}
              disabled={
                sinCuota ||
                cuotaPagada ||
                cuotaBonificada
              }
            />
          </div>
        </div>
      </main>
    </AlumnoLayout>
  );
}

function ResumenPago({
  titulo,
  valor,
  descripcion,
  variante = "normal",
}: {
  titulo: string;
  valor: number;
  descripcion: string;
  variante?: "normal" | "verde" | "amarillo" | "violeta" | "rojo";
}) {
  const estilos = {
    normal: "text-white",
    verde: "text-[#4adea8]",
    amarillo: "text-amber-300",
    violeta: "text-purple-300",
    rojo: "text-red-400",
  };

  return (
    <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-5 shadow-lg shadow-black/10">
      <p className="text-sm text-gray-400">
        {titulo}
      </p>

      <p
        className={`text-4xl font-bold mt-3 ${estilos[variante]}`}
      >
        {valor}
      </p>

      <p className="text-xs text-gray-500 mt-2">
        {descripcion}
      </p>
    </div>
  );
}