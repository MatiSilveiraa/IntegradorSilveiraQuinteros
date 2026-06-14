import axiosInstance from "../api/axios";

export const obtenerMiPerfil = async () => {
  const response = await axiosInstance.get(
    "/api/Perfil/mi-perfil",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  );

  return response.data;
};

import type { Perfil } from "../types";

export const actualizarMiPerfil = async (
  perfil: Perfil
) => {

  const response =
    await axiosInstance.put(
      "/api/Perfil/mi-perfil",
      perfil,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

  return response.data;
};