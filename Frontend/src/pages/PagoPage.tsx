import { useEffect, useState } from "react";
import ResumenCuentaCard from "../components/pagos/ResumenCuentaCard";
import MetodoPagoCard from "../components/pagos/MetodoPagoCard";
import HistorialPagosCard from "../components/pagos/HistorialPagosCard";
import SecurityNote from "../components/pagos/SecurityNote";
import PagoFooter from "../components/pagos/PageFooter";
import {
  generarPagoMercadoPago,
} from "../services/Pago.service";
import { obtenerMiPerfil } from "../services/Perfil.service";
import {
  obtenerMiCuota,
  obtenerMisCuotas,
} from "../services/Cuota.service";
import AlumnoTopBar from "../components/navigation/DashboardTopBar";
import AlumnoSidebar from "../components/navigation/AlumnoSidebar";
import AlumnoBottomNav from "../components/navigation/AlumnoBottomNav";

export default function PagosPage() {

  const [perfil, setPerfil] =
    useState<any>(null);

  const [cuotaActual, setCuotaActual] =
    useState<any>(null);

  const [cuotas, setCuotas] =
    useState<any[]>([]);

  useEffect(() => {

    obtenerMiPerfil()
      .then(setPerfil)
      .catch(console.error);

  }, []);

  useEffect(() => {

    obtenerMiCuota()
      .then((data) => {

        setCuotaActual(data);

      })
      .catch((error) => {

        if (
          error.response?.data?.mensaje ===
          "No existe cuota generada para el mes actual"
        ) {

          setCuotaActual({
            estado: "Sin cuota",
          });

          return;
        }

        console.error(error);

      });

  }, []);

  useEffect(() => {

    obtenerMisCuotas()
      .then((data) => {

        setCuotas(data);

      })
      .catch(console.error);

  }, []);

 const handlePagar = async () => {
  try {

    console.log("Cuota actual:", cuotaActual);

    if (!cuotaActual?.id) {
      return;
    }

    const data =
      await generarPagoMercadoPago(
        cuotaActual.id
      );

    console.log("Respuesta:", data);

    window.location.href =
      data.urlPago;

  } catch (error) {

    console.error(error);

  }
};

  return (
  <div className="min-h-screen bg-[#12201b] text-white">

    <AlumnoTopBar
      nombre={perfil?.nombre}
    />

    <AlumnoSidebar />

    <main
      className="
        pt-20
        pb-24
        px-4
        lg:px-6
        lg:ml-64
        max-w-7xl
        mx-auto
      "
    >

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Pagos
        </h1>

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

          <ResumenCuentaCard
            cuota={cuotaActual}
          />

        </div>

        <div>

          <MetodoPagoCard />

        </div>

        <div className="lg:col-span-3">

          <HistorialPagosCard
            cuotas={cuotas}
          />

        </div>

      </div>

      <SecurityNote />

      <div className="mt-8 flex justify-center">

        <div className="w-full lg:w-96">

          <PagoFooter
            onPagar={handlePagar}
            disabled={
              !cuotaActual ||
              cuotaActual?.estado ===
                "PAGADA" ||
              cuotaActual?.estado ===
                "Sin cuota"
            }
          />

        </div>

      </div>

    </main>

    <AlumnoBottomNav />

  </div>
);
}