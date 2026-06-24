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
import { cuentaBloqueada, obtenerMotivoBloqueo } from "../utils/accountUtils";
import BlockedAccountAlert from "../components/BlockedAccountAlert";
import { validarCuentaActiva } from "../utils/bloqueoUtils";
import LoadingSpinner from "../components/FullScreenSpinner";

export default function GrupoDetallePage() {
  const navigate = useNavigate();

  const { grupoId } = useParams();

  const [grupo, setGrupo] = useState<Grupo | null>(null);

  const [loading, setLoading] = useState(true);

  const [perfil, setPerfil] = useState<any>(null);

  const [clasesInscritas, setClasesInscritas] = useState<number[]>([]);
  
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
  }
};

  useEffect(() => {
  const cargar = async () => {
    await cargarGrupo();

    setLoading(false);
  };

  cargar();
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

    await cargarGrupo();

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

    setClasesInscritas((prev) =>
      prev.filter((id) => id !== claseId),
    );

    await cargarGrupo();

    toast.success("Te desinscribiste correctamente");
  } catch (error: any) {
    console.error(error);

    toast.error(
      error?.response?.data?.mensaje ||
      "No fue posible desinscribirse",
    );
  }
};

  if (loading) {
    return <LoadingSpinner />;
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
  const bloqueado = cuentaBloqueada(perfil);

  return (
    <AlumnoLayout nombre={undefined}>
      <main className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">{grupo.nombre}</h1>

          <p className="text-gray-400 mt-1">Nivel {grupo.nivel}</p>
        </header>

        <BlockedAccountAlert motivo={obtenerMotivoBloqueo(perfil)} />

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
                  <div className="flex justify-between items-start gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <CalendarTodayOutlinedIcon sx={{ fontSize: 18 }} />

                        <span className="font-bold text-lg">
                          {clase.diaSemana}
                        </span>

                        <span
                          className="
          px-3
          py-1
          rounded-full
          bg-blue-500/10
          text-blue-400
          text-xs
          font-semibold
        "
                        >
                          {clase.estado}
                        </span>
                      </div>

                      <p className="text-gray-300">
                        {clase.horaInicio.substring(0, 5)}
                        {" - "}
                        {clase.horaFin.substring(0, 5)}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        <span
                          className="
          px-3
          py-1
          rounded-lg
          bg-[#12201b]
          text-[#4adea8]
          text-sm
        "
                        >
                          👥 {clase.cantidadInscriptos ?? 0}/{clase.cupoMaximo}
                        </span>

                        <span
                          className="
          px-3
          py-1
          rounded-lg
          bg-[#12201b]
          text-[#4adea8]
          text-sm
        "
                        >
                          {clase.esFija ? "Clase fija" : "Clase especial"}
                        </span>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-2">
                          <span className="text-gray-400">Ocupación</span>

                          <span className="text-[#4adea8]">
                            {Math.round(
                              ((clase.cantidadInscriptos ?? 0) * 100) /
                                (clase.cupoMaximo ?? 1),
                            )}
                            %
                          </span>
                        </div>

                        <div className="h-2 bg-[#12201b] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#4adea8]"
                            style={{
                              width: `${
                                ((clase.cantidadInscriptos ?? 0) * 100) /
                                (clase.cupoMaximo ?? 1)
                              }%`,
                            }}
                          />
                        </div>

                        {(clase.cantidadInscriptos ?? 0) >=
                          (clase.cupoMaximo ?? 0) * 0.8 &&
                          (clase.cantidadInscriptos ?? 0) <
                            (clase.cupoMaximo ?? 0) && (
                            <p className="text-amber-400 text-xs mt-2 font-semibold">
                              ⚡ Últimos cupos disponibles
                            </p>
                          )}

                        {(clase.cantidadInscriptos ?? 0) ===
                          (clase.cupoMaximo ?? 0) && (
                          <p className="text-red-400 text-xs mt-2 font-semibold">
                            🔥 Clase completa
                          </p>
                        )}
                      </div>

                      {clase.latitud && clase.longitud && (
                        <a
                          href={`https://www.openstreetmap.org/?mlat=${clase.latitud}&mlon=${clase.longitud}&zoom=16`}
                          target="_blank"
                          rel="noreferrer"
                          className="
          inline-block
          text-[#4adea8]
          text-sm
          hover:underline
        "
                        >
                           Ver ubicación
                        </a>
                      )}

                      {clase.fechaFin && (
                        <p className="text-gray-500 text-sm">
                          Vigente hasta{" "}
                          {new Date(clase.fechaFin).toLocaleDateString("es-UY")}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center">
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
                          disabled={bloqueado}
                          onClick={() => {
                            if (!validarCuentaActiva(perfil)) {
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
            bloqueado
              ? "bg-gray-600 text-gray-300 cursor-not-allowed"
              : "bg-[#4adea8] text-[#12201b] hover:opacity-90"
          }
        `}
                        >
                          {bloqueado ? "Cuenta bloqueada" : "Inscribirme"}
                        </button>
                      )}
                    </div>
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
