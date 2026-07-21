import { Link, useLocation } from "react-router-dom";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";

const menuItems = [
  {
    label: "Inicio",
    path: "/alumno",
    icon: <HomeOutlinedIcon />,
  },
  {
    label: "Mis entrenamientos",
    path: "/alumno/mis-entrenamientos",
    icon: <CalendarMonthOutlinedIcon />,
  },
  {
    label: "Explorar clases",
    path: "/alumno/explorar",
    icon: <FitnessCenterOutlinedIcon />,
  },
  {
    label: "Asistencias",
    path: "/alumno/asistencias",
    icon: <MapOutlinedIcon />,
  },
  {
    label: "Pagos",
    path: "/alumno/pagos",
    icon: <PaymentsOutlinedIcon />,
  },
  {
    label: "Beneficios",
    path: "/alumno/beneficios",
    icon: <CardGiftcardOutlinedIcon />,
  },
  {
    label: "Desafíos",
    path: "/alumno/desafios",
    icon: <EmojiEventsOutlinedIcon />,
  },
  {
    label: "Seguridad",
    path: "/alumno/seguridad",
    icon: <SecurityOutlinedIcon />,
  },
  {
    label: "Perfil",
    path: "/alumno/perfil",
    icon: <PersonOutlinedIcon />,
  },
];

export default function AlumnoSidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-56 flex-col border-r border-[#2d463b] bg-[#0e1511] lg:flex">
      <div className="flex h-16 items-center border-b border-[#2d463b] px-4">
        <div>
          <h2 className="text-lg font-bold leading-tight text-white">
            Joki
          </h2>

          <p className="text-xs text-gray-500">Panel del alumno</p>
        </div>
      </div>

      <nav className="mt-2 flex flex-col gap-1 overflow-y-auto p-3">
        {menuItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/alumno" &&
              location.pathname.startsWith(`${item.path}/`));

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                group
                flex
                items-center
                gap-3
                rounded-2xl
                px-4
                py-3
                text-sm
                font-semibold
                transition-all
                duration-200
                ${
                  isActive
                    ? "bg-[#4adea8] text-[#12201b] shadow-lg shadow-[#4adea8]/10"
                    : "text-gray-400 hover:bg-[#1a2b24] hover:text-white"
                }
              `}
            >
              <span
                className={`
                  flex
                  w-6
                  items-center
                  justify-center
                  ${
                    isActive
                      ? "text-[#12201b]"
                      : "text-gray-500 group-hover:text-[#4adea8]"
                  }
                `}
              >
                {item.icon}
              </span>

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-[#2d463b] p-4">
        <div className="rounded-2xl border border-[#2d463b] bg-[#12201b] p-4">
          <p className="text-xs text-gray-500">Joki Training Team</p>

          <p className="mt-1 text-sm text-gray-300">
            Tu progreso en un solo lugar.
          </p>
        </div>
      </div>
    </aside>
  );
}