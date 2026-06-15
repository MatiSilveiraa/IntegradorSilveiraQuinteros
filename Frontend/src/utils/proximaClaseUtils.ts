const ordenDias = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export function obtenerProximaClase(clases: any[]) {
  const hoy = new Date().getDay();

  return [...clases]
    .sort((a, b) => {
      const diaA = ordenDias.indexOf(a.diaSemana);
      const diaB = ordenDias.indexOf(b.diaSemana);

      const distanciaA =
        diaA >= hoy
          ? diaA - hoy
          : 7 - hoy + diaA;

      const distanciaB =
        diaB >= hoy
          ? diaB - hoy
          : 7 - hoy + diaB;

      return distanciaA - distanciaB;
    })[0];
}