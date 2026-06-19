import { useEffect, useState } from "react";
import BuscadorGrupos from "../components/grupos/BuscadorGrupos";
import GrupoCard from "../components/grupos/GrupoCard";
import { obtenerMiPerfil } from "../services/Perfil.service";
import { obtenerGrupos } from "../../src/services/Grupo.Service";
import { obtenerDias, obtenerHora } from "../utils/grupoUtils";
import AlumnoLayout from "../components/layout/AlumnoLayout";
import { obtenerMisClases } from "../services/Inscripciones.Service";
import { obtenerImagenGrupo } from "../utils/grupoImageUtils";
import { desinscribirseClase } from "../services/Inscripciones.Service";
import { obtenerProximaClase } from "../utils/proximaClaseUtils";
import toast from "react-hot-toast";

import type { Perfil } from "../types";

export default function GruposPage() {
  const [perfil, setPerfil] = useState<Perfil | any>(null);

  const [grupos, setGrupos] = useState<any[]>([]);
  const [misClases, setMisClases] = useState<any[]>([]);

  const [busqueda, setBusqueda] = useState("");

  const proximaClase = obtenerProximaClase(misClases);

  useEffect(() => {
  obtenerMiPerfil()
    .then(setPerfil)
    .catch((error) => {
      console.error(error);

      toast.error(
        "No fue posible cargar el perfil"
      );
    });
}, []);

 useEffect(() => {
  obtenerGrupos()
    .then(setGrupos)
    .catch((error) => {
      console.error(error);

      toast.error(
        "No fue posible cargar los grupos"
      );
    });
}, []);

 useEffect(() => {
  obtenerMisClases()
    .then((data) => {
      setMisClases(data);
    })
    .catch((error) => {
      console.error(error);

      toast.error(
        "No fue posible cargar tus clases"
      );
    });
}, []);

 const handleDesinscribirse = async (
  claseId: number
) => {
  try {
    await desinscribirseClase(
      claseId
    );

    setMisClases((prev) =>
      prev.filter(
        (c) => c.id !== claseId
      )
    );

    toast.success(
      "Te desinscribiste correctamente"
    );
  } catch (error) {
    console.error(error);

    toast.error(
      "No fue posible desinscribirse"
    );
  }
};

  const gruposFiltrados = grupos.filter((grupo) =>
    grupo.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const obtenerNombreGrupo = (grupoId: number) => {
    return grupos.find((g) => g.id === grupoId)?.nombre || "Grupo";
  };

  return (
    <AlumnoLayout nombre={perfil?.nombre}>
      <main className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Grupos</h1>

          <p className="text-gray-400 mt-2">
            Encuentra e inscríbete a los grupos disponibles.
          </p>
        </div>

        <BuscadorGrupos
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        {perfil?.bloqueadoPorInasistencias && (
  <div
    className="
      mt-6
      bg-red-500/10
      border
      border-red-500/30
      rounded-2xl
      p-5
    "
  >
    <h3 className="text-red-400 font-bold">
      🚫 Cuenta bloqueada
    </h3>

    <p className="text-gray-300 mt-2">
      Tu cuenta se encuentra bloqueada por inasistencias.
      No podrás inscribirte a nuevas clases hasta que tu
      solicitud de reactivación sea aprobada.
    </p>
  </div>
)}
        {/* PRÓXIMA CLASE */}

        <div
          className="
    mt-8
    rounded-3xl
    border
    border-[#4adea8]/20
    bg-gradient-to-r
    from-[#1a2b24]
    to-[#163129]
    p-6
    shadow-lg
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
            PRÓXIMA CLASE
          </span>

          <h3 className="text-3xl font-bold mt-4">
            {proximaClase ? proximaClase.diaSemana : "Sin clases programadas"}
          </h3>

          <p className="text-gray-300 mt-2 text-lg">
            {proximaClase
              ? `${proximaClase.horaInicio.substring(
                  0,
                  5,
                )} - ${proximaClase.horaFin.substring(0, 5)}`
              : "No tienes clases registradas"}
          </p>
        </div>

        {/* MIS CLASES */}

        <section className="mt-10">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-3xl font-bold">Mis clases</h2>

            <span className="text-gray-400 text-sm">
              {misClases.length} clases
            </span>
          </div>

          {misClases.length === 0 ? (
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
                No estás inscripto a ninguna clase.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {misClases.map((clase) => (
                <div
                  key={clase.id}
                  className="
            bg-[#1a2b24]
            border
            border-[#2d463b]
            rounded-2xl
            overflow-hidden
            hover:border-[#4adea8]/40
            transition-all
          "
                >
                  <div className="flex">
                    <div className="w-32 h-32 flex-shrink-0">
                      <img
                        src={obtenerImagenGrupo(
                          obtenerNombreGrupo(clase.grupoId),
                        )}
                        alt="Clase"
                        className="
      w-full
      h-full
      object-cover
    "
                      />
                    </div>

                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">
                            {clase.diaSemana}
                          </h3>

                          <p className="text-gray-400 mt-1">
                            {clase.horaInicio.substring(0, 5)}

                            {" - "}

                            {clase.horaFin.substring(0, 5)}
                          </p>

                          <p className="text-gray-500 text-sm mt-2">
                            Clase #{clase.id}
                          </p>
                        </div>

                        <span
                          className="
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-semibold
                    bg-[#4adea8]/10
                    text-[#4adea8]
                  "
                        >
                          Activa
                        </span>
                        <button
                          onClick={() => handleDesinscribirse(clase.id)}
                          className="
    mt-4
    px-4
    py-2
    rounded-lg
    bg-red-500/20
    text-red-400
    hover:bg-red-500/30
    transition-all
    text-sm
    font-semibold
  "
                        >
                          Desinscribirme
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div
          className="
    border-t
    border-[#2d463b]
    my-10
  "
        />
        <section className="mt-8">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold">Grupos Disponibles</h2>

            <span className="text-gray-400 text-sm">
              {gruposFiltrados.length} grupos encontrados
            </span>
          </div>

          {gruposFiltrados.length === 0 ? (
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
              <p className="text-gray-400">No se encontraron grupos.</p>
            </div>
          ) : (
            <div
              className="
              grid
              gap-6
              md:grid-cols-2
              xl:grid-cols-3
            "
            >
              {gruposFiltrados.map((grupo) => (
                <GrupoCard
                  key={grupo.id}
                  id={grupo.id}
                  nombre={grupo.nombre}
                  horario={`${obtenerDias(grupo.clases)} — ${obtenerHora(
                    grupo.clases,
                  )}`}
                  ubicacion={
                    grupo.clases?.length
                      ? grupo.clases[0].codigoPostal
                      : "Sin ubicación"
                  }
                  nivel={grupo.nivel}
                  cuposOcupados={0}
                  cuposTotales={
                    grupo.clases?.length ? grupo.clases[0].cupoMaximo : 0
                  }
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </AlumnoLayout>
  );
}
