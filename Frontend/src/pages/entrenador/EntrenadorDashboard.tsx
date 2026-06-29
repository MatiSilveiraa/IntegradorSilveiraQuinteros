import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import TopBar from "../../components/navigation/DashboardTopBar";
import FullScreenLoading from "../../components/FullScreenSpinner";

import DashboardHero from "../../components/entrenador/dashboard/DashboardHero";
import DashboardStats from "../../components/entrenador/dashboard/DashboardStats";
import DashboardNextClass from "../../components/entrenador/dashboard/DashboardNextClass";
import DashboardAgendaHoy from "../../components/entrenador/dashboard/DashboardAgendaHoy";
import DashboardQuickActions from "../../components/entrenador/dashboard/DashboardQuickActions";

import { obtenerDashboardEntrenador } from "../../services/Entrenador.Service";
import { obtenerMiPerfil } from "../../services/Perfil.service";

import type { Perfil } from "../../types";

export default function EntrenadorDashboard() {

  const [loading, setLoading] = useState(true);

  const [perfil, setPerfil] =
    useState<Perfil | null>(null);

  const [dashboard, setDashboard] =
    useState<any>(null);

  useEffect(() => {

    const cargar = async () => {

      try {

        const [perfilData, dashboardData] =
          await Promise.all([
            obtenerMiPerfil(),
            obtenerDashboardEntrenador(),
          ]);

        setPerfil(perfilData);

        setDashboard(dashboardData);

      } catch (error) {

        console.error(error);

        toast.error(
          "No fue posible cargar el dashboard"
        );

      } finally {

        setLoading(false);

      }

    };

    cargar();

  }, []);

  if (loading) {

    return <FullScreenLoading />;

  }

  return (

    <div className="min-h-screen bg-[#12201b] text-white">

      <TopBar nombre={perfil?.nombre} />

      <main
        className="
          max-w-7xl
          mx-auto
          px-6
          pt-24
          pb-10
        "
      >

        <DashboardHero
          nombre={perfil?.nombre}
        />

        <DashboardStats
          dashboard={dashboard}
        />

        <div
          className="
            grid
            xl:grid-cols-[1fr_1.4fr]
            gap-6
            mb-10
          "
        >

          <DashboardNextClass
            clase={dashboard?.proximaClase}
          />

          <DashboardAgendaHoy
            agenda={dashboard?.agendaHoy ?? []}
          />

        </div>

        <DashboardQuickActions />

      </main>

    </div>

  );

}