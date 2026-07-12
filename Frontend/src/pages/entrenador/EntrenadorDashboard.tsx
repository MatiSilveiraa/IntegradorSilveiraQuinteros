import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import TopBar from "../../components/navigation/DashboardTopBar";
import FullScreenLoading from "../../components/FullScreenSpinner";

import DashboardHero from "../../components/entrenador/dashboard/DashboardHero";
import DashboardStats from "../../components/entrenador/dashboard/DashboardStats";
import DashboardNextClass from "../../components/entrenador/dashboard/DashboardNextClass";
import DashboardAgendaHoy from "../../components/entrenador/dashboard/DashboardAgendaHoy";
import DashboardQuickActions from "../../components/entrenador/dashboard/DashboardQuickActions";

import {
  obtenerDashboardEntrenador,
} from "../../services/Entrenador.Service";

import {
  obtenerMiPerfil,
} from "../../services/Perfil.service";

import type { Perfil } from "../../types";
import type {
  DashboardEntrenador as DashboardEntrenadorDTO,
} from "../../types/entrenadorDashboard";

export default function EntrenadorDashboard() {
  const [loading, setLoading] = useState(true);

  const [perfil, setPerfil] =
    useState<Perfil | null>(null);

  const [dashboard, setDashboard] =
    useState<DashboardEntrenadorDTO | null>(null);

  useEffect(() => {
    let componenteActivo = true;

    const cargarDashboard = async () => {
      try {
        setLoading(true);

        const [perfilData, dashboardData] =
          await Promise.all([
            obtenerMiPerfil(),
            obtenerDashboardEntrenador(),
          ]);

        if (!componenteActivo) {
          return;
        }

        setPerfil(perfilData);
        setDashboard(dashboardData);
      } catch (error: any) {
        if (!componenteActivo) {
          return;
        }

        const status =
          error?.response?.status;

        if (
          !error?.response ||
          status >= 500
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
        if (componenteActivo) {
          setLoading(false);
        }
      }
    };

    void cargarDashboard();

    return () => {
      componenteActivo = false;
    };
  }, []);

  if (loading) {
    return <FullScreenLoading />;
  }

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-[#12201b] text-white">
        <TopBar nombre={perfil?.nombre} />

        <main className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <section className="rounded-3xl bg-[#1a2b24] border border-[#2d463b] p-10 text-center">
            <h1 className="text-2xl font-bold">
              No fue posible cargar el panel
            </h1>

            <p className="text-gray-400 mt-2">
              Actualizá la página para volver a intentarlo.
            </p>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      <TopBar nombre={perfil?.nombre} />

      <main className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <DashboardHero
          nombre={perfil?.nombre}
          clasesHoy={dashboard.clasesHoy}
        />

        <DashboardStats
          dashboard={dashboard}
        />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(420px,0.85fr)] mb-10">
          <DashboardNextClass
            clase={dashboard.proximaClase}
          />

          <DashboardAgendaHoy
            agenda={dashboard.agendaHoy ?? []}
          />
        </div>

        <DashboardQuickActions
          proximaClaseId={
            dashboard.proximaClase?.claseId
          }
        />
      </main>
    </div>
  );
}