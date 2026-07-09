import type { ReactNode } from "react";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import DashboardTopBar from "../navigation/DashboardTopBar";
import AlumnoSidebar from "../navigation/AlumnoSidebar";
import AlumnoBottomNav from "../navigation/AlumnoBottomNav";

import { obtenerMiPerfil } from "../../services/Perfil.service";

type Props = {
  nombre?: string;
  children: ReactNode;
  contentClassName?: string;
  mostrarSidebar?: boolean;
  mostrarBottomNav?: boolean;
};

export default function DashboardLayout({
  nombre,
  children,
  contentClassName = "",
  mostrarSidebar = true,
  mostrarBottomNav = true,
}: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    verificarPerfil();
  }, [location.pathname]);

  const verificarPerfil = async () => {
    try {
      const perfil = await obtenerMiPerfil();

      const incompleto =
        !perfil.fechaNacimiento ||
        !perfil.celular ||
        !perfil.sociedadMedica;

      if (incompleto && location.pathname !== "/completar-perfil") {
        navigate("/completar-perfil");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const clasesContenido = `
    pt-20
    px-4
    lg:px-8
    ${mostrarSidebar ? "lg:ml-56" : ""}
    ${mostrarBottomNav ? "pb-24" : ""}
    ${contentClassName}
  `;

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      <DashboardTopBar nombre={nombre} />

      {mostrarSidebar && <AlumnoSidebar />}

      <div className={clasesContenido.trim()}>{children}</div>

      {mostrarBottomNav && <AlumnoBottomNav />}
    </div>
  );
}