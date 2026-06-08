import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";

import { obtenerGrupos } from "../services/Grupo.Service";
import { inscribirseClase } from "../services/Clase.Service";

export default function GrupoDetallePage() {

  const navigate = useNavigate();

  const { grupoId } = useParams();

  const [grupo, setGrupo] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const cargarGrupo =
      async () => {

        try {

          const grupos =
            await obtenerGrupos();

          const grupoEncontrado =
            grupos.find(
              (g: any) =>
                g.id === Number(grupoId)
            );

          setGrupo(
            grupoEncontrado
          );

        } catch (error) {

          console.error(error);

        } finally {

          setLoading(false);

        }

      };

    cargarGrupo();

  }, [grupoId]);

  const handleInscribirse =
    async (claseId: number) => {

      try {

        await inscribirseClase(
          claseId
        );

        alert(
          "Inscripción realizada correctamente"
        );

      } catch (error) {

        console.error(error);

        alert(
          "No fue posible inscribirse"
        );

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

        <h2 className="text-2xl font-bold">
          Grupo no encontrado
        </h2>

        <button
          onClick={() =>
            navigate("/alumno/grupos")
          }
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

      <div className="max-w-5xl mx-auto px-4 py-6">

        <header className="flex items-center gap-4 mb-8">

          <button
            onClick={() =>
              navigate(-1)
            }
            className="
              w-10
              h-10
              rounded-full
              bg-[#1a2b24]
              border
              border-[#2d463b]
              flex
              items-center
              justify-center
            "
          >
            <ArrowBackOutlinedIcon />
          </button>

          <div>

            <h1 className="text-3xl font-bold">
              {grupo.nombre}
            </h1>

            <p className="text-gray-400 mt-1">
              Nivel {grupo.nivel}
            </p>

          </div>

        </header>

        <div className="grid gap-4">

          {grupo.clases?.length > 0 ? (

            grupo.clases.map(
              (clase: any) => (

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

                        {clase.horaInicio.substring(
                          0,
                          5
                        )}
                        {" - "}
                        {clase.horaFin.substring(
                          0,
                          5
                        )}

                      </p>

                      <p className="text-gray-500 text-sm mt-2">

                        Cupo máximo:
                        {" "}
                        {clase.cupoMaximo}

                      </p>

                    </div>

                    <button
                      onClick={() =>
                        handleInscribirse(
                          clase.id
                        )
                      }
                      className="
                        px-5
                        py-3
                        bg-[#4adea8]
                        text-[#12201b]
                        rounded-xl
                        font-bold
                      "
                    >
                      Inscribirme
                    </button>

                  </div>

                </div>

              )
            )

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

      </div>

    </div>
  );
}