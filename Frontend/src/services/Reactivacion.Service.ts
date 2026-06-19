import axiosInstance from "../api/axios";

export const solicitarReactivacion = async (
  motivoAlumno: string
) => {
  const response = await axiosInstance.post(
    "/api/Reactivacion/solicitar",
    {
      motivoAlumno,
    }
  );

  return response.data;
};