import axiosInstance from "../api/axios";

import type {
  Descuento,
  CrearDescuentoRequest,
} from "../types";

export const obtenerDescuentos = async () => {
  const response = await axiosInstance.get("/api/Descuento");
  return response.data;
};

export const crearDescuento = async (
  data: CrearDescuentoRequest
) => {
  const response = await axiosInstance.post(
    "/api/Descuento",
    data
  );

  return response.data;
};

export const editarDescuento = async (
  id: number,
  data: Partial<Descuento>
) => {
  const response = await axiosInstance.put(
    `/api/Descuento/${id}`,
    data
  );

  return response.data;
};