import { useEffect, useState } from "react";

import GruposHeader from "../components/grupos/GruposHeader";
import BuscadorGrupos from "../components/grupos/BuscadorGrupos";
import GrupoCard from "../components/grupos/GrupoCard";
import GruposFooter from "../components/grupos/GruposFooter";

import { obtenerMiPerfil } from "../services/Perfil.service";
import { obtenerGrupos } from "../../src/services/Grupo.Service";

import {
  obtenerDias,
  obtenerHora,
} from "../utils/grupoUtils";

export default function GruposPage() {

  const [perfil, setPerfil] =
    useState<any>(null);

  const [grupos, setGrupos] =
    useState<any[]>([]);

  const [busqueda, setBusqueda] =
    useState("");

  useEffect(() => {

    obtenerMiPerfil()
      .then(setPerfil)
      .catch(console.error);

  }, []);

  useEffect(() => {

    obtenerGrupos()
      .then(setGrupos)
      .catch(console.error);

  }, []);

  const gruposFiltrados =
    grupos.filter((grupo) =>
      grupo.nombre
        .toLowerCase()
        .includes(
          busqueda.toLowerCase()
        )
    );

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          py-6
          pb-28
        "
      >
        <GruposHeader nombre={perfil?.nombre} />

        <div className="mt-6">
          <BuscadorGrupos
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="mt-6">{/* <SuccessCard /> */}</div>

        <div className="mt-4">{/* <WarningCard /> */}</div>

        <section className="mt-8">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-3xl font-bold">Grupos Disponibles</h2>

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
                  horario={`${obtenerDias(grupo.clases)} — ${obtenerHora(grupo.clases)}`}
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
      </div>

      <GruposFooter />
    </div>
  );
}