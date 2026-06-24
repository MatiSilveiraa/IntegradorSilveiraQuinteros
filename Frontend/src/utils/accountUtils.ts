import type { Perfil } from "../types";

export const cuentaBloqueada = (
  perfil?: Perfil | null
) => {
  return (
    perfil?.bloqueadoPorInasistencias ||
    perfil?.bloqueadoPorDeuda
  );
};

export const obtenerMotivoBloqueo = (
  perfil?: Perfil | null
) => {
  if (perfil?.bloqueadoPorInasistencias) {
    return "inasistencias";
  }

  if (perfil?.bloqueadoPorDeuda) {
    return "deuda";
  }

  return null;
};