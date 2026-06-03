import axiosInstance from "../api/axios";

export const obtenerMiHistorial = async () => {

  const response = await axiosInstance.get(
    "/api/Historial/mi-historial",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  );

  return response.data;
};