import axiosInstance from "../api/axios";

export const obtenerMisBeneficios =
  async () => {

    const response =
      await axiosInstance.get(
        "/api/Beneficio/mis-beneficios",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

    return response.data;
  };