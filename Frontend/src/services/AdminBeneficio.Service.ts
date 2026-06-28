import axiosInstance from "../api/axios";

export const obtenerPremiosPendientes =
  async () => {

    const response =
      await axiosInstance.get(
        "/api/Beneficio/fisicos-pendientes"
      );

    return response.data;
  };

export const marcarPremioEntregado =
  async (
    beneficioId: number
  ) => {

    const response =
      await axiosInstance.put(
        `/api/Beneficio/${beneficioId}/entregar`
      );

    return response.data;
  };

export const obtenerBeneficiosPendientes =
  async () => {

    const response =
      await axiosInstance.get(
        "/api/Beneficio/pendientes"
      );

    return response.data;
  };