import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import RedeemOutlinedIcon from "@mui/icons-material/RedeemOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";

import { obtenerMisNotificaciones } from "../../services/Notificacion.Service";
import type { Notificacion } from "../../types";

type Props = {
  nombre?: string;
};

type ItemMenu = {
  texto: string;
  ruta: string;
  icono: React.ReactNode;
  grupo: "principal" | "gestion" | "actividad" | "cuenta";
};

const INTERVALO_NOTIFICACIONES = 30000;

export default function DashboardTopBar({ nombre }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const [cantidadNoLeidas, setCantidadNoLeidas] = useState(0);
  const [menuMobileAbierto, setMenuMobileAbierto] = useState(false);

  const usuario = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("usuario") || "{}");
    } catch {
      return {};
    }
  }, []);

  const esAdmin = usuario.rol === "Admin";
  const esAlumno = usuario.rol === "Alumno";
  const esEntrenador = usuario.rol === "Entrenador";

  const nombreVisible =
    nombre?.trim() ||
    usuario.nombre ||
    usuario.email ||
    "Administrador";

  const inicial = nombreVisible.charAt(0).toUpperCase() || "A";

  const cargarCantidadNoLeidas = useCallback(async () => {
    try {
      const data: Notificacion[] = await obtenerMisNotificaciones();
      setCantidadNoLeidas(data.filter((n) => !n.leida).length);
    } catch (error: any) {
      if (!error?.response || error.response.status >= 500) {
        console.error("[Cargar notificaciones no leídas]", error);
      }

      setCantidadNoLeidas(0);
    }
  }, []);

  useEffect(() => {
    void cargarCantidadNoLeidas();

    const intervalo = window.setInterval(() => {
      void cargarCantidadNoLeidas();
    }, INTERVALO_NOTIFICACIONES);

    return () => window.clearInterval(intervalo);
  }, [cargarCantidadNoLeidas]);

  useEffect(() => {
    setMenuMobileAbierto(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuMobileAbierto) return;

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const cerrarConEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuMobileAbierto(false);
      }
    };

    window.addEventListener("keydown", cerrarConEscape);

    return () => {
      document.body.style.overflow = overflowAnterior;
      window.removeEventListener("keydown", cerrarConEscape);
    };
  }, [menuMobileAbierto]);

  const itemsAdmin: ItemMenu[] = [
    { texto: "Inicio", ruta: "/admin", icono: <HomeOutlinedIcon />, grupo: "principal" },
    { texto: "Alumnos", ruta: "/admin/alumnos", icono: <PeopleOutlineOutlinedIcon />, grupo: "gestion" },
    { texto: "Grupos", ruta: "/admin/grupos", icono: <GroupsOutlinedIcon />, grupo: "gestion" },
    { texto: "Clases", ruta: "/admin/clases", icono: <CalendarMonthOutlinedIcon />, grupo: "gestion" },
    { texto: "Pagos y cuotas", ruta: "/admin/cuotas", icono: <PaymentsOutlinedIcon />, grupo: "gestion" },
    { texto: "Desafíos", ruta: "/admin/desafios", icono: <EmojiEventsOutlinedIcon />, grupo: "actividad" },
    { texto: "Recompensas", ruta: "/admin/recompensas", icono: <RedeemOutlinedIcon />, grupo: "actividad" },
    { texto: "Beneficios pendientes", ruta: "/admin/beneficios-pendientes", icono: <CardGiftcardOutlinedIcon />, grupo: "actividad" },
    { texto: "Premios pendientes", ruta: "/admin/premios", icono: <Inventory2OutlinedIcon />, grupo: "actividad" },
    { texto: "Reactivaciones", ruta: "/admin/reactivaciones", icono: <AutorenewOutlinedIcon />, grupo: "actividad" },
    { texto: "Notificaciones", ruta: "/admin/notificaciones", icono: <NotificationsOutlinedIcon />, grupo: "cuenta" },
    { texto: "Seguridad", ruta: "/admin/seguridad", icono: <SecurityOutlinedIcon />, grupo: "cuenta" },
  ];

  const itemsEntrenador: ItemMenu[] = [
    {
      texto: "Inicio",
      ruta: "/entrenador",
      icono: <HomeOutlinedIcon />,
      grupo: "principal",
    },
    {
      texto: "Mis clases",
      ruta: "/entrenador/mis-clases",
      icono: <CalendarMonthOutlinedIcon />,
      grupo: "gestion",
    },
    {
      texto: "Clases disponibles",
      ruta: "/entrenador/clases-disponibles",
      icono: <PersonAddAltOutlinedIcon />,
      grupo: "gestion",
    },
    {
      texto: "Mis grupos",
      ruta: "/entrenador/grupos",
      icono: <GroupsOutlinedIcon />,
      grupo: "gestion",
    },
    {
      texto: "Notificaciones",
      ruta: "/entrenador/notificaciones",
      icono: <NotificationsOutlinedIcon />,
      grupo: "cuenta",
    },
    {
      texto: "Seguridad",
      ruta: "/entrenador/seguridad",
      icono: <SecurityOutlinedIcon />,
      grupo: "cuenta",
    },
  ];

  const itemsMenu = esAdmin
    ? itemsAdmin
    : esEntrenador
      ? itemsEntrenador
      : [];


  const handleLogout = () => {
    setMenuMobileAbierto(false);
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/", { replace: true });
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

  const navegarDesdeMenu = (ruta: string) => {
    setMenuMobileAbierto(false);
    navigate(ruta);
  };

  const mostrarVolver =
    (esAlumno && location.pathname !== "/alumno") ||
    (esAdmin && location.pathname !== "/admin") ||
    (esEntrenador && location.pathname !== "/entrenador");

  const rutaActiva = (ruta: string) => {
    if (ruta === "/admin") {
      return location.pathname === "/admin";
    }

    if (ruta === "/entrenador") {
      return location.pathname === "/entrenador";
    }

    return location.pathname.startsWith(ruta);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0e1511] border-b border-[#2d463b] flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {(esAdmin || esEntrenador) && (
            <button
              type="button"
              onClick={() => setMenuMobileAbierto(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full text-gray-300 hover:bg-[#1f2d27] hover:text-[#4adea8] transition-all"
              aria-label={esAdmin ? "Abrir menú de administración" : "Abrir menú del entrenador"}
              aria-expanded={menuMobileAbierto}
            >
              <MenuOutlinedIcon />
            </button>
          )}

          {mostrarVolver && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full text-gray-400 hover:bg-[#1f2d27] hover:text-[#4adea8] transition-all"
              aria-label="Volver"
            >
              <ArrowBackOutlinedIcon />
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (esAdmin) navigate("/admin");
              else if (esAlumno) navigate("/alumno/perfil");
              else if (esEntrenador) navigate("/entrenador");
            }}
            className="w-10 h-10 rounded-full border-2 border-[#4adea8] bg-[#1a211d] flex items-center justify-center hover:bg-[#4adea8]/10 transition-all"
            aria-label="Ir al inicio"
          >
            <span className="text-[#4adea8] font-semibold">
              {inicial}
            </span>
          </button>

          {(esAdmin || esEntrenador) && (
            <div className="hidden sm:block">
              <p className="text-xs text-gray-500">
                {esAdmin ? "Administración" : "Entrenador"}
              </p>

              <p className="text-sm text-white font-semibold max-w-44 truncate">
                {nombreVisible}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={irANotificaciones}
            className="relative w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:bg-[#1f2d27] hover:text-[#4adea8] transition-all"
            aria-label="Ver notificaciones"
          >
            <NotificationsOutlinedIcon />

            {cantidadNoLeidas > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {cantidadNoLeidas > 99 ? "99+" : cantidadNoLeidas}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            title="Cerrar sesión"
            className="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
            aria-label="Cerrar sesión"
          >
            <LogoutOutlinedIcon />
          </button>
        </div>
      </header>

      {(esAdmin || esEntrenador) && menuMobileAbierto && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <button
            type="button"
            onClick={() => setMenuMobileAbierto(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-label="Cerrar menú"
          />

          <aside
            className="absolute inset-y-0 left-0 w-[86%] max-w-sm bg-[#0e1511] border-r border-[#2d463b] shadow-2xl flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-label={esAdmin ? "Menú de administración" : "Menú del entrenador"}
          >
            <div className="h-20 px-5 border-b border-[#2d463b] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 shrink-0 rounded-full border-2 border-[#4adea8] bg-[#1a211d] flex items-center justify-center">
                  <span className="text-[#4adea8] font-bold">
                    {inicial}
                  </span>
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-[#4adea8] font-bold uppercase tracking-wide">
                    {esAdmin ? "Administrador" : "Entrenador"}
                  </p>

                  <p className="font-semibold truncate">
                    {nombreVisible}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMenuMobileAbierto(false)}
                className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-gray-400 hover:bg-[#1f2d27] hover:text-white transition-all"
                aria-label="Cerrar menú"
              >
                <CloseOutlinedIcon />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-5">
              {(["principal", "gestion", "actividad", "cuenta"] as const).map(
                (grupo) => (
                  <SeccionMenu
                    key={grupo}
                    titulo={
                      grupo === "principal"
                        ? "Principal"
                        : grupo === "gestion"
                        ? "Gestión"
                        : grupo === "actividad"
                        ? "Actividad"
                        : "Cuenta"
                    }
                    items={itemsMenu.filter((item) => item.grupo === grupo)}
                    rutaActiva={rutaActiva}
                    onNavigate={navegarDesdeMenu}
                  />
                ),
              )}
            </nav>

            <div className="p-4 border-t border-[#2d463b]">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full h-12 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 font-semibold flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all"
              >
                <LogoutOutlinedIcon fontSize="small" />
                Cerrar sesión
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

function SeccionMenu({
  titulo,
  items,
  rutaActiva,
  onNavigate,
}: {
  titulo: string;
  items: ItemMenu[];
  rutaActiva: (ruta: string) => boolean;
  onNavigate: (ruta: string) => void;
}) {
  if (!items.length) return null;

  return (
    <div className="mb-6">
      <p className="px-3 mb-2 text-[11px] text-gray-500 font-bold uppercase tracking-wider">
        {titulo}
      </p>

      <div className="space-y-1">
        {items.map((item) => {
          const activo = rutaActiva(item.ruta);

          return (
            <button
              key={item.ruta}
              type="button"
              onClick={() => onNavigate(item.ruta)}
              className={`w-full h-12 px-3 rounded-xl flex items-center gap-3 text-left transition-all ${
                activo
                  ? "bg-[#4adea8]/10 border border-[#4adea8]/30 text-[#4adea8]"
                  : "border border-transparent text-gray-300 hover:bg-[#1a2b24] hover:text-white"
              }`}
            >
              <span className="w-8 h-8 shrink-0 flex items-center justify-center">
                {item.icono}
              </span>

              <span className="font-semibold">
                {item.texto}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}