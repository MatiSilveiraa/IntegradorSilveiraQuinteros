import axiosInstance from "../api/axios";

export const register = async (usuario: any) => {
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
      email,
      password,
    }
  );

  return response.data;
};