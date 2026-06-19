import toast from "react-hot-toast";

import {
  usuarioBloqueado,
} from "./AuthUtils";
export const validarCuentaActiva =
  (): boolean => {

    if (
      usuarioBloqueado()
    ) {

      toast.error(
        "Tu cuenta está bloqueada. Solicita una reactivación."
      );

      return false;

    }

    return true;

  };