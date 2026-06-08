import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import QrCodeScannerOutlinedIcon from "@mui/icons-material/QrCodeScannerOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";

import { Link } from "react-router-dom";

export default function GruposFooter() {

  return (
    <nav
      className="
        fixed
        bottom-0
        left-0
        right-0
        bg-[#12201b]
        border-t
        border-[#2d463b]
        h-20
        flex
        items-center
        justify-around
        z-50
      "
    >

      <Link
        to="/alumno"
        className="flex flex-col items-center text-gray-400"
      >
        <HomeOutlinedIcon />
        <span className="text-xs">
          Inicio
        </span>
      </Link>

      <Link
        to="/alumno/grupos"
        className="flex flex-col items-center text-[#4adea8]"
      >
        <GroupOutlinedIcon />
        <span className="text-xs">
          Grupos
        </span>
      </Link>

      <button className="flex flex-col items-center text-gray-400">
        <QrCodeScannerOutlinedIcon />
        <span className="text-xs">
          Asistencia
        </span>
      </button>

      <Link
        to="/alumno/pagos"
        className="flex flex-col items-center text-gray-400"
      >
        <PaymentsOutlinedIcon />
        <span className="text-xs">
          Pagos
        </span>
      </Link>

      <button className="flex flex-col items-center text-gray-400">
        <MoreHorizOutlinedIcon />
        <span className="text-xs">
          Más
        </span>
      </button>

    </nav>
  );
}