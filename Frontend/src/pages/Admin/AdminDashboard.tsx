import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerDashboardAdmin } from "../../services/Admin.Service";
import { obtenerMiPerfil } from "../../services/Perfil.service";
import TopBar from "../../components/navigation/DashboardTopBar";
import toast from "react-hot-toast";
import type { Perfil } from "../../types";
import FullScreenLoading from "../../components/FullScreenSpinner";
import DashboardHero from "../../components/admin/DashboardHero";
import DashboardStats from "../../components/admin/DashboardStats";
import DashboardIncomeChart from "../../components/admin/DashboardIncomeChart";
import DashboardSystemStatus from "../../components/admin/DashboardSystemStatus";
import DashboardQuickActions from "../../components/admin/DashboardQuickActions";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] = useState<any>(null);

  const [perfil, setPerfil] = useState<Perfil | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [dashboardData, perfilData] = await Promise.all([
          obtenerDashboardAdmin(),
          obtenerMiPerfil(),
        ]);

        setDashboard(dashboardData);

        setPerfil(perfilData);
      } catch (error) {
        console.error(error);

        toast.error("No fue posible cargar el dashboard");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  

if (loading) {
  return <FullScreenLoading />;
}

if (!dashboard || !perfil) {
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
      {/* HERO */}

      <DashboardHero />

      {/* ALERTA 2FA */}

      {perfil && !perfil.twoFactorEnabled && (
        <div
          className="
            mb-8
            bg-amber-500/10
            border
            border-amber-500/30
            rounded-3xl
            p-6
            flex
            items-center
            justify-between
            gap-6
          "
        >
          <div>
            <h3 className="text-amber-400 text-lg font-bold">
              Seguridad recomendada
            </h3>

            <p className="text-gray-300 mt-2">
              Activá la autenticación en dos pasos para proteger el acceso al
              panel de administración.
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/seguridad")}
            className="
              px-6
              py-3
              rounded-xl
              bg-[#4adea8]
              text-[#12201b]
              font-bold
              hover:opacity-90
              transition-all
            "
          >
            Activar 2FA
          </button>
        </div>
      )}

      {/* KPIs */}

      <DashboardStats dashboard={dashboard} />

      {/* GRAFICO + ESTADO */}

     <div className="grid xl:grid-cols-[2fr_1fr] gap-6 mb-10 items-start">
  <DashboardIncomeChart
    data={dashboard.ingresosUltimos6Meses}
  />

  <DashboardSystemStatus
    dashboard={dashboard}
  />
</div>

      {/* ACCIONES RAPIDAS */}

      <DashboardQuickActions />
    </main>
  </div>
);}
