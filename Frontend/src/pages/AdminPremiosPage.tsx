import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

import {
  obtenerPremiosPendientes,
  marcarPremioEntregado,
} from "../services/AdminBeneficio.Service";

import type { Recompensa } from "../types";

import FullScreenLoading from "../components/FullScreenSpinner";

export default function AdminPremiosPage() {
  const [premios, setPremios] =
    useState<Recompensa[]>([]);
  const [loading, setLoading] =
    useState(true);

  const cargarDatos = async () => {
    try {
      const data =
        await obtenerPremiosPendientes();

      setPremios(data);
    } catch (error) {
      console.error(error);

      toast.error(
        "No fue posible cargar los premios pendientes"
      );
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  if (loading) {
    return <FullScreenLoading />;
  }

  const entregar = async (
    beneficioId: number
  ) => {
    try {
      await marcarPremioEntregado(
        beneficioId
      );

      toast.success(
        "Premio marcado como entregado"
      );

      cargarDatos();
    } catch (error) {
      console.error(error);

      toast.error(
        "No fue posible marcar el premio como entregado"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#12201b] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Inventory2OutlinedIcon fontSize="large" />

          <h1 className="text-3xl font-bold">
            Premios Pendientes
          </h1>
        </div>

        <p className="text-gray-400 mb-8">
          Premios físicos pendientes de entrega.
        </p>

        <div
          className="
            bg-[#1a2b24]
            border
            border-[#2d463b]
            rounded-2xl
            p-5
            mb-6
          "
        >
          <p className="text-gray-400 text-sm">
            Pendientes
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {premios.length}
          </h2>
        </div>

        {premios.length === 0 ? (
          <div
            className="
              bg-[#1a2b24]
              border
              border-[#2d463b]
              rounded-2xl
              p-10
              text-center
            "
          >
            <CheckCircleOutlinedIcon
              sx={{
                fontSize: 60,
              }}
            />

            <p className="mt-4 text-gray-400">
              No hay premios pendientes de entrega.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {premios.map((premio) => (
              <div
                key={
                  premio.beneficioId ??
                  premio.id
                }
                className="
                  bg-[#1a2b24]
                  border
                  border-[#2d463b]
                  rounded-2xl
                  p-5
                  hover:border-[#4adea8]/30
                  transition-all
                "
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold">
                      {premio.descripcion}
                    </h3>

                    <p className="text-gray-400 mt-2">
                      Alumno: {premio.nombre}{" "}
                      {premio.apellido}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      ID Alumno:{" "}
                      {premio.alumnoId}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      entregar(
                        premio.beneficioId!
                      )
                    }
                    className="
                      px-4
                      py-2
                      rounded-lg
                      bg-[#4adea8]
                      text-[#12201b]
                      font-semibold
                      hover:opacity-90
                      transition-all
                    "
                  >
                    Marcar Entregado
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}