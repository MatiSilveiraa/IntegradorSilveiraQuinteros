import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";

import { obtenerGrupos } from "../services/Grupo.Service";
import { inscribirseClase } from "../services/Clase.Service";
import {
  obtenerMisClases,
  desinscribirseClase,
} from "../services/Inscripciones.Service";

import AlumnoTopBar from "../components/navigation/AlumnoTopBar";
import AlumnoSidebar from "../components/navigation/AlumnoSidebar";
import AlumnoBottomNav from "../components/navigation/AlumnoBottomNav";

export default function GrupoDetallePage() {
  const navigate = useNavigate();

  const { grupoId } = useParams();

  const [grupo, setGrupo] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const [clasesInscritas, setClasesInscritas] = useState<number[]>([]);

  useEffect(() => {
    const cargarGrupo = async () => {
      try {
        const grupos = await obtenerGrupos();

        const grupoEncontrado = grupos.find(
          (g: any) => g.id === Number(grupoId),
        );

        setGrupo(grupoEncontrado);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    cargarGrupo();
  }, [grupoId]);

  useEffect(() => {
    obtenerMisClases()
      .then((data) => {
        const ids = data.map((clase: any) => clase.id);

        setClasesInscritas(ids);
      })
      .catch(console.error);
  }, []);

  const handleInscribirse = async (claseId: number) => {
    try {
      await inscribirseClase(claseId);

      setClasesInscritas((prev) => [...prev, claseId]);

      alert("Inscripción realizada correctamente");
    } catch (error: any) {
      console.error(error);

      alert(
        error?.response?.data?.mensaje ||
          "No fue posible realizar la inscripción",
      );
    }
  };

  const handleDesinscribirse = async (claseId: number) => {
    try {
      await desinscribirseClase(claseId);

      setClasesInscritas((prev) => prev.filter((id) => id !== claseId));

      alert("Te desinscribiste correctamente");
    } catch (error: any) {
      console.error(error);

      alert(error?.response?.data?.mensaje || "No fue posible desinscribirse");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#12201b] text-white flex items-center justify-center">
        Cargando...
      </div>
    );
  }

  if (!grupo) {
    return (
      <div className="min-h-screen bg-[#12201b] text-white flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Grupo no encontrado</h2>

        <button
          onClick={() => navigate("/alumno/grupos")}
          className="
            px-5
            py-3
            bg-[#4adea8]
            text-[#12201b]
            rounded-xl
            font-bold
          "
        >
          Volver
        </button>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-[#12201b] text-white">

    <AlumnoTopBar />

    <AlumnoSidebar />

    <main
      className="
        pt-20
        pb-24
        px-4
        lg:px-6
        lg:ml-64
        max-w-5xl
        mx-auto
      "
    >

      <header className="mb-8">

        <h1 className="text-3xl font-bold">
          {grupo.nombre}
        </h1>

        <p className="text-gray-400 mt-1">
          Nivel {grupo.nivel}
        </p>

      </header>

      <div className="grid gap-4">

        {grupo.clases?.length > 0 ? (

          grupo.clases.map((clase: any) => {

            const estaInscripto =
              clasesInscritas.includes(
                clase.id
              );

            return (

              <div
                key={clase.id}
                className="
                  bg-[#1a2b24]
                  border
                  border-[#2d463b]
                  rounded-2xl
                  p-5
                "
              >

                <div className="flex justify-between items-center">

                  <div>

                    <div className="flex items-center gap-2">

                      <CalendarTodayOutlinedIcon
                        sx={{
                          fontSize: 18,
                        }}
                      />

                      <span className="font-semibold">
                        {clase.diaSemana}
                      </span>

                    </div>

                    <p className="text-gray-400 mt-2">

                      {clase.horaInicio.substring(0, 5)}

                      {" - "}

                      {clase.horaFin.substring(0, 5)}

                    </p>

                    <p className="text-gray-500 text-sm mt-2">

                      Cupo máximo:
                      {" "}
                      {clase.cupoMaximo}

                    </p>

                  </div>

                  {estaInscripto ? (

                    <button
                      onClick={() =>
                        handleDesinscribirse(
                          clase.id
                        )
                      }
                      className="
                        px-5
                        py-3
                        rounded-xl
                        font-bold
                        bg-red-500/20
                        text-red-400
                        hover:bg-red-500/30
                        transition-all
                      "
                    >
                      Desinscribirme
                    </button>

                  ) : (

                    <button
                      onClick={() =>
                        handleInscribirse(
                          clase.id
                        )
                      }
                      className="
                        px-5
                        py-3
                        rounded-xl
                        font-bold
                        bg-[#4adea8]
                        text-[#12201b]
                        hover:opacity-90
                        transition-all
                      "
                    >
                      Inscribirme
                    </button>

                  )}

                </div>

              </div>

            );

          })

        ) : (

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
              Este grupo no tiene clases configuradas.
            </p>

          </div>

        )}

      </div>

    </main>

    <AlumnoBottomNav />

  </div>
);
}
