import axiosInstance from "../api/axios";

export interface EntrenadorSelector {
  id: number;
  nombreCompleto: string;
}

export const obtenerDashboardAdmin =
  async () => {

    const response =
      await axiosInstance.get(
        "/api/admin/dashboard"
      );

    return response.data;
  };

export const obtenerEntrenadores =
  async (): Promise<EntrenadorSelector[]> => {

    const response =
      await axiosInstance.get(
        "/api/admin/entrenadores"
      );

    return response.data;
  };