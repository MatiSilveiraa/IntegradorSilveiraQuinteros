import axiosInstance from "../api/axios";

import type { Perfil } from "../types";

export const register = async (usuario: Perfil) => {
  const response = await axiosInstance.post(
    "/api/alumno/registrar",
    usuario
  );

  return response.data;
};

export const login = async (
  email: string,
  password: string
) => {
  const response = await axiosInstance.post(
    "/api/auth/login",
    {
      email: email.trim().toLowerCase(),
      password,
    }
  );
  

  return response.data;
};

export const solicitarRecuperacion = async (
  email: string
) => {
  const response = await axiosInstance.post(
    "/api/Auth/solicitar-recuperacion",
    {
      email: email.trim().toLowerCase(),
    }
  );
  return response.data;
};

export const restablecerContrasena = async (
  email: string,
  codigo: string,
  nuevaContrasena: string
) => {

  const response =
    await axiosInstance.post(
      "/api/Auth/restablecer-contrasena",
      {
        email: email.trim().toLowerCase(),
        codigo,
        nuevaContrasena,
      }
    );

  return response.data;
};
