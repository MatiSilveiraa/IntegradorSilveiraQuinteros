import axiosInstance
from "../api/axios";
import axiosInstance from "../api/axios";

export const setup2FA =
  async () => {

    const response =
      await axiosInstance.post(
        "/api/Auth/2fa/setup"
      );

    return response.data;

  };

export const confirmar2FA =
  async (codigo: string) => {

    const response =
      await axiosInstance.post(
        "/api/Auth/2fa/confirmar",
        {
          codigo,
        }
      );

    return response.data;

  };

export const validar2FA =
  async (
    email: string,
        "/api/auth/2fa/setup"
      );

    return response.data;
  };

export const confirmar2FA =
  async (
    codigo: string
  ) => {

    const response =
      await axiosInstance.post(
        "/api/Auth/2fa/validar",
        {
          email,
        "/api/auth/2fa/confirmar",
        {
          codigo,
        }
      );

    return response.data;

  };