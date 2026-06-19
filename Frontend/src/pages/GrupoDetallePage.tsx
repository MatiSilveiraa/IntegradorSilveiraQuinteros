import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";

import { obtenerGrupos } from "../services/Grupo.Service";
import { inscribirseClase } from "../services/Clase.Service";
import {
  obtenerMisClases,
  desinscribirseClase,
} from "../services/Inscripciones.Service";

import AlumnoLayout from "../components/layout/AlumnoLayout";

import type { Grupo, Clase } from "../types";
import { obtenerMiPerfil } from "../services/Perfil.service";

export default function GrupoDetallePage() {
  const navigate = useNavigate();

  const { grupoId } = useParams();

  const [grupo, setGrupo] = useState<Grupo | null>(null);

  const [loading, setLoading] = useState(true);

  const [perfil, setPerfil] = useState<any>(null);

  const [clasesInscritas, setClasesInscritas] = useState<number[]>([]);

  useEffect(() => {
    const cargarGrupo = async () => {
      try {
        const grupos: Grupo[] = await obtenerGrupos();

        const grupoEncontrado = grupos.find(
          (g: Grupo) => g.id === Number(grupoId),
        );

        setGrupo(grupoEncontrado!);
      } catch (error) {
        console.error(error);

        toast.error("No fue posible cargar el grupo");
      } finally {
        setLoading(false);
      }
    };

    cargarGrupo();
  }, [grupoId]);

  useEffect(() => {
    obtenerMisClases()
      .then((data) => {
        const ids = data.map((clase: Clase) => clase.id);

        setClasesInscritas(ids);
      })
      .catch((error) => {
        console.error(error);

        toast.error("No fue posible cargar tus clases");
      });
  }, []);

  const handleInscribirse = async (claseId: number) => {
    try {
      await inscribirseClase(claseId);

      setClasesInscritas((prev) => [...prev, claseId]);

      toast.success("Inscripción realizada correctamente");
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.mensaje ||
          "No fue posible realizar la inscripción",
      );
    }
  };

  useEffect(() => {
    obtenerMiPerfil().then(setPerfil).catch(console.error);
  }, []);

  const handleDesinscribirse = async (claseId: number) => {
    try {
      await desinscribirseClase(claseId);

      setClasesInscritas((prev) => prev.filter((id) => id !== claseId));

      toast.success("Te desinscribiste correctamente");
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.mensaje || "No fue posible desinscribirse",
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
    <AlumnoLayout nombre={undefined}>
      <main className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">{grupo.nombre}</h1>

          <p className="text-gray-400 mt-1">Nivel {grupo.nivel}</p>
        </header>

        {perfil?.bloqueadoPorInasistencias && (
          <div
            className="
      mb-6
      bg-red-500/10
      border
      border-red-500/30
      rounded-2xl
      p-5
    "
          >
            <h3 className="text-red-400 font-bold">🚫 Cuenta bloqueada</h3>

            <p className="text-gray-300 mt-2">
              No puedes inscribirte a nuevas clases hasta que tu solicitud de
              reactivación sea aprobada.
            </p>

            <button
              onClick={() => navigate("/alumno/reactivacion")}
              className="
        mt-4
        px-4
        py-2
        rounded-xl
        bg-red-500
        text-white
        font-semibold
      "
            >
              Solicitar reactivación
            </button>
          </div>
        )}

        <div className="grid gap-4">
          {(grupo.clases?.length ?? 0) > 0 ? (
            grupo.clases?.map((clase: Clase) => {
              const estaInscripto = clasesInscritas.includes(clase.id);

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

                        <span className="font-semibold">{clase.diaSemana}</span>
                      </div>

                      <p className="text-gray-400 mt-2">
                        {clase.horaInicio.substring(0, 5)}

                        {" - "}

                        {clase.horaFin.substring(0, 5)}
                      </p>

                      <p className="text-gray-500 text-sm mt-2">
                        Cupo máximo: {clase.cupoMaximo}
                      </p>
                    </div>

                    {estaInscripto ? (
                      <button
                        onClick={() => handleDesinscribirse(clase.id)}
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
                        disabled={perfil?.bloqueadoPorInasistencias}
                        onClick={() => {
                          if (perfil?.bloqueadoPorInasistencias) {
                            toast.error(
                              "Tu cuenta está bloqueada por inasistencias",
                            );

                            return;
                          }

                          handleInscribirse(clase.id);
                        }}
                        className={`
      px-5
      py-3
      rounded-xl
      font-bold
      transition-all
      ${
        perfil?.bloqueadoPorInasistencias
          ? "bg-gray-600 text-gray-300 cursor-not-allowed"
          : "bg-[#4adea8] text-[#12201b] hover:opacity-90"
      }
    `}
                      >
                        {perfil?.bloqueadoPorInasistencias
                          ? "Cuenta bloqueada"
                          : "Inscribirme"}
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
    </AlumnoLayout>
  );
}
