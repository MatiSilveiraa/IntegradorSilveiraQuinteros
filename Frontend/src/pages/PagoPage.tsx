import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import ResumenCuentaCard from "../components/pagos/ResumenCuentaCard";
import MetodoPagoCard from "../components/pagos/MetodoPagoCard";
import HistorialPagosCard from "../components/pagos/HistorialPagosCard";
import SecurityNote from "../components/pagos/SecurityNote";
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
  const [cuotaProcesandoId, setCuotaProcesandoId] =
    useState<number | null>(null);

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);

      const [perfilData, cuotaData, cuotasData] = await Promise.all([
        obtenerMiPerfil(),

        obtenerMiCuota().catch((error) => {
          const mensaje =
            error?.response?.data?.mensaje ??
            error?.response?.data?.message;

          if (
            mensaje ===
            "No existe cuota generada para el mes actual"
          ) {
            return null;
          }

          throw error;
        }),

        obtenerMisCuotas(),
      ]);

      setPerfil(perfilData);
      setCuotaActual(cuotaData);
      setCuotas(Array.isArray(cuotasData) ? cuotasData : []);
    } catch (error) {
      console.error(
        "Error al cargar la información de pagos:",
        error,
      );

      toast.error(
        "No fue posible cargar la información de pagos",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void cargarDatos();
  }, [cargarDatos]);

  useEffect(() => {
  const handlePageShow = (event: PageTransitionEvent) => {
    setCuotaProcesandoId(null);
    toast.dismiss();

    if (event.persisted) {
      void cargarDatos();
    }
  };

  window.addEventListener("pageshow", handlePageShow);

  return () => {
    window.removeEventListener("pageshow", handlePageShow);
  };
}, [cargarDatos]);

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search,
    );

    const resultado = params.get("resultado");

    if (!resultado) {
      return;
    }

    switch (resultado.toLowerCase()) {
      case "success":
        toast.success("Pago realizado correctamente");
        break;

      case "failure":
        toast.error("El pago no pudo completarse");
        break;

      case "pending":
        toast(
          "El pago quedó pendiente de confirmación",
        );
        break;

      default:
        break;
    }

    window.history.replaceState(
      {},
      "",
      window.location.pathname,
    );

    void cargarDatos();
  }, [cargarDatos]);

  const normalizarEstado = (cuota: Cuota) =>
    String(cuota.estado ?? "")
      .trim()
      .toUpperCase();

  const esBonificada = (cuota: Cuota) =>
    normalizarEstado(cuota) === "BONIFICADA";

const handlePagar = async (cuota: Cuota) => {
  const estado = normalizarEstado(cuota);

  if (!cuota.id) {
    toast.error(
      "La cuota seleccionada no tiene un identificador válido",
    );
    return;
  }

  if (esBonificada(cuota)) {
    toast.error(
      "Esta cuota fue bonificada y no requiere pago",
    );
    return;
  }

  if (estado === "PAGADA") {
    toast.error("Esta cuota ya fue pagada");
    return;
  }

  if (
    estado !== "PENDIENTE" &&
    estado !== "VENCIDA"
  ) {
    toast.error(
      "Esta cuota no está disponible para pago",
    );
    return;
  }

  try {
    setCuotaProcesandoId(cuota.id);

    toast.loading("Preparando pago...", {
      id: `mercadopago-${cuota.id}`,
    });

    const respuesta =
      await generarPagoMercadoPago(cuota.id);

    const urlPago =
      respuesta?.urlPago ??
      respuesta?.initPoint ??
      respuesta?.init_point;

    if (!urlPago) {
      throw new Error(
        "El backend no devolvió la URL de Mercado Pago",
      );
    }

    toast.success("Redirigiendo a Mercado Pago...", {
      id: `mercadopago-${cuota.id}`,
    });

    window.location.href = urlPago;
  } catch (error) {
    console.error(
      "Error al generar el pago:",
      error,
    );

    toast.error("No fue posible iniciar el pago", {
      id: `mercadopago-${cuota.id}`,
    });

    setCuotaProcesandoId(null);
  }
};

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <AlumnoLayout nombre={perfil?.nombre}>
      <main className="w-full max-w-7xl mx-auto">
        <header className="mb-6 sm:mb-8">
          <p className="text-[#4adea8] text-xs sm:text-sm font-bold uppercase tracking-[0.14em]">
            Mi cuenta
          </p>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-2">
            Pagos y cuotas
          </h1>

          <p className="text-sm sm:text-base text-gray-400 mt-2 max-w-2xl">
            Consultá el estado de tus cuotas y pagá
            online las pendientes o vencidas.
          </p>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 mb-8">
          <div className="lg:col-span-2">
            {cuotaActual ? (
              <ResumenCuentaCard cuota={cuotaActual} />
            ) : (
              <div className="h-full bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-5 sm:p-6">
                <p className="text-[#4adea8] text-xs font-bold uppercase tracking-wide">
                  Cuota actual
                </p>

                <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
                  No hay cuota para este mes
                </h2>

                <p className="text-sm text-gray-400 mt-2">
                  Actualmente no existe una cuota generada
                  para el mes en curso.
                </p>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <MetodoPagoCard />
          </div>
        </section>

        <HistorialPagosCard
          cuotas={cuotas}
          onPagar={handlePagar}
          cuotaProcesandoId={cuotaProcesandoId}
        />

        <div className="mt-6">
          <SecurityNote />
        </div>
      </main>
    </AlumnoLayout>
  );
}