import axiosInstance from "../api/axios";

import type {
  CambiarEstadoClaseRequest,
  Clase,
  CrearClaseRequest,
  InscriptoClase,
} from "../types";

export const inscribirseClase = async (claseId: number) => {
  const response = await axiosInstance.post(
    `/api/inscripciones/${claseId}`,
    {},
  );

  return response.data;
};

export const obtenerClases = async (): Promise<Clase[]> => {
  const response = await axiosInstance.get("/api/Clase");
  return response.data;
};

export const obtenerClasePorId = async (
  id: number,
): Promise<Clase> => {
  const response = await axiosInstance.get(`/api/Clase/${id}`);
  return response.data;
};

export const crearClase = async (
  data: CrearClaseRequest,
) => {
  const response = await axiosInstance.post("/api/Clase", data);
  return response.data;
};

export const editarClase = async (
  id: number,
  data: CrearClaseRequest,
) => {
  const response = await axiosInstance.put(`/api/Clase/${id}`, data);
  return response.data;
};

export const obtenerInscriptosClase = async (
  claseId: number,
): Promise<InscriptoClase[]> => {
  const response = await axiosInstance.get(
    `/api/Clase/${claseId}/inscriptos`,
  );

  return response.data;
};

export const cambiarEstadoClase = async (
  id: number,
  data: CambiarEstadoClaseRequest,
) => {
  const response = await axiosInstance.put(
    `/api/Clase/${id}/estado`,
    data,
  );

  return response.data;
};

export const eliminarClase = async (id: number) => {
  const response = await axiosInstance.delete(`/api/Clase/${id}`);
  return response.data;
};
