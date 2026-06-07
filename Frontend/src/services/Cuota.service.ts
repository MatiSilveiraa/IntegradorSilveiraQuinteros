import axiosInstance from "../api/axios";

export const obtenerMiCuota = async () => {
  const response = await axiosInstance.get(
    "/api/Cuota/mi-cuota",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  return response.data;
};

export const obtenerMisCuotas = async () => {
  const response = await axiosInstance.get(
    "/api/Cuota/mis-cuotas",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  return response.data;
};