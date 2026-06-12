import axiosInstance from "../api/axios";

export const obtenerDescuentos =
  async () => {

    const response =
      await axiosInstance.get(
        "/api/Descuento"
      );

    return response.data;
  };