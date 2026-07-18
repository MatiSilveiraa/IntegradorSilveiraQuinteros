import axiosInstance from "../api/axios";

export interface ConfiguracionCuota {
  montoMensual: number;
}

export async function obtenerConfiguracionCuota() {
  const response =
    await axiosInstance.get<ConfiguracionCuota>(
      "/api/ConfiguracionCuota",
    );

  return response.data;
}

export async function actualizarConfiguracionCuota(
  montoMensual: number,
) {
  const response =
    await axiosInstance.put(
      "/api/ConfiguracionCuota",
      {
        montoMensual,
      },
    );

  return response.data;
}