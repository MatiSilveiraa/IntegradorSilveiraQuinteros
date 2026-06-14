import axiosInstance from "../api/axios";

export const registrarAsistenciaGeolocalizacion = async (
  claseId: number,
  latitud: number,
  longitud: number,
) => {
  const response = await axiosInstance.post(
    "/api/asistencia/geolocalizacion",
    {
      claseId,
      latitud,
      longitud,
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  );

  return response.data;
};