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

import type {
  DashboardEntrenador,
  Perfil,
} from "../../types";

export default function EntrenadorDashboard() {
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [dashboard, setDashboard] =
    useState<DashboardEntrenador | null>(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);

        const [perfilData, dashboardData] =
          await Promise.all([
            obtenerMiPerfil(),
            obtenerDashboardEntrenador(),
          ]);

        setPerfil(perfilData);
        setDashboard(dashboardData);
      } catch (error: any) {
        if (
          !error?.response ||
          error.response.status >= 500
        ) {
          console.error(
            "[Dashboard entrenador]",
            error,
          );
        }

        toast.error(
          error?.response?.data?.mensaje ??
            "No fue posible cargar el dashboard",
        );
      } finally {
        setLoading(false);
      }
    };

    void cargar();
  }, []);

  if (loading) {
    return <FullScreenLoading />;
  }

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      <TopBar nombre={perfil?.nombre} />

      <main className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <DashboardHero
          nombre={perfil?.nombre}
          clasesHoy={dashboard?.clasesHoy ?? 0}
        />

        <DashboardStats dashboard={dashboard} />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(420px,0.85fr)] mb-10">
          <DashboardNextClass
            clase={dashboard?.proximaClase}
          />

          <DashboardAgendaHoy
            agenda={dashboard?.agendaHoy ?? []}
          />
        </div>

        <DashboardQuickActions
          proximaClaseId={
            dashboard?.proximaClase?.claseId
          }
        />
      </main>
    </div>
  );
}
