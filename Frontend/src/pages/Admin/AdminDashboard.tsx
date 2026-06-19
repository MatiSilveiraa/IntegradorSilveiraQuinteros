import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";

import { obtenerDashboardAdmin } from "../../services/Admin.Service";
import { obtenerMiPerfil } from "../../services/Perfil.service";
import TopBar from "../../components/navigation/DashboardTopBar";
import toast from "react-hot-toast";

import type { Perfil } from "../../types";
import FullScreenLoading from "../../components/FullScreenSpinner";

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

  const cards = [
    {
      titulo: "Alumnos Activos",
      valor: dashboard?.alumnosActivos ?? 0,
      icono: <PeopleOutlineOutlinedIcon />,
    },
    {
      titulo: "Desafíos Activos",
      valor: dashboard?.desafiosActivos ?? 0,
      icono: <EmojiEventsOutlinedIcon />,
    },
    {
      titulo: "Cuotas Pendientes",
      valor: dashboard?.cuotasPendientes ?? 0,
      icono: <PaymentsOutlinedIcon />,
    },
    {
      titulo: "Cuotas Vencidas",
      valor: dashboard?.cuotasVencidas ?? 0,
      icono: <WarningAmberOutlinedIcon />,
    },
    {
      titulo: "Beneficios Pendientes",
      valor: dashboard?.beneficiosPendientes ?? 0,
      icono: <CardGiftcardOutlinedIcon />,
    },
    {
      titulo: "Premios Físicos",
      valor: dashboard?.premiosFisicosPendientes ?? 0,
      icono: <Inventory2OutlinedIcon />,
    },
    {
      titulo: "Notificaciones",
      valor: dashboard?.notificacionesNoLeidas ?? 0,
      icono: <NotificationsOutlinedIcon />,
    },
    {
      titulo: "Ingresos del Mes",
      valor: `$ ${dashboard?.ingresosMesActual ?? 0}`,
      icono: <MonetizationOnOutlinedIcon />,
    },
  ];

  if (loading) {
  return <FullScreenLoading />;
}

return (
  <div className="min-h-screen bg-[#12201b] text-white">

  <div className="min-h-screen bg-[#12201b] text-white">
    <TopBar nombre={perfil?.nombre} />

    <main
      className="
        max-w-7xl
        mx-auto
        px-6
        pt-24
        pb-8
      "
    >
      {/* HERO */}

      <div
        className="
          rounded-3xl
          border
          border-[#4adea8]/20
          bg-gradient-to-r
          from-[#1a2b24]
          to-[#163129]
          p-8
          mb-8
        "
      >
        <span
          className="
            inline-block
            px-3
            py-1
            rounded-full
            bg-[#4adea8]
            text-[#12201b]
            text-xs
            font-bold
          "
        >
          PANEL ADMINISTRADOR
        </span>

        <h1 className="text-4xl font-bold mt-4">Bienvenido {perfil?.nombre}</h1>

        <p className="text-gray-300 mt-2">
          Gestiona alumnos, pagos, desafíos, beneficios y premios del gimnasio.
        </p>
      </div>

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
            gap-4
            hover:border-amber-400/40
            transition-all
          "
        >
          <div>
            <h3 className="text-amber-400 text-lg font-bold">
              🔐 Seguridad recomendada
            </h3>

            <p className="text-gray-300 mt-1">
              Tu cuenta de administrador no tiene autenticación de dos factores
              activa. Actívala para proteger el acceso al panel.
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/seguridad")}
            className="
              px-5
              py-3
              rounded-xl
              bg-[#4adea8]
              text-[#12201b]
              font-bold
              hover:opacity-90
            "
          >
            Activar 2FA
          </button>
        </div>
      )}

      {/* KPIS */}

      <h2 className="text-2xl font-bold mb-5">Estado General</h2>

      <div
        className="
          grid
          gap-5
          md:grid-cols-2
          xl:grid-cols-4
        "
      >
        {cards.map((card) => (
          <div
            key={card.titulo}
            className="
              bg-[#1a2b24]
              border
              border-[#2d463b]
              rounded-3xl
              p-6
              hover:border-[#4adea8]/40
              hover:scale-[1.02]
              transition-all
            "
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">{card.titulo}</p>

                <h2 className="text-3xl font-bold mt-2">{card.valor}</h2>
              </div>

              <div
                className="
                  text-[#4adea8]
                  text-4xl
                "
              >
                {card.icono}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DIVISOR */}

      <div
        className="
          border-t
          border-[#2d463b]
          my-10
        "
      />

      {/* ACCESOS RAPIDOS */}

      <section>
        <h2 className="text-2xl font-bold mb-5">Accesos rápidos</h2>

        <div
          className="
            grid
            gap-4
            md:grid-cols-2
            xl:grid-cols-4
          "
        >
          <button
            onClick={() => navigate("/admin/desafios")}
            className="
              bg-[#1a2b24]
              border
              border-[#2d463b]
              rounded-3xl
              p-6
              text-left
              hover:border-[#4adea8]
              hover:-translate-y-1
              transition-all
            "
          >
            <div className="text-3xl mb-3">🎯</div>

            <h3 className="font-semibold text-lg">Gestionar Desafíos</h3>

            <p className="text-sm text-gray-400 mt-2">
              Crear, editar y administrar desafíos.
            </p>
          </button>

          <button
            onClick={() => navigate("/admin/recompensas")}
            className="
              bg-[#1a2b24]
              border
              border-[#2d463b]
              rounded-3xl
              p-6
              text-left
              hover:border-[#4adea8]
              hover:-translate-y-1
              transition-all
            "
          >
            <div className="text-3xl mb-3">🎁</div>

            <h3 className="font-semibold text-lg">Gestionar Recompensas</h3>

            <p className="text-sm text-gray-400 mt-2">
              Administrar recompensas de desafíos.
            </p>
          </button>

          <button
            onClick={() => navigate("/admin/premios")}
            className="
              bg-[#1a2b24]
              border
              border-[#2d463b]
              rounded-3xl
              p-6
              text-left
              hover:border-[#4adea8]
              hover:-translate-y-1
              transition-all
            "
          >
            <div className="text-3xl mb-3">📦</div>

            <h3 className="font-semibold text-lg">Premios Pendientes</h3>

            <p className="text-sm text-gray-400 mt-2">
              Gestión de entrega de premios físicos.
            </p>
          </button>

          <button
            onClick={() => navigate("/admin/alumnos")}
            className="
              bg-[#1a2b24]
              border
              border-[#2d463b]
              rounded-3xl
              p-6
              text-left
              hover:border-[#4adea8]
              hover:-translate-y-1
              transition-all
            "
          >
            <div className="text-3xl mb-3">👥</div>

            <h3 className="font-semibold text-lg">Gestionar Alumnos</h3>

            <p className="text-sm text-gray-400 mt-2">
              Consulta y administración de alumnos.
            </p>
          </button>

          <button
            onClick={() => navigate("/admin/reactivaciones")}
            className="
              bg-[#1a2b24]
              border
              border-[#2d463b]
              rounded-3xl
              p-6
              text-left
              hover:border-[#4adea8]
              hover:-translate-y-1
              transition-all
            "
          >
            <div className="text-3xl mb-3">🔄</div>

            <h3 className="font-semibold text-lg">Reactivaciones</h3>

            <p className="text-sm text-gray-400 mt-2">
              Revisar solicitudes de reactivación.
            </p>
          </button>
        </div>
      </section>
    </main>
  </div>;
</div>)}
