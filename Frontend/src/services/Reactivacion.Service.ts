import axiosInstance from "../api/axios";

export const solicitarReactivacion = async (
  motivo: string
) => {
  const response = await axiosInstance.post(
    "/api/Reactivacion/solicitar",
    {
      motivo,
    }
  );

  return response.data;
};