import axiosInstance from "../api/axios";

export const obtenerMiPerfil = async () => {
  const response = await axiosInstance.get(
    "/api/Perfil/mi-perfil",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  );

  return response.data;
};