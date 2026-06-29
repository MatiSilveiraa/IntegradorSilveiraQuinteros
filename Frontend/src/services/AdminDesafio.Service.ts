import axiosInstance from "../api/axios";

export const obtenerDesafios =
  async () => {

    const response =
      await axiosInstance.get(
        "/api/Desafio"
      );

    return response.data;
  };

import type { Desafio } from "../types";

export const crearDesafio =
  async (data: Desafio) => {

    const response =
      await axiosInstance.post(
        "/api/Desafio",
        data
      );

    return response.data;
  };

export const editarDesafio =
  async (
    id: number,
    data: Desafio
  ) => {

    const response =
      await axiosInstance.put(
        `/api/Desafio/${id}`,
        data
      );

    return response.data;
  };

export const eliminarDesafio =
  async (id: number) => {

    const response =
      await axiosInstance.delete(
        `/api/Desafio/${id}`
      );

    return response.data;
  };

  export const obtenerParticipantesDesafio = async (desafioId: number) => {
  const response = await axiosInstance.get(
    `/api/Desafio/${desafioId}/participantes`
  );

  return response.data;
};

export const asignarGanadoresDesafio = async (
  desafioId: number,
  alumnoIds: number[]
) => {
  const response = await axiosInstance.post("/api/Desafio/ganadores", {
    desafioId,
    alumnosIds: alumnoIds,
  });

  return response.data;
};