import axiosInstance from "../api/axios";

import type { Grupo } from "../types";

export const obtenerGrupos = async () => {
  const response = await axiosInstance.get("/api/Grupo");
  return response.data;
};

export const obtenerGrupoPorId = async (id: number) => {
  const response = await axiosInstance.get(`/api/Grupo/${id}`);
  return response.data;
};

export const crearGrupo = async (data: Partial<Grupo>) => {
  const response = await axiosInstance.post("/api/Grupo", data);
  return response.data;
};

export const editarGrupo = async (
  id: number,
  data: Partial<Grupo>
) => {
  const response = await axiosInstance.put(`/api/Grupo/${id}`, data);
  return response.data;
};

export const eliminarGrupo = async (id: number) => {
  const response = await axiosInstance.delete(`/api/Grupo/${id}`);
  return response.data;
};