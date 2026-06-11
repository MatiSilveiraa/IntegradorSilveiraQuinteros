import axiosInstance from "../api/axios";   

export const obtenerMisNotificaciones =
  async () => {

    const response =
      await axiosInstance.get(
        "/api/Notificacion/mis-notificaciones"
      );

    return response.data;
  };

export const marcarComoLeida =
  async (
    id: number
  ) => {

    await axiosInstance.put(
      `/api/Notificacion/${id}/leer`
    );

  };