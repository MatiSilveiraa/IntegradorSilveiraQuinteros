import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  obtenerDesafios,
} from "../services/AdminDesafio.Service";

import {
  obtenerRecompensasPorDesafio,
  eliminarRecompensa,
} from "../services/AdminRecompensa.Service";

import type { Desafio, Recompensa } from "../types";

import FullScreenLoading from "../components/FullScreenSpinner";

export default function AdminRecompensasPage() {
  const [desafios, setDesafios] =
    useState<Desafio[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [recompensas, setRecompensas] =
    useState<Recompensa[]>([]);

  const [
    desafioSeleccionado,
    setDesafioSeleccionado,
  ] = useState<number>(0);

  useEffect(() => {
  const cargarDatos = async () => {
    try {
      const data = await obtenerDesafios();

      setDesafios(data);
    } catch (error) {
      console.error(error);

      toast.error(
        "No fue posible cargar los desafíos"
      );
    } finally {
      setLoading(false);
    }
  };

  cargarDatos();
}, []);

  useEffect(() => {
    if (!desafioSeleccionado)
      return;

    cargarRecompensas();
  }, [desafioSeleccionado]);

  const cargarRecompensas =
    async () => {
      try {
        const data =
          await obtenerRecompensasPorDesafio(
            desafioSeleccionado
          );

        setRecompensas(data);
      } catch (error) {
        console.error(error);

        toast.error(
          "No fue posible cargar las recompensas"
        );
      }
    };

  const borrar =
    async (id: number) => {
      if (
        !confirm(
          "¿Eliminar recompensa?"
        )
      ) {
        return;
      }

      try {
        await eliminarRecompensa(
          id
        );

        toast.success(
          "Recompensa eliminada correctamente"
        );

        cargarRecompensas();
      } catch (error) {
        console.error(error);

        toast.error(
          "No fue posible eliminar la recompensa"
        );
      }
    };
    if(loading) {
      return <FullScreenLoading />
    }
  return (
    <div className="min-h-screen bg-[#12201b] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Recompensas
          </h1>

          <p className="text-gray-400 mt-2">
            Gestión de recompensas
            por desafío.
          </p>
        </div>

        <div className="mb-6">
          <select
            value={
              desafioSeleccionado
            }
            onChange={(e) =>
              setDesafioSeleccionado(
                Number(
                  e.target.value
                )
              )
            }
            className="
              bg-[#1a2b24]
              border
              border-[#2d463b]
              rounded-xl
              p-3
              w-full
              max-w-md
            "
          >
            <option value={0}>
              Seleccionar desafío
            </option>

            {desafios.map(
              (desafio) => (
                <option
                  key={desafio.id}
                  value={desafio.id}
                >
                  {desafio.titulo}
                </option>
              )
            )}
          </select>
        </div>

        {desafioSeleccionado === 0 ? (
          <div
            className="
              bg-[#1a2b24]
              border
              border-[#2d463b]
              rounded-2xl
              p-8
              text-center
            "
          >
            <p className="text-gray-400">
              Selecciona un desafío
              para visualizar sus
              recompensas.
            </p>
          </div>
        ) : recompensas.length === 0 ? (
          <div
            className="
              bg-[#1a2b24]
              border
              border-[#2d463b]
              rounded-2xl
              p-8
              text-center
            "
          >
            <p className="text-gray-400">
              Este desafío no tiene
              recompensas registradas.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {recompensas.map(
              (recompensa) => (
                <div
                  key={
                    recompensa.id
                  }
                  className={`
                    rounded-2xl
                    border
                    p-5
                    transition-all
                    ${
                      recompensa.leida
                        ? `
                          bg-[#1a2b24]
                          border-[#2d463b]
                        `
                        : `
                          bg-[#163129]
                          border-[#4adea8]
                        `
                    }
                  `}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">
                        {
                          recompensa.tipo
                        }
                      </h3>

                      <p className="text-gray-400 mt-2">
                        {
                          recompensa.descripcion
                        }
                      </p>

                      {recompensa.premioFisico && (
                        <p className="mt-2 text-sm text-[#4adea8]">
                          Premio:{" "}
                          {
                            recompensa.premioFisico
                          }
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        borrar(
                          recompensa.id
                        )
                      }
                      className="
                        px-3
                        py-2
                        rounded-lg
                        bg-red-500/20
                        text-red-400
                        hover:bg-red-500/30
                      "
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}