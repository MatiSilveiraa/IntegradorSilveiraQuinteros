import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import TopBar from "../../components/navigation/DashboardTopBar";
import FullScreenLoading from "../../components/FullScreenSpinner";

import { obtenerMiPerfil } from "../../services/Perfil.service";
import { obtenerDetalleClase } from "../../services/Entrenador.Service";

import type { Perfil } from "../../types";
import type { ClaseDetalle } from "../../types/claseDetalle";
import ClaseHero from "../../components/entrenador/clase/ClaseHero";
import ClaseSidebar from "../../components/entrenador/clase/ClaseSidebar";
import ClaseAlumnos from "../../components/entrenador/clase/ClaseAlumno";

export default function ClaseDetallePage() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [perfil, setPerfil] = useState<Perfil | null>(null);

  const [clase, setClase] = useState<ClaseDetalle | null>(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const [perfilData, claseData] = await Promise.all([
          obtenerMiPerfil(),

          obtenerDetalleClase(Number(id)),
        ]);

        console.log("Perfil:", perfilData);
        console.log("Clase:", claseData);

        setPerfil(perfilData);

        setClase(claseData);
      } catch (error) {
        console.error(error);

        toast.error("No fue posible cargar la clase.");
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [id]);

  if (loading) {
    return <FullScreenLoading />;
  }

  if (!clase) {
    return (
      <div className="min-h-screen bg-[#12201b] flex items-center justify-center text-white">
        No se encontró la clase.
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-[#12201b] text-white">
    <TopBar nombre={perfil?.nombre} />

    <main
      className="
        max-w-[1700px]
        mx-auto
        px-4
        md:px-8
        xl:px-10
        pt-24
        pb-12
      "
    >

      <ClaseHero
        grupo={clase.grupo}
        dia={clase.diaSemana}
        horaInicio={clase.horaInicio}
        horaFin={clase.horaFin}
      />

      <div
        className="
          mt-8
          grid
          grid-cols-1
          xl:grid-cols-[minmax(0,1fr)_360px]
          gap-8
          items-start
        "
      >
        {/* CONTENIDO PRINCIPAL */}

        <section>
          <ClaseAlumnos alumnos={clase.alumnos} />
        </section>

        {/* SIDEBAR */}

        <aside className="space-y-6">
          <ClaseSidebar
  claseId={clase.id}
  latitud={clase.latitud}
  longitud={clase.longitud}
  inscriptos={clase.inscriptos}
  cupoMaximo={clase.inscriptos + clase.cuposDisponibles}
/>

        </aside>
      </div>
    </main>
  </div>
);
}
