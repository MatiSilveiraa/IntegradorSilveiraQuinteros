export const obtenerDias = (
  clases: any[]
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
  clases: any[]
) => {

  if (!clases?.length) {
    return "Sin horarios";
  }

  return clases[0].horaInicio
    .substring(0, 5);
};