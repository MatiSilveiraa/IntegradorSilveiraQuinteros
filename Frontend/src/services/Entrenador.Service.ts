// Entrenador.Service.ts

import axiosInstance from "../api/axios";

export const obtenerDashboardEntrenador =
  async () => {
    const response = await axiosInstance.get(
      "/api/Entrenador/Dashboard"
    );

    return response.data;
  };

export const obtenerMisGrupos = async () => {

    const response =
        await axiosInstance.get(
            "/api/Entrenador/grupos"
        );

    return response.data;

};

export const obtenerDetalleGrupo = async (
  id: number
) => {

  const response =
    await axiosInstance.get(
      `/api/Entrenador/grupos/${id}`
    );

  return response.data;

};