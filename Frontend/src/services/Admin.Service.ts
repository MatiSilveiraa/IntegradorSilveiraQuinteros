import axiosInstance from "../api/axios";

export const obtenerDashboardAdmin =
  async () => {

    const response =
      await axiosInstance.get(
        "/api/admin/dashboard"
      );

    return response.data;
  };