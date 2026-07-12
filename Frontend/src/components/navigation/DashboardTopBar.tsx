import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import { useNavigate, useLocation } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";

import { obtenerMisNotificaciones } from "../../services/Notificacion.Service";
import type { Notificacion } from "../../types";

type Props = {
  nombre?: string;
};

const INTERVALO_NOTIFICACIONES = 30000;

export default function DashboardTopBar({ nombre }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const [cantidadNoLeidas, setCantidadNoLeidas] = useState(0);

  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  const esAdmin = usuario.rol === "Admin";
  const esAlumno = usuario.rol === "Alumno";
  const esEntrenador = usuario.rol === "Entrenador";

  const cargarCantidadNoLeidas = useCallback(
  async () => {
    try {
      const data: Notificacion[] =
        await obtenerMisNotificaciones();

      const pendientes = data.filter(
        (notificacion) =>
          !notificacion.leida,
      ).length;

      setCantidadNoLeidas(pendientes);
    } catch (error: any) {
      if (
        !error?.response ||
        error.response.status >= 500
      ) {
        console.error(
          "[Cargar notificaciones no leídas]",
          error,
        );
      }

      setCantidadNoLeidas(0);
    }
  },
  [],
);

  useEffect(() => {
    cargarCantidadNoLeidas();

    const intervalo = window.setInterval(() => {
      cargarCantidadNoLeidas();
    }, INTERVALO_NOTIFICACIONES);

    return () => {
      window.clearInterval(intervalo);
    };
  }, [cargarCantidadNoLeidas]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const irANotificaciones = () => {
    if (esAdmin) {
      navigate("/admin/notificaciones");
      return;
    }

    if (esEntrenador) {
      navigate("/entrenador/notificaciones");
      return;
    }

    navigate("/alumno/notificaciones");
  };

  const mostrarVolver =
    (esAlumno && location.pathname !== "/alumno") ||
    (esAdmin && location.pathname !== "/admin") ||
    (esEntrenador && location.pathname !== "/entrenador");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0e1511] border-b border-[#2d463b] flex items-center justify-between px-4">
      <div className="flex items-center gap-3">
        {mostrarVolver && (
          <button
            onClick={() => navigate(-1)}
            className="
              w-10
              h-10
              flex
              items-center
              justify-center
              rounded-full
              text-gray-400
              hover:bg-[#1f2d27]
              hover:text-[#4adea8]
              transition-all
            "
          >
            <ArrowBackOutlinedIcon />
          </button>
        )}

        <div className="w-10 h-10 rounded-full border-2 border-[#4adea8] bg-[#1a211d] flex items-center justify-center">
          <span className="text-[#4adea8] font-semibold">
            {nombre?.charAt(0).toUpperCase() || "A"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={irANotificaciones}
          className="
            relative
            w-10
            h-10
            flex
            items-center
            justify-center
            rounded-full
            text-gray-400
            hover:bg-[#1f2d27]
            hover:text-[#4adea8]
            transition-all
          "
        >
          <NotificationsOutlinedIcon />

          {cantidadNoLeidas > 0 && (
            <span
              className="
                absolute
                -top-1
                -right-1
                min-w-[18px]
                h-[18px]
                px-1
                rounded-full
                bg-red-500
                text-white
                text-[10px]
                font-bold
                flex
                items-center
                justify-center
              "
            >
              {cantidadNoLeidas}
            </span>
          )}
        </button>

        <button
          onClick={handleLogout}
          title="Cerrar sesión"
          className="
            w-10
            h-10
            flex
            items-center
            justify-center
            rounded-full
            text-gray-400
            hover:bg-red-500/10
            hover:text-red-400
            transition-all
          "
        >
          <LogoutOutlinedIcon />
        </button>
      </div>
    </header>
  );
}