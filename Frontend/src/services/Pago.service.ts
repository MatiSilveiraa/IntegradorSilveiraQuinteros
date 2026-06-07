import axiosInstance from "../api/axios";

export const generarPagoMercadoPago = async (
  cuotaId: number
) => {

  const response =
    await axiosInstance.post(
      `/api/Pago/mercadopago/${cuotaId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

  return response.data;
};