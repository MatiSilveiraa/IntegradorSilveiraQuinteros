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

import type { Perfil } from "../../types";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    obtenerDashboardAdmin().then(setDashboard).catch(console.error);
  }, []);

  const [perfil, setPerfil] = useState<Perfil | null>(null);

  useEffect(() => {
    obtenerMiPerfil().then(setPerfil).catch(console.error);
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

  return (
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
        <h1 className="text-4xl font-bold mb-2">Dashboard Admin</h1>

        <p className="text-gray-400 mb-10">Resumen general del gimnasio.</p>

        {perfil && !perfil.twoFactorEnabled && (
          <div
            className="
      mb-8
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
          text-lg
          font-bold
        "
              >
                🔐 Seguridad recomendada
              </h3>

              <p className="text-gray-300 mt-1">
                Tu cuenta de administrador no tiene autenticación de dos
                factores activa. Activala para proteger el acceso al panel.
              </p>
            </div>

            <button
             onClick={() => {
  console.log("click");
  navigate("/admin/seguridad");
}}
              className="
        px-5
        py-3
        rounded-xl
        bg-[#4adea8]
        text-[#12201b]
        font-bold
      "
            >
              Activar 2FA
            </button>
          </div>
        )}

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
                rounded-2xl
                p-5
                hover:border-[#4adea8]/40
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

        <div className="mt-12">
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
                rounded-2xl
                p-5
                text-left
                hover:border-[#4adea8]
                transition-all
              "
            >
              <div className="text-2xl mb-2">🎯</div>

              <h3 className="font-semibold">Gestionar Desafíos</h3>

              <p className="text-sm text-gray-400 mt-1">
                Crear, editar y eliminar desafíos.
              </p>
            </button>

            <button
              onClick={() => navigate("/admin/recompensas")}
              className="
                bg-[#1a2b24]
                border
                border-[#2d463b]
                rounded-2xl
                p-5
                text-left
                hover:border-[#4adea8]
                transition-all
              "
            >
              <div className="text-2xl mb-2">🎁</div>

              <h3 className="font-semibold">Gestionar Recompensas</h3>

              <p className="text-sm text-gray-400 mt-1">
                Administrar recompensas de desafíos.
              </p>
            </button>

            <button
              onClick={() => navigate("/admin/premios")}
              className="
                bg-[#1a2b24]
                border
                border-[#2d463b]
                rounded-2xl
                p-5
                text-left
                hover:border-[#4adea8]
                transition-all
              "
            >
              <div className="text-2xl mb-2">📦</div>

              <h3 className="font-semibold">Premios Pendientes</h3>

              <p className="text-sm text-gray-400 mt-1">
                Entrega de premios físicos.
              </p>
            </button>

            <button
              onClick={() => navigate("/admin/alumnos")}
              className="
                bg-[#1a2b24]
                border
                border-[#2d463b]
                rounded-2xl
                p-5
                text-left
                hover:border-[#4adea8]
                transition-all
              "
            >
              <div className="text-2xl mb-2">👥</div>

              <h3 className="font-semibold">Gestionar Alumnos</h3>

              <p className="text-sm text-gray-400 mt-1">
                Consulta y gestión de alumnos.
              </p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
