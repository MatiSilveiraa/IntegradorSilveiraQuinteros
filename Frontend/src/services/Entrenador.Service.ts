import axiosInstance from "../api/axios";

import type {
  ClaseAsignadaEntrenador,
  ClaseDisponibleEntrenador,
  MensajeApiResponse,
} from "../types/entrenadorClases";

export const obtenerDashboardEntrenador = async () => {
  const response = await axiosInstance.get(
    "/api/Entrenador/Dashboard",
  );

  return response.data;
};

export const obtenerMisGrupos = async () => {
  const response = await axiosInstance.get(
    "/api/Entrenador/grupos",
  );

  return response.data;
};

export const obtenerDetalleGrupo = async (
  id: number,
) => {
  const response = await axiosInstance.get(
    `/api/Entrenador/grupos/${id}`,
  );

  return response.data;
};

export const obtenerDetalleClase = async (
  id: number,
 fecha?: string,
) => {
  const response = await axiosInstance.get(
    `/api/Entrenador/clases/${id}`,
    {
      params: fecha
        ? {
            fecha,
          }
        : undefined,
    },
  );

  return response.data;
};
export const obtenerMisClasesEntrenador =
  async (): Promise<ClaseAsignadaEntrenador[]> => {
    const response = await axiosInstance.get(
      "/api/Entrenador/mis-clases",
    );

    return response.data;
  };

export const obtenerClasesDisponiblesEntrenador =
  async (): Promise<ClaseDisponibleEntrenador[]> => {
    const response = await axiosInstance.get(
      "/api/Entrenador/clases-disponibles",
    );

    return response.data;
  };

export const unirmeAClase = async (
  claseId: number,
  forzar = false,
): Promise<MensajeApiResponse | unknown> => {
  const response = await axiosInstance.post(
    `/api/Entrenador/clases/${claseId}/unirme`,
    null,
    {
      params: forzar
        ? {
            forzar: true,
          }
        : undefined,
    },
  );

  return response.data;
};

export const salirDeClase = async (
  claseId: number,
): Promise<MensajeApiResponse> => {
  const response = await axiosInstance.delete(
    `/api/Entrenador/clases/${claseId}/salir`,
  );

  return response.data;
};
