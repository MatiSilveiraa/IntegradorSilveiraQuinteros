import { useEffect, useState } from "react";

import { obtenerMiPerfil } from "../../services/Perfil.service";
import { obtenerMiCuota } from "../../services/Cuota.service";
import { obtenerMiHistorial } from "../../services/Historial.service";
import { obtenerMisClases } from "../../services/Inscripciones.Service";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import ProximaClaseCard from "../../components/dashboard/ProximaClaseCard";
import CuotaCard from "../../components/dashboard/CuotaCard";
import RachaCard from "../../components/dashboard/RachaCard";
import ResumenCard from "../../components/dashboard/ResumenCard";
import NovedadesCard from "../../components/dashboard/NovedadesCard";

import AlumnoTopBar from "../../components/navigation/DashboardTopBar";
import AlumnoBottomNav from "../../components/navigation/AlumnoBottomNav";
import AlumnoSidebar from "../../components/navigation/AlumnoSidebar";

export default function AlumnoDashboard() {
  const [perfil, setPerfil] = useState<any>(null);

  const [cuota, setCuota] = useState<any>(null);

  const [historial, setHistorial] = useState<any>(null);

  const [misClases, setMisClases] = useState<any[]>([]);

  const diasSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
  ];

  const obtenerProximaClase = (clases: any[]) => {
    if (!clases.length) {
      return null;
    }

    const hoy = new Date().getDay();

    const ordenadas = [...clases].sort(
      (a, b) =>
        diasSemana.indexOf(a.diaSemana) - diasSemana.indexOf(b.diaSemana),
    );

    return (
      ordenadas.find((c) => diasSemana.indexOf(c.diaSemana) >= hoy) ||
      ordenadas[0]
    );
  };

  const proximaClase = obtenerProximaClase(misClases);

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

  useEffect(() => {
    obtenerMisClases().then(setMisClases).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-[#0e1511] text-white">
      {/* TOP BAR */}

      <AlumnoTopBar nombre={perfil?.nombre} />

      {/* SIDEBAR */}

      <AlumnoSidebar />

      {/* CONTENIDO */}

      <main className="pt-20 pb-24 px-4 lg:px-6 lg:ml-64 max-w-7xl mx-auto">
        <DashboardHeader nombre={perfil?.nombre} />

        {perfil && !perfil.twoFactorEnabled && (
          <div
            className="
      mb-6
      bg-amber-500/10
      border
      border-amber-500/30
      rounded-2xl
      p-5
      flex
      items-center
      justify-between
      gap-4
    "
          >
            <div>
              <h3
                className="
          text-amber-400
          font-bold
          text-lg
        "
              >
                🔐 Protegé tu cuenta
              </h3>

              <p className="text-gray-300 mt-1">
                Todavía no tenés activada la autenticación de dos factores
                (2FA). Activala para aumentar la seguridad de tu cuenta.
              </p>
            </div>

            <button
              onClick={() => (window.location.href = "/alumno/seguridad")}
              className="
        px-5
        py-3
        rounded-xl
        bg-[#4adea8]
        text-[#12201b]
        font-bold
        whitespace-nowrap
        hover:opacity-90
      "
            >
              Activar 2FA
            </button>
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          <ProximaClaseCard clase={proximaClase} />

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
