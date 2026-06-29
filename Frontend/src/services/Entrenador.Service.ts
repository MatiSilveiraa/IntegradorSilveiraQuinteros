// Entrenador.Service.ts

import axiosInstance from "../api/axios";

export const obtenerDashboardEntrenador =
  async () => {
    const response = await axiosInstance.get(
      "/api/Entrenador/Dashboard"
    );

    return response.data;
  };