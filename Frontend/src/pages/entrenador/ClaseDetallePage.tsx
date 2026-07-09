import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import TopBar from "../../components/navigation/DashboardTopBar";
import FullScreenLoading from "../../components/FullScreenSpinner";

import { obtenerMiPerfil } from "../../services/Perfil.service";
import { obtenerDetalleClase } from "../../services/Entrenador.Service";

import type { Perfil } from "../../types";
import type { ClaseDetalle } from "../../types/claseDetalle";

import ClaseDetalleHero from "../../components/entrenador/clase/ClaseDetalleHero";
import ClaseResumen from "../../components/entrenador/clase/ClaseResumen";

export default function ClaseDetallePage() {

  const navigate = useNavigate();

  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [perfil, setPerfil] =
    useState<Perfil | null>(null);

  const [clase, setClase] =
    useState<ClaseDetalle | null>(null);

  useEffect(() => {

    const cargar = async () => {

      

    try {

        const [
            perfilData,
            claseData,
        ] = await Promise.all([

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
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          pt-24
          pb-10
        "
      >

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

        <h1 className="text-4xl font-bold">
  {clase.grupo}
</h1>

<ClaseDetalleHero
  grupo={clase.grupo}
  dia={clase.diaSemana}
  horaInicio={clase.horaInicio}
  horaFin={clase.horaFin}
/>

<ClaseResumen
  inscriptos={clase.inscriptos}
  disponibles={clase.cuposDisponibles}
  radio={clase.radio}
  codigoPostal={clase.codigoPostal}
/>

      </main>

    </div>

  );

}