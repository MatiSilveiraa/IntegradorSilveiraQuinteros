import axiosInstance from "../api/axios";

export const solicitarLoginSinPassword = async (
  email: string,
) => {
  const response = await axiosInstance.post(
    "api/auth/login-sin-password/solicitar",
    {
      email,
    },
  );

  return response.data;
};

export const validarLoginSinPassword = async (
  email: string,
  codigo: string,
) => {
  const response = await axiosInstance.post(
    "api/auth/login-sin-password/validar",
    {
      email,
      codigo,
    },
  );

  return response.data;
};