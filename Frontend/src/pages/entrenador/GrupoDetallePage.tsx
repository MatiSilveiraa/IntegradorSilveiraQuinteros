import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import TopBar from "../../components/navigation/DashboardTopBar";
import FullScreenLoading from "../../components/FullScreenSpinner";

import { obtenerDetalleGrupo } from "../../services/Entrenador.Service";
import { obtenerMiPerfil } from "../../services/Perfil.service";

import type { Perfil } from "../../types";
import type { GrupoDetalle } from "../../types/grupoDetalle";

import GrupoDetalleHero from "../../components/entrenador/grupos/GrupoDetalleHero";
import GrupoResumen from "../../components/entrenador/grupos/GrupoResumen";
import GrupoAlumnos from "../../components/entrenador/grupos/GrupoAlumnos";
import GrupoClases from "../../components/entrenador/grupos/GrupoClases";

export default function GrupoDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [grupo, setGrupo] = useState<GrupoDetalle | null>(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);

        const [perfilData, grupoData] = await Promise.all([
          obtenerMiPerfil(),
          obtenerDetalleGrupo(Number(id)),
        ]);

        setPerfil(perfilData);
        setGrupo(grupoData);
      } catch (error: any) {
        if (!error?.response || error.response.status >= 500) {
          console.error("[Detalle grupo entrenador]", error);
        }

        toast.error(
          error?.response?.data?.mensaje ??
            "No fue posible cargar el grupo.",
        );
      } finally {
        setLoading(false);
      }
    };

    void cargar();
  }, [id]);

  const proximaClase = useMemo(() => {
    if (!grupo?.clases?.length) return undefined;

    return grupo.clases.find(
      (clase) => clase.activa,
    );
  }, [grupo]);

  if (loading) {
    return <FullScreenLoading />;
  }

  if (!grupo) {
    return (
      <div className="min-h-screen bg-[#12201b] text-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            No se encontró el grupo
          </h1>

          <button
            type="button"
            onClick={() =>
              navigate("/entrenador/grupos")
            }
            className="mt-5 px-5 py-3 rounded-xl bg-[#4adea8] text-[#12201b] font-bold"
          >
            Volver a mis grupos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      <TopBar nombre={perfil?.nombre} />

      <main className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <button
          type="button"
          onClick={() =>
            navigate("/entrenador/grupos")
          }
          className="inline-flex items-center gap-2 mb-6 text-sm font-semibold text-gray-400 hover:text-[#4adea8] transition-colors"
        >
          <ArrowBackOutlinedIcon fontSize="small" />
          Volver a mis grupos
        </button>

        <GrupoDetalleHero
          nombre={grupo.nombre}
          nivel={grupo.nivel}
          estado={grupo.estado}
          cantidadAlumnos={grupo.cantidadAlumnos}
          cantidadClases={grupo.cantidadClases}
          proximaClase={proximaClase}
        />

        <GrupoResumen
          cantidadAlumnos={grupo.cantidadAlumnos}
          cantidadClases={grupo.cantidadClases}
          estado={grupo.estado}
          nivel={grupo.nivel}
        />

        <div className="grid gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-start">
          <GrupoAlumnos alumnos={grupo.alumnos ?? []} />
          <GrupoClases clases={grupo.clases ?? []} />
        </div>
      </main>
    </div>
  );
}
