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

export const solicitarRecuperacion = async (
  email: string
) => {
  const response = await axiosInstance.post(
    "/api/Auth/solicitar-recuperacion",
    {
      email,
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
        email,
        codigo,
        nuevaContrasena,
      }
    );

  return response.data;
};
