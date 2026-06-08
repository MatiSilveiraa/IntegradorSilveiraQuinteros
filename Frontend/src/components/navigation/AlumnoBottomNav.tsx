import { Link, useLocation } from "react-router-dom";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

export default function AlumnoBottomNav() {
  const location = useLocation();

  const menuItems = [
    {
      label: "Inicio",
      path: "/alumno",
      icon: <HomeOutlinedIcon />,
    },
   {
  label: "Grupos",
  path: "/alumno/grupos",
  icon: <GroupOutlinedIcon />,
},
    {
      label: "Asistencia",
      path: "/alumno/asistencias",
      icon: <QrCodeScannerOutlinedIcon />,
    },
    {
      label: "Pagos",
      path: "/alumno/pagos",
      icon: <PaymentsOutlinedIcon />,
    },
    {
      label: "Perfil",
      path: "/alumno/perfil",
      icon: <PersonOutlinedIcon />,
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0e1511] border-t border-[#2d463b] h-20 flex justify-around items-center">

      {menuItems.map((item) => {
        const isActive =
          location.pathname === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`
              flex flex-col items-center
              text-xs
              transition-all

              ${
                isActive
                  ? "text-[#4adea8]"
                  : "text-gray-500"
              }
            `}
          >
            {item.icon}

            <span className="mt-1">
              {item.label}
            </span>
          </Link>
        );
      })}

    </nav>
  );
}