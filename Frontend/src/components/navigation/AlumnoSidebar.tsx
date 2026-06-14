import { Link, useLocation } from "react-router-dom";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";

export default function AlumnoSidebar() {
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
      label: "Asistencias",
      path: "/alumno/asistencias",
      icon: <QrCodeScannerOutlinedIcon />,
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
      label: "Desafios",
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

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-[#0e1511] border-r border-[#2d463b] flex-col">
      <div className="h-20 flex items-center px-6 border-b border-[#2d463b]">
        <h2 className="text-[#4adea8] text-xl font-bold">Joki Training</h2>
      </div>

      <nav className="flex flex-col gap-2 p-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3
                px-4 py-3
                rounded-xl
                transition-all duration-200

                ${
                  isActive
                    ? "bg-[#4adea8]/10 text-[#4adea8]"
                    : "text-gray-500 hover:text-[#4adea8] hover:bg-[#1f2d27]"
                }
              `}
            >
              {item.icon}

              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
