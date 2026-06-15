export const formatearFecha = (fecha: string) => {
  return new Date(fecha).toLocaleDateString(
    "es-UY",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  );
};

export const formatearHora = (hora: string) => {
  return hora.substring(0, 5);
};

export const formatearFechaHora = (fecha: string) => {
  return new Date(fecha).toLocaleString(
    "es-UY",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
};