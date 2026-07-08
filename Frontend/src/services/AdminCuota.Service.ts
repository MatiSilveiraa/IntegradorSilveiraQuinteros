import axiosInstance from "../api/axios";
import type { CuotaAdmin, ResumenCuotasAdmin } from "../types";

export const obtenerCuotasAdmin = async (params?: {
  estado?: string;
  alumnoId?: number;
  mes?: number;
  anio?: number;
  buscar?: string;
}): Promise<CuotaAdmin[]> => {
  const response = await axiosInstance.get("/api/Cuota/admin", {
    params,
  });

  return response.data;
};

export const obtenerResumenCuotasAdmin = async (params?: {
  mes?: number;
  anio?: number;
}): Promise<ResumenCuotasAdmin> => {
  const response = await axiosInstance.get("/api/Cuota/admin/resumen", {
    params,
  });

  return response.data;
};

export const obtenerDetalleCuotaAdmin = async (cuotaId: number) => {
  const response = await axiosInstance.get(`/api/Cuota/admin/${cuotaId}`);

  return response.data;
};