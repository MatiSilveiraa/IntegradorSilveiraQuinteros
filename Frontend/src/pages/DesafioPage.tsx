import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import AlumnoLayout from "../components/layout/AlumnoLayout";

import { obtenerMiPerfil } from "../services/Perfil.service";

import {
  obtenerDesafios,
  obtenerMisDesafios,
  participarDesafio,
} from "../services/Desafio.Service";

import type { Perfil, Desafio } from "../types";

import FullScreenLoading from "../components/FullScreenSpinner";

export default function DesafiosPage() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);

  const [loading, setLoading] = useState(true);

  const [desafios, setDesafios] = useState<Desafio[]>([]);

  const [misDesafios, setMisDesafios] = useState<Desafio[]>([]);

  const cargarDatos = async () => {
    try {
      const [perfilData, desafiosData, misDesafiosData] = await Promise.all([
        obtenerMiPerfil(),
        obtenerDesafios(),
        obtenerMisDesafios(),
      ]);

      setPerfil(perfilData);

      setDesafios(desafiosData || []);

      setMisDesafios(misDesafiosData || []);
    } catch (error) {
      console.error(error);

      toast.error("No fue posible cargar los desafíos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleParticipar = async (desafioId: number) => {
    try {
      await participarDesafio(desafioId);

      toast.success("Te has unido al desafío correctamente");

      await cargarDatos();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.mensaje ||
          "No fue posible participar en el desafío",
      );
    }
  };

  const cantidadParticipando = misDesafios.filter((d) => d.participa).length;

  const cantidadGanados = misDesafios.filter((d) => d.ganador).length;

  const desafiosParticipando = misDesafios
    .filter((d) => d.participa)
    .map((d) => d.desafioId);

  const desafiosDisponibles = desafios.filter(
    (desafio) => !desafiosParticipando.includes(desafio.id),
  );
  if (loading) {
    return <FullScreenLoading />;
  }
  return (
    <AlumnoLayout nombre={perfil?.nombre}>
      <main className="max-w-6xl mx-auto">
        <div
          className="
    rounded-3xl
    border
    border-[#4adea8]/20
    bg-gradient-to-r
    from-[#1a2b24]
    to-[#163129]
    p-8
    mb-8
  "
        >
          <span
            className="
      inline-block
      px-3
      py-1
      rounded-full
      bg-[#4adea8]
      text-[#12201b]
      text-xs
      font-bold
    "
          >
            DESAFÍOS
          </span>

          <h1 className="text-4xl font-bold mt-4">Hola {perfil?.nombre}</h1>

          <p className="text-gray-300 mt-2">
            Participa en desafíos y obtén beneficios exclusivos.
          </p>
        </div>

        <div
          className="
            grid
            gap-4
            md:grid-cols-3
            mb-10
          "
        >
          <div
            className="
              bg-[#1a2b24]
              border
              border-[#2d463b]
              rounded-2xl
              p-5
            "
          >
            <p className="text-gray-400 text-sm">Desafíos activos</p>

            <h2 className="text-3xl font-bold mt-2">{desafios.length}</h2>
          </div>

          <div
            className="
              bg-[#1a2b24]
              border
              border-[#2d463b]
              rounded-2xl
              p-5
            "
          >
            <p className="text-gray-400 text-sm">Participando</p>

            <h2 className="text-3xl font-bold mt-2">{cantidadParticipando}</h2>
          </div>

          <div
            className="
              bg-[#1a2b24]
              border
              border-[#2d463b]
              rounded-2xl
              p-5
            "
          >
            <p className="text-gray-400 text-sm">Ganados</p>

            <h2 className="text-3xl font-bold mt-2">{cantidadGanados}</h2>
          </div>
        </div>

        <section>
          <h2 className="text-2xl font-bold mb-5">Desafíos Disponibles</h2>

          {desafiosDisponibles.length === 0 ? (
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
                Ya estás participando en todos los desafíos disponibles.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {desafiosDisponibles.map((desafio) => (
                <div
                  key={desafio.id}
                  className="
                      bg-[#1a2b24]
                      border
                      border-[#2d463b]
                      rounded-2xl
                      p-5
                    "
                >
                  <h3 className="text-xl font-bold">{desafio.titulo}</h3>

                  <p className="text-gray-400 mt-2">{desafio.descripcion}</p>

                  <p className="text-sm text-gray-500 mt-4">
                    {new Date(desafio.fechaInicio).toLocaleDateString()}
                    {" - "}
                    {new Date(desafio.fechaFin).toLocaleDateString()}
                  </p>

                  <button
                    onClick={() => {
                      if (desafio.id) {
                        handleParticipar(desafio.id);
                      }
                    }}
                    className="
                        mt-4
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
                    Participar
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-5">Mis Desafíos</h2>

          {misDesafios.length === 0 ? (
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
                Todavía no participas en ningún desafío.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {misDesafios.map((desafio) => (
                <div
                  key={desafio.desafioId}
                  className="
                      bg-[#1a2b24]
                      border
                      border-[#2d463b]
                      rounded-2xl
                      p-5
                    "
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">{desafio.titulo}</h3>

                      <p className="text-gray-400 mt-2">
                        {desafio.descripcion}
                      </p>
                    </div>

                    {desafio.ganador ? (
                      <span
                        className="
                            px-3
                            py-1
                            rounded-full
                            bg-yellow-500/10
                            text-yellow-400
                            text-xs
                            font-semibold
                          "
                      >
                        🏆 Ganador
                      </span>
                    ) : desafio.participa ? (
                      <span
                        className="
                            px-3
                            py-1
                            rounded-full
                            bg-[#4adea8]/10
                            text-[#4adea8]
                            text-xs
                            font-semibold
                          "
                      >
                        Participando
                      </span>
                    ) : (
                      <span
                        className="
                            px-3
                            py-1
                            rounded-full
                            bg-gray-500/10
                            text-gray-400
                            text-xs
                            font-semibold
                          "
                      >
                        No participa
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-500 mt-4">
                    {new Date(desafio.fechaInicio).toLocaleDateString()}
                    {" - "}
                    {new Date(desafio.fechaFin).toLocaleDateString()}
                  </p>

                  {desafio.resultado && desafio.resultado !== "" && (
                    <div
                      className="
                            mt-4
                            rounded-xl
                            bg-[#12201b]
                            p-3
                          "
                    >
                      <p className="text-sm text-gray-400">Resultado</p>

                      <p className="mt-1">{desafio.resultado}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </AlumnoLayout>
  );
}
