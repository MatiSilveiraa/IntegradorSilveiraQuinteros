import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import TopBar from "../../components/navigation/DashboardTopBar";
import FullScreenLoading from "../../components/FullScreenSpinner";

import { obtenerDetalleGrupo } from "../../services/Entrenador.Service";
import { obtenerMiPerfil } from "../../services/Perfil.service";

import type { Perfil } from "../../types";
import type { GrupoDetalle } from "../../types/grupoDetalle";
import GrupoAlumnos from "../../components/entrenador/grupos/GrupoAlumnos";
import GrupoHeader from "../../components/entrenador/grupos/GrupoHeader";
import GrupoClases from "../../components/entrenador/grupos/GrupoClases";


export default function GrupoDetallePage() {
  const navigate = useNavigate();

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
        {/* Volver */}

        <button
          onClick={() => navigate(-1)}
          className="
          flex
          items-center
          gap-2
          text-[#4adea8]
          mb-8
          hover:underline
        "
        >
          <ArrowBackOutlinedIcon />
          Volver
        </button>

        {/* Header */}

        <GrupoHeader
          nombre={grupo.nombre}
          nivel={grupo.nivel}
          estado={grupo.estado}
        />

        {/* Alumnos */}

        <section className="mt-10">
          <GrupoAlumnos alumnos={grupo.alumnos} />
        </section>

        {/* Clases */}

        <section className="mt-10">
          <GrupoClases clases={grupo.clases} />
        </section>
      </main>
    </div>
  );
}
