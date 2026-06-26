import { useEffect, useState } from "react";

import ResumenCuentaCard from "../components/pagos/ResumenCuentaCard";
import MetodoPagoCard from "../components/pagos/MetodoPagoCard";
import HistorialPagosCard from "../components/pagos/HistorialPagosCard";
import SecurityNote from "../components/pagos/SecurityNote";
import PagoFooter from "../components/pagos/PageFooter";
import AlumnoLayout from "../components/layout/DashboardLayout";

import { generarPagoMercadoPago } from "../services/Pago.service";
import { obtenerMiPerfil } from "../services/Perfil.service";
import { obtenerMiCuota, obtenerMisCuotas } from "../services/Cuota.service";

import type { Perfil, Cuota } from "../types";
import toast from "react-hot-toast";
import FullPageLoader from "../components/FullScreenSpinner";

export default function PagosPage() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [loading, setLoading] = useState(true);
  const [cuotaActual, setCuotaActual] = useState<Cuota | null>(null);

  const [cuotas, setCuotas] = useState<Cuota[]>([]);

  useEffect(() => {
  const cargarDatos = async () => {
    try {
      const [
        perfilData,
        cuotaData,
        cuotasData,
      ] = await Promise.all([
        obtenerMiPerfil(),
        obtenerMiCuota().catch((error) => {
          if (
            error.response?.data?.mensaje ===
            "No existe cuota generada para el mes actual"
          ) {
            return {
              id: 0,
              estado: "Sin cuota",
            };
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
  if (!cuotaActual?.id) {
    toast.error(
      "No existe una cuota pendiente"
    );

    return;
  }

  try {
    toast.loading(
      "Preparando pago...",
      {
        id: "mercadopago",
      }
    );

    const data =
      await generarPagoMercadoPago(
        cuotaActual.id
      );

    toast.success(
      "Redirigiendo a Mercado Pago...",
      {
        id: "mercadopago",
      }
    );

    window.location.href =
      data.urlPago;
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
          <h1 className="text-3xl font-bold">Pagos</h1>

          <p className="text-gray-400 mt-2">
            Gestiona tus cuotas y pagos pendientes.
          </p>
        </div>

        <div
          className="
          grid
          gap-6
          lg:grid-cols-3
        "
        >
          <div className="lg:col-span-2">
            {cuotaActual && <ResumenCuentaCard cuota={cuotaActual} />}
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
                !cuotaActual ||
                cuotaActual?.estado === "PAGADA" ||
                cuotaActual?.estado === "Sin cuota"
              }
            />
          </div>
        </div>
      </main>
    </AlumnoLayout>
  );
}
