import axiosInstance from "../api/axios";

export const obtenerDesafios = async () => {
  const response =
    await axiosInstance.get(
      "/api/Desafio"
    );

  return response.data;
};

export const obtenerMisDesafios =
  async () => {

    const response =
      await axiosInstance.get(
        "/api/Desafio/mis-desafios"
      );

    return response.data;
  };

export const participarDesafio =
  async (
    desafioId: number
  ) => {

    const response =
      await axiosInstance.post(
        `/api/Desafio/${desafioId}/participar`
      );

    return response.data;
  };