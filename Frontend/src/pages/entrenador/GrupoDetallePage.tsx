import { useEffect, useState } from "react";
import {  useParams } from "react-router-dom";
import toast from "react-hot-toast";



import TopBar from "../../components/navigation/DashboardTopBar";
import FullScreenLoading from "../../components/FullScreenSpinner";

import { obtenerDetalleGrupo } from "../../services/Entrenador.Service";
import { obtenerMiPerfil } from "../../services/Perfil.service";

import type { Perfil } from "../../types";
import type { GrupoDetalle } from "../../types/grupoDetalle";
import GrupoHeader from "../../components/entrenador/grupos/GrupoHeader";
import GrupoClases from "../../components/entrenador/grupos/GrupoClases";


export default function GrupoDetallePage() {

  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [perfil, setPerfil] = useState<Perfil | null>(null);

  const [grupo, setGrupo] = useState<GrupoDetalle | null>(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const [perfilData, grupoData] = await Promise.all([
          obtenerMiPerfil(),
          obtenerDetalleGrupo(Number(id)),
        ]);

        setPerfil(perfilData);

        setGrupo(grupoData);
      } catch (error) {
        console.error(error);

        toast.error("No fue posible cargar el grupo.");
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [id]);

  if (loading) {
    return <FullScreenLoading />;
  }

  if (!grupo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      <TopBar nombre={perfil?.nombre} />

      <main
        className="
        max-w-7xl
        mx-auto
        px-4
        sm:px-6
        lg:px-8
        pt-24
        pb-10
      "
      >


        {/* Header */}

        <GrupoHeader
          nombre={grupo.nombre}
          nivel={grupo.nivel}
          estado={grupo.estado}
        />

        {/* Clases */}

        <section className="mt-10">
          <GrupoClases clases={grupo.clases} />
        </section>
      </main>
    </div>
  );
}
