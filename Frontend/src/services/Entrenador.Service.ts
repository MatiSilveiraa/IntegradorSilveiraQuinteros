// Entrenador.Service.ts

import axiosInstance from "../api/axios";

export const obtenerEntrenadores =
  async () => {
    const response = await axiosInstance.get(
      "/api/Entrenador"
    );

    return response.data;
  };