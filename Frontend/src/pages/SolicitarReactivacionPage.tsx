import { useState } from "react";
import toast from "react-hot-toast";

import {
  solicitarReactivacion,
} from "../services/Reactivacion.Service";

import AlumnoLayout from "../components/layout/DashboardLayout";

export default function SolicitarReactivacionPage() {

  const [motivo, setMotivo] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const enviarSolicitud =
    async () => {

      if (!motivo.trim()) {

        toast.error(
          "Debes indicar un motivo"
        );

        return;

      }

      try {

        setLoading(true);

        await solicitarReactivacion(
          motivo
        );

        toast.success(
          "Solicitud enviada correctamente"
        );

        setMotivo("");

      } catch (error: any) {

        console.error(error);

        toast.error(
          error?.response?.data?.mensaje ||
          "No fue posible enviar la solicitud"
        );

      } finally {

        setLoading(false);

      }

    };

  return (
    <AlumnoLayout>

      <main className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-2">
          Solicitar Reactivación
        </h1>

        <p className="text-gray-400 mb-8">
          Si tu cuenta fue bloqueada por inasistencias,
          puedes solicitar una reactivación.
        </p>

        <div
          className="
            bg-[#1a2b24]
            border
            border-[#2d463b]
            rounded-2xl
            p-6
          "
        >

          <label
            className="
              block
              text-sm
              text-gray-300
              mb-3
            "
          >
            Motivo de la solicitud
          </label>

          <textarea
            value={motivo}
            onChange={(e) =>
              setMotivo(
                e.target.value
              )
            }
            placeholder="
Explica por qué deseas reactivar tu cuenta..."
            className="
              w-full
              h-40
              p-4
              rounded-xl
              bg-[#12201b]
              border
              border-[#2d463b]
              resize-none
            "
          />

          <button
            onClick={enviarSolicitud}
            disabled={loading}
            className="
              mt-5
              px-6
              py-3
              rounded-xl
              bg-[#4adea8]
              text-[#12201b]
              font-bold
              disabled:opacity-50
            "
          >
            {
              loading
                ? "Enviando..."
                : "Enviar Solicitud"
            }
          </button>

        </div>

      </main>

    </AlumnoLayout>
  );
}