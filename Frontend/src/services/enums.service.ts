import axiosInstance from "../api/axios";   

export const obtenerGeneros = async () => {
  const response = await axiosInstance.get(
    "/api/enums/generos"
  );

  return response.data;
};