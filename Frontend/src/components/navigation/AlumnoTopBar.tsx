import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import { useNavigate } from "react-router-dom";

type Props = {
  nombre?: string;
};

export default function AlumnoTopBar({
  nombre,
}: Props) {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("usuario");

    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0e1511] border-b border-[#2d463b] flex items-center justify-between px-4">

      {/* Avatar */}

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-full border-2 border-[#4adea8] bg-[#1a211d] flex items-center justify-center">

          <span className="text-[#4adea8] font-semibold">
            {nombre?.charAt(0).toUpperCase() || "A"}
          </span>

        </div>

      </div>

      {/* Acciones */}

      <div className="flex items-center gap-2">

        <button
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
          <NotificationsOutlinedIcon />
        </button>

        <button
          onClick={handleLogout}
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
          title="Cerrar sesión"
        >
          <LogoutOutlinedIcon />
        </button>

      </div>

    </header>
  );
}