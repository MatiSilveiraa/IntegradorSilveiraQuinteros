import axiosInstance from "../api/axios";
import type { Auditoria } from "../types";

export const obtenerAuditorias = async (
  cantidad: number = 50
): Promise<Auditoria[]> => {
  const response = await axiosInstance.get(
    `/api/auditoria?cantidad=${cantidad}`
  );

  return response.data;
};

export const obtenerAuditoriasPorUsuario = async (
  usuarioId: number
): Promise<Auditoria[]> => {
  const response = await axiosInstance.get(
    `/api/auditoria/usuario/${usuarioId}`
  );

  return response.data;
};

export const obtenerAuditoriasPorEntidad = async (
  entidad: string
): Promise<Auditoria[]> => {
  const response = await axiosInstance.get(
    `/api/auditoria/entidad/${entidad}`
  );

  return response.data;
};