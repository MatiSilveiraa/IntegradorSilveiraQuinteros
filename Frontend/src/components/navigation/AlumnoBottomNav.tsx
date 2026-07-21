import { Link, useLocation } from "react-router-dom";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

const menuItems = [
  {
    label: "Inicio",
    path: "/alumno",
    icon: <HomeOutlinedIcon />,
  },
  {
    label: "Mi semana",
    path: "/alumno/mis-entrenamientos",
    icon: <CalendarMonthOutlinedIcon />,
  },
  {
    label: "Explorar",
    path: "/alumno/explorar",
    icon: <FitnessCenterOutlinedIcon />,
  },
  {
    label: "Asistencia",
    path: "/alumno/asistencias",
    icon: <MapOutlinedIcon />,
  },
  {
    label: "Perfil",
    path: "/alumno/perfil",
    icon: <PersonOutlinedIcon />,
  },
];

export default function AlumnoBottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-20 items-center justify-around border-t border-[#2d463b] bg-[#0e1511] lg:hidden">
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
              flex
              min-w-0
              flex-1
              flex-col
              items-center
              px-1
              text-center
              text-[10px]
              transition-all
              sm:text-xs
              ${isActive ? "text-[#4adea8]" : "text-gray-500"}
            `}
          >
            {item.icon}

            <span className="mt-1 max-w-full truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}