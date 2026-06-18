import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  rolPermitido?: string;
};

export default function ProtectedRoute({
  children,
  rolPermitido,
}: Props) {
  const token = localStorage.getItem("token");

  const usuario = JSON.parse(
    localStorage.getItem("usuario") || "{}"
  );

  if (!token) {
    return <Navigate to="/" />;
  }

  if (
    rolPermitido &&
    usuario.rol !== rolPermitido
  ) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}