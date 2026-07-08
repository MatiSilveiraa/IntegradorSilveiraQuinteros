import axiosInstance from "../api/axios";
import type { PagoManualRequest } from "../types";

export const generarPagoMercadoPago = async (cuotaId: number) => {
  const response = await axiosInstance.post(
    `/api/Pago/mercado-pago/${cuotaId}`
  );

  return response.data;
};

export const registrarPagoManual = async (data: PagoManualRequest) => {
  const response = await axiosInstance.post("/api/Pago", data);

  return response.data;
};