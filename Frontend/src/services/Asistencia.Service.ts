import axiosInstance from "../api/axios";

export const registrarAsistencia = async (
  alumnoId: number,
  claseId: number,
  presente: boolean,
  fechaOcurrencia: string,
) => {
  const response = await axiosInstance.post(
    "/api/Asistencia",
    {
      alumnoId,
      claseId,
      presente,
      fechaOcurrencia,
    },
  );

  return response.data;
};

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
  );

  return response.data;
};