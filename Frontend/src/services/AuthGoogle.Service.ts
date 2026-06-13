import axiosInstance
from "../api/axios";

export const loginGoogle =
  async (
    idToken: string
  ) => {

    const response =
      await axiosInstance.post(
        "/api/auth/google",
        {
          idToken,
        }
      );

    return response.data;
  };