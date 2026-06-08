import axiosInstance from "../api/axios";

export const obtenerMisClases = async () => {

  const response =
    await axiosInstance.get(
      "/api/inscripciones/mis-clases",
      {
        headers: {
          Authorization:
            `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

  return response.data;
};

export const desinscribirseClase = async (
  claseId: number
) => {

  const response =
    await axiosInstance.delete(
      `/api/inscripciones/${claseId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

  return response.data;
};