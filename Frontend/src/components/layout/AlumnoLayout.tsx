import type { ReactNode } from "react";

import AlumnoTopBar from "../navigation/DashboardTopBar";
import AlumnoSidebar from "../navigation/AlumnoSidebar";
import AlumnoBottomNav from "../navigation/AlumnoBottomNav";

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
  const clasesContenido = mostrarNavegacion
    ? `pt-20 pb-24 px-4 lg:px-6 lg:ml-64 ${contentClassName}`
    : contentClassName;

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      {mostrarNavegacion && <AlumnoTopBar nombre={nombre} />}

      {mostrarNavegacion && <AlumnoSidebar />}

      <div className={clasesContenido.trim()}>{children}</div>

      {mostrarNavegacion && <AlumnoBottomNav />}
    </div>
  );
}