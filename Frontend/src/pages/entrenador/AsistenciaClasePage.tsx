import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import toast from "react-hot-toast";

import TopBar from "../../components/navigation/DashboardTopBar";
import FullScreenLoading from "../../components/FullScreenSpinner";

import { obtenerDetalleClase } from "../../services/Entrenador.Service";

import type { ClaseDetalle } from "../../types/claseDetalle";

export default function AsistenciaClasePage() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [clase, setClase] =
    useState<ClaseDetalle | null>(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const detalle =
          await obtenerDetalleClase(Number(id));

        setClase(detalle);
      } catch {
        toast.error(
          "No fue posible cargar la clase."
        );
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
      <div className="min-h-screen bg-[#12201b] text-white flex items-center justify-center">
        No se encontró la clase.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      <TopBar />

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
        {/* HERO */}

        <section
          className="
            bg-[#1a2b24]
            border
            border-[#2d463b]
            rounded-3xl
            p-8
            mb-8
          "
        >
          <span
            className="
              inline-block
              bg-[#4adea8]
              text-[#12201b]
              text-xs
              font-bold
              px-3
              py-1
              rounded-full
              mb-4
            "
          >
            REGISTRAR ASISTENCIA
          </span>

          <h1 className="text-4xl font-bold">
            {clase.grupo}
          </h1>

          <div
            className="
              flex
              flex-wrap
              gap-6
              mt-6
              text-gray-300
            "
          >
            <span>
              📅 {clase.diaSemana}
            </span>

            <span>
              🕒 {clase.horaInicio.substring(0, 5)}
              {" - "}
              {clase.horaFin.substring(0, 5)}
            </span>

            <span>
              👥 {clase.inscriptos} / {clase.cupoMaximo} alumnos
            </span>
          </div>
        </section>

        {/* ALUMNOS */}

        <section
          className="
            bg-[#1a2b24]
            border
            border-[#2d463b]
            rounded-3xl
            p-8
          "
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              Lista de alumnos
            </h2>

            <span
              className="
                bg-[#4adea8]
                text-[#12201b]
                px-4
                py-2
                rounded-full
                font-bold
              "
            >
              {clase.alumnos.length}
            </span>
          </div>

          {clase.alumnos.length === 0 ? (
            <div
              className="
                py-20
                text-center
                text-gray-400
              "
            >
              No hay alumnos inscriptos.
            </div>
          ) : (
            <div className="space-y-4">
              {clase.alumnos.map((alumno) => (
                <div
                  key={alumno.id}
                  className="
                    flex
                    flex-col
                    md:flex-row
                    md:items-center
                    md:justify-between
                    gap-4
                    bg-[#22372f]
                    rounded-2xl
                    border
                    border-[#2d463b]
                    p-5
                  "
                >
                  <div>
                    <h3 className="text-xl font-semibold">
                      {alumno.nombre} {alumno.apellido}
                    </h3>

                    <p className="text-gray-400">
                      ID #{alumno.id}
                    </p>
                  </div>

                  <div
                    className={`
                      px-4
                      py-2
                      rounded-full
                      font-semibold
                      ${
                        alumno.presente
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }
                    `}
                  >
                    {alumno.presente
                      ? "Presente"
                      : "Sin asistencia"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}