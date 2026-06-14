export const diasSemana = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

export default function obtenerDiaActual() {
  const hoy = new Date();

  return diasSemana[hoy.getDay() === 0 ? 6 : hoy.getDay() - 1];
}