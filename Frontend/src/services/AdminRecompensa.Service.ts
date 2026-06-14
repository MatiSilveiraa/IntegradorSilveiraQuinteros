import axiosInstance from "../api/axios";

export const obtenerRecompensasPorDesafio =
  async (
    desafioId: number
  ) => {

    const response =
      await axiosInstance.get(
        `/api/Recompensa/desafio/${desafioId}`
      );

    return response.data;
  };

import type { Recompensa } from "../types";

export const crearRecompensa =
  async (data: Recompensa) => {

    const response =
      await axiosInstance.post(
        "/api/Recompensa",
        data
      );

    return response.data;
  };

export const editarRecompensa =
  async (
    id: number,
    data: Recompensa
  ) => {

    const response =
      await axiosInstance.put(
        `/api/Recompensa/${id}`,
        data
      );

    return response.data;
  };

export const eliminarRecompensa =
  async (
    id: number
  ) => {

    const response =
      await axiosInstance.delete(
        `/api/Recompensa/${id}`
      );

    return response.data;
  };