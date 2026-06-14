import type { Clase } from "../types";

export const obtenerDias = (
  clases: Clase[]
) => {

  const dias =
    [...new Set(
      clases.map(
        (c) => c.diaSemana
      )
    )];

  return dias.join(", ");
};

export const obtenerHora = (
  clases: Clase[]
) => {

  if (!clases?.length) {
    return "Sin horarios";
  }

  return clases[0].horaInicio
    .substring(0, 5);
};