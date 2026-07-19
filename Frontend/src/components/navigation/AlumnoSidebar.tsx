import { Link, useLocation } from "react-router-dom";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";

const menuItems = [
  { label: "Inicio", path: "/alumno", icon: <HomeOutlinedIcon /> },
  { label: "Grupos", path: "/alumno/grupos", icon: <GroupOutlinedIcon /> },
  {
    label: "Asistencias",
    path: "/alumno/asistencias",
    icon: <MapOutlinedIcon />,
  },
  { label: "Pagos", path: "/alumno/pagos", icon: <PaymentsOutlinedIcon /> },
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
  { label: "Perfil", path: "/alumno/perfil", icon: <PersonOutlinedIcon /> },
];

export default function AlumnoSidebar() {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-56 bg-[#0e1511] border-r border-[#2d463b] flex-col z-40">
      <div className="h-16 flex items-center px-4 border-b border-[#2d463b]">
        <div>
          <h2 className="text-white text-lg font-bold leading-tight">Joki</h2>
          <p className="text-xs text-gray-500">Panel del alumno</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1 p-3 mt-2">
        {menuItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/alumno" &&
              location.pathname.startsWith(item.path));

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                group
                flex items-center gap-3
                px-4 py-3
                rounded-2xl
                transition-all duration-200
                text-sm font-semibold

                ${
                  isActive
                    ? "bg-[#4adea8] text-[#12201b] shadow-lg shadow-[#4adea8]/10"
                    : "text-gray-400 hover:text-white hover:bg-[#1a2b24]"
                }
              `}
            >
              <span
                className={`
                  flex items-center justify-center w-6
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

      <div className="mt-auto p-4 border-t border-[#2d463b]">
        <div className="rounded-2xl bg-[#12201b] border border-[#2d463b] p-4">
          <p className="text-xs text-gray-500">Joki Training Team</p>
          <p className="text-sm text-gray-300 mt-1">
            Tu progreso en un solo lugar.
          </p>
        </div>
      </div>
    </aside>
  );
}