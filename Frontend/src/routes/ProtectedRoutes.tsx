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
  const usuarioGuardado = localStorage.getItem("usuario");

  // No hay token: no existe una sesión
  if (!token) {
    console.warn("[ProtectedRoute] No hay token");

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  // Intentamos obtener el usuario sin romper la aplicación
  let usuario: {
    rol?: string;
  } = {};

  if (usuarioGuardado) {
    try {
      usuario = JSON.parse(usuarioGuardado);
    } catch (error) {
      console.error(
        "[ProtectedRoute] El usuario guardado no es JSON válido:",
        error,
      );
    }
  }

  // Comprobamos el rol solamente si la ruta exige uno
  if (rolPermitido) {
    const rolUsuario =
      usuario.rol
        ?.trim()
        .toLowerCase();

    const rolRequerido =
      rolPermitido
        .trim()
        .toLowerCase();

    if (!rolUsuario) {
      console.warn(
        "[ProtectedRoute] El usuario no tiene un rol guardado:",
        usuario,
      );

      return (
        <Navigate
          to="/"
          replace
        />
      );
    }

    if (rolUsuario !== rolRequerido) {
      console.warn(
        "[ProtectedRoute] Rol incorrecto:",
        {
          rolUsuario,
          rolRequerido,
          usuario,
        },
      );

      return (
        <Navigate
          to="/"
          replace
        />
      );
    }
  }

  return <>{children}</>;
}