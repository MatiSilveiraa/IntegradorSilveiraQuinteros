import axiosInstance from "../api/axios";

export const inscribirseClase = async (
  claseId: number
) => {

  const response =
    await axiosInstance.post(
      `/api/inscripciones/${claseId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

  return response.data;
};