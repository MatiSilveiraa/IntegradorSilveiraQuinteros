import type { ReactNode } from "react";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import AlumnoTopBar from "../navigation/DashboardTopBar";
import AlumnoSidebar from "../navigation/AlumnoSidebar";
import AlumnoBottomNav from "../navigation/AlumnoBottomNav";

import { obtenerMiPerfil } from "../../services/Perfil.service";

type Props = {
  nombre?: string;
  children: ReactNode;
  contentClassName?: string;
  mostrarNavegacion?: boolean;
};

export default function AlumnoLayout({
  nombre,
  children,
  contentClassName = "",
  mostrarNavegacion = true,
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

      if (
        incompleto &&
        location.pathname !== "/completar-perfil"
      ) {
        navigate("/completar-perfil");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const clasesContenido = mostrarNavegacion
    ? `pt-20 pb-24 px-4 lg:px-6 lg:ml-64 ${contentClassName}`
    : contentClassName;

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      {mostrarNavegacion && <AlumnoTopBar nombre={nombre} />}

      {mostrarNavegacion && <AlumnoSidebar />}

      <div className={clasesContenido.trim()}>
        {children}
      </div>

      {mostrarNavegacion && <AlumnoBottomNav />}
    </div>
  );
}