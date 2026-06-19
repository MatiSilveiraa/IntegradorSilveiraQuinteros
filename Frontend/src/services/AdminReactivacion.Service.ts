import axiosInstance from "../api/axios";

export const obtenerSolicitudesPendientes =
  async () => {

    const response =
      await axiosInstance.get(
        "/api/Reactivacion/pendientes"
      );

    return response.data;

  };

export const resolverSolicitud =
  async (
    id: number,
    aprobar: boolean,
    respuestaAdmin: string
  ) => {

    const response =
      await axiosInstance.put(
        `api/Reactivacion/${id}/resolver`,
        {
          aprobar,
          respuestaAdmin,
        }
      );

    return response.data;

  };