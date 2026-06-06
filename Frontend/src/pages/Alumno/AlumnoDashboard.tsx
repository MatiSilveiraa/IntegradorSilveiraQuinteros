import { useEffect, useState } from "react";

import { obtenerMiPerfil } from "../../services/Perfil.service";
import { obtenerMiCuota } from "../../services/Cuota.service";
import { obtenerMiHistorial } from "../../services/Historial.service";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import ProximaClaseCard from "../../components/dashboard/ProximaClaseCard";
import CuotaCard from "../../components/dashboard/CuotaCard";
import RachaCard from "../../components/dashboard/RachaCard";
import ResumenCard from "../../components/dashboard/ResumenCard";
import NovedadesCard from "../../components/dashboard/NovedadesCard";

import AlumnoTopBar from "../../components/navigation/AlumnoTopBar";
import AlumnoBottomNav from "../../components/navigation/AlumnoBottomNav";
import AlumnoSidebar from "../../components/navigation/AlumnoSidebar";

export default function AlumnoDashboard() {
  const [perfil, setPerfil] = useState<any>(null);
  const [cuota, setCuota] = useState<any>(null);
  const [historial, setHistorial] = useState<any>(null);

  useEffect(() => {
    obtenerMiPerfil().then(setPerfil).catch(console.error);

    obtenerMiHistorial().then(setHistorial).catch(console.error);

    obtenerMiCuota()
      .then(setCuota)
      .catch((error) => {
        if (
          error.response?.data?.mensaje ===
          "No existe cuota generada para el mes actual"
        ) {
          setCuota({
            estado: "Sin cuota",
          });
          return;
        }

        console.error(error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#0e1511] text-white">
      {/* TOP BAR */}

      <AlumnoTopBar nombre={perfil?.nombre} />
        

      {/* SIDEBAR (solo desktop) */}

      <AlumnoSidebar />

      {/* CONTENIDO */}

      <main className="pt-20 pb-24 px-4 lg:px-6 lg:ml-64 max-w-7xl mx-auto">
        <DashboardHeader nombre={perfil?.nombre} />

        <div className="grid gap-4 lg:grid-cols-2">
          <ProximaClaseCard />

          <CuotaCard cuota={cuota} />

          <RachaCard racha={perfil?.rachaAsistenciaMensual} />

          <ResumenCard historial={historial} />

          <NovedadesCard />
        </div>
      </main>

      {/* NAV MOBILE */}

      <AlumnoBottomNav />
    </div>
  );
}
