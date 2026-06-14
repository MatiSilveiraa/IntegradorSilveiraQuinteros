import { useEffect, useState } from "react";

import AlumnoTopBar from "../components/navigation/DashboardTopBar";
import AlumnoSidebar from "../components/navigation/AlumnoSidebar";
import AlumnoBottomNav from "../components/navigation/AlumnoBottomNav";

import { obtenerMiPerfil } from "../services/Perfil.service";

import {
  obtenerDesafios,
  obtenerMisDesafios,
  participarDesafio,
} from "../services/Desafio.Service";

export default function DesafiosPage() {
  const [perfil, setPerfil] = useState<any>(null);

  const [desafios, setDesafios] = useState<any[]>([]);

  const [misDesafios, setMisDesafios] = useState<any[]>([]);

  useEffect(() => {
    obtenerMiPerfil()
      .then(setPerfil)
      .catch(console.error);
  }, []);

  const cargarDatos = async () => {
    try {
      const [
        desafiosData,
        misDesafiosData,
      ] = await Promise.all([
        obtenerDesafios(),
        obtenerMisDesafios(),
      ]);

      setDesafios(desafiosData || []);

      setMisDesafios(
        misDesafiosData || []
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleParticipar =
    async (
      desafioId: number
    ) => {
      try {
        await participarDesafio(
          desafioId
        );

        await cargarDatos();
      } catch (error) {
        console.error(error);
      }
    };

  const cantidadParticipando =
    misDesafios.filter(
      (d) => d.participa
    ).length;

  const cantidadGanados =
    misDesafios.filter(
      (d) => d.ganador
    ).length;

  const desafiosParticipando =
    misDesafios
      .filter(
        (d) => d.participa
      )
      .map(
        (d) => d.desafioId
      );

  const desafiosDisponibles =
    desafios.filter(
      (desafio) =>
        !desafiosParticipando.includes(
          desafio.id
        )
    );

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      <AlumnoTopBar
        nombre={perfil?.nombre}
      />

      <AlumnoSidebar />

      <main
        className="
          pt-20
          pb-24
          px-4
          lg:px-6
          lg:ml-64
          max-w-6xl
          mx-auto
        "
      >
        <h1 className="text-3xl font-bold mb-2">
          Desafíos
        </h1>

        <p className="text-gray-400 mb-8">
          Participa en desafíos y gana
          beneficios exclusivos.
        </p>

        {/* RESUMEN */}

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
            <p className="text-gray-400 text-sm">
              Desafíos activos
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {desafios.length}
            </h2>
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
            <p className="text-gray-400 text-sm">
              Participando
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {cantidadParticipando}
            </h2>
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
            <p className="text-gray-400 text-sm">
              Ganados
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {cantidadGanados}
            </h2>
          </div>
        </div>

        {/* DISPONIBLES */}

        <section>
          <h2 className="text-2xl font-bold mb-5">
            Desafíos Disponibles
          </h2>

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
                Ya estás participando en todos
                los desafíos disponibles.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {desafiosDisponibles.map(
                (desafio) => (
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
                    <h3 className="text-xl font-bold">
                      {desafio.titulo}
                    </h3>

                    <p className="text-gray-400 mt-2">
                      {
                        desafio.descripcion
                      }
                    </p>

                    <p className="text-sm text-gray-500 mt-4">
                      {new Date(
                        desafio.fechaInicio
                      ).toLocaleDateString()}
                      {" - "}
                      {new Date(
                        desafio.fechaFin
                      ).toLocaleDateString()}
                    </p>

                    <button
                      onClick={() =>
                        handleParticipar(
                          desafio.id
                        )
                      }
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
                )
              )}
            </div>
          )}
        </section>

        {/* MIS DESAFÍOS */}

        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-5">
            Mis Desafíos
          </h2>

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
                Todavía no participas en
                ningún desafío.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {misDesafios.map(
                (desafio) => (
                  <div
                    key={
                      desafio.desafioId
                    }
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
                        <h3 className="text-xl font-bold">
                          {
                            desafio.titulo
                          }
                        </h3>

                        <p className="text-gray-400 mt-2">
                          {
                            desafio.descripcion
                          }
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
                      {new Date(
                        desafio.fechaInicio
                      ).toLocaleDateString()}
                      {" - "}
                      {new Date(
                        desafio.fechaFin
                      ).toLocaleDateString()}
                    </p>

                    {desafio.resultado &&
                      desafio.resultado !==
                        "" && (
                        <div
                          className="
                            mt-4
                            rounded-xl
                            bg-[#12201b]
                            p-3
                          "
                        >
                          <p className="text-sm text-gray-400">
                            Resultado
                          </p>

                          <p className="mt-1">
                            {
                              desafio.resultado
                            }
                          </p>
                        </div>
                      )}
                  </div>
                )
              )}
            </div>
          )}
        </section>
      </main>

      <AlumnoBottomNav />
    </div>
  );
}