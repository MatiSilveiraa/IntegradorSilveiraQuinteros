import toast from "react-hot-toast";
import { cuentaBloqueada } from "./accountUtils";
import type { Perfil } from "../types";

export const validarCuentaActiva = (
  perfil?: Perfil | null
): boolean => {

  if (cuentaBloqueada(perfil)) {

    toast.error(
      perfil?.bloqueadoPorDeuda
        ? "Tu cuenta está bloqueada por impago"
        : "Tu cuenta está bloqueada por inasistencias"
    );

    return false;
  }

  return true;
};