import axiosInstance from "../api/axios";

export const obtenerGrupos = async () => {

  const response =
    await axiosInstance.get(
      "/api/Grupo",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

  return response.data;
};