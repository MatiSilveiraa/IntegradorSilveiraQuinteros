import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import TopBar from "../components/navigation/DashboardTopBar";
import FullScreenLoading from "../components/FullScreenSpinner";

import {
  obtenerParticipantesDesafio,
  asignarGanadoresDesafio,
} from "../services/AdminDesafio.Service";

import type { ParticipanteDesafio } from "../types";

type Filtro = "todos" | "ganadores" | "pendientes";

export default function AdminDesafioDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const desafioId = Number(id);

  const [participantes, setParticipantes] = useState<ParticipanteDesafio[]>([]);
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todos");

  const [loading, setLoading] = useState(true);
  const [confirmando, setConfirmando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      const data = await obtenerParticipantesDesafio(desafioId);

      setParticipantes(data);
    } catch (error: any) {
      console.error(error);

      toast.error(
        error.response?.data?.mensaje ??
          "No fue posible cargar los participantes"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!desafioId) return;

    cargarDatos();
  }, [desafioId]);

  const participantesFiltrados = useMemo(() => {
    return participantes.filter((participante) => {
      if (filtro === "ganadores" && !participante.ganador) return false;
      if (filtro === "pendientes" && participante.ganador) return false;

      const texto = `${participante.nombre} ${participante.apellido} ${
        participante.resultado ?? ""
      }`.toLowerCase();

      return texto.includes(busqueda.toLowerCase());
    });
  }, [participantes, busqueda, filtro]);

  const totalGanadores = participantes.filter((p) => p.ganador).length;
  const totalPendientes = participantes.length - totalGanadores;

  const alternarSeleccion = (alumnoId: number) => {
    setSeleccionados((prev) =>
      prev.includes(alumnoId)
        ? prev.filter((id) => id !== alumnoId)
        : [...prev, alumnoId]
    );
  };

  const seleccionarTodosVisibles = () => {
    const idsVisibles = participantesFiltrados
      .filter((p) => !p.ganador)
      .map((p) => p.alumnoId);

    const todosSeleccionados = idsVisibles.every((id) =>
      seleccionados.includes(id)
    );

    if (todosSeleccionados) {
      setSeleccionados((prev) =>
        prev.filter((id) => !idsVisibles.includes(id))
      );

      return;
    }

    setSeleccionados((prev) => Array.from(new Set([...prev, ...idsVisibles])));
  };

  const limpiarSeleccion = () => {
    setSeleccionados([]);
  };

  const confirmarGanadores = async () => {
    if (seleccionados.length === 0) {
      toast.error("Seleccioná al menos un ganador");
      return;
    }

    try {
      setGuardando(true);

      await asignarGanadoresDesafio(desafioId, seleccionados);

      toast.success("Ganadores asignados correctamente");

      setConfirmando(false);
      setSeleccionados([]);

      cargarDatos();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error.response?.data?.mensaje ??
          "No fue posible asignar los ganadores"
      );
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return <FullScreenLoading />;
  }

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      <TopBar />

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-10">
        <button
          onClick={() => navigate("/admin/desafios")}
          className="text-[#4adea8] hover:underline mb-6"
        >
          ← Volver a desafíos
        </button>

        <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-7 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#4adea8]/10 text-[#4adea8] border border-[#4adea8]/30 text-xs font-bold mb-4">
                Gestión de ganadores
              </span>

              <h1 className="text-4xl font-bold">
                Participantes del desafío
              </h1>

              <p className="text-gray-400 mt-3 max-w-3xl">
                Seleccioná uno o varios alumnos como ganadores. Al confirmar,
                el sistema generará automáticamente los beneficios configurados,
                enviará notificaciones y registrará la auditoría.
              </p>
            </div>

            <button
              disabled={seleccionados.length === 0}
              onClick={() => setConfirmando(true)}
              className="px-6 py-3 rounded-xl bg-[#4adea8] text-[#12201b] font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar ganadores
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <ResumenCard titulo="Participantes" valor={participantes.length} />
          <ResumenCard titulo="Ganadores" valor={totalGanadores} />
          <ResumenCard titulo="Pendientes" valor={totalPendientes} />
          <ResumenCard titulo="Seleccionados" valor={seleccionados.length} />
        </div>

        <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-5 mb-8">
          <div className="grid xl:grid-cols-[1fr_auto] gap-4">
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, apellido o resultado..."
              className="w-full p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8]"
            />

            <div className="flex flex-wrap gap-3">
              <BotonFiltro
                texto="Todos"
                activo={filtro === "todos"}
                onClick={() => setFiltro("todos")}
              />

              <BotonFiltro
                texto="Ganadores"
                activo={filtro === "ganadores"}
                onClick={() => setFiltro("ganadores")}
              />

              <BotonFiltro
                texto="Pendientes"
                activo={filtro === "pendientes"}
                onClick={() => setFiltro("pendientes")}
              />
            </div>
          </div>
        </div>

        {participantes.length > 0 && (
          <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-5 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Selección rápida</h2>

                <p className="text-sm text-gray-400 mt-1">
                  Podés seleccionar todos los participantes visibles que aún no
                  fueron marcados como ganadores.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={seleccionarTodosVisibles}
                  className="px-4 py-3 rounded-xl bg-[#12201b] border border-[#2d463b] text-[#4adea8] font-semibold hover:border-[#4adea8]"
                >
                  Seleccionar visibles
                </button>

                <button
                  type="button"
                  onClick={limpiarSeleccion}
                  disabled={seleccionados.length === 0}
                  className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-semibold hover:border-red-400 disabled:opacity-50"
                >
                  Limpiar selección
                </button>
              </div>
            </div>
          </div>
        )}

        {participantesFiltrados.length === 0 ? (
          <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-10 text-center">
            <h2 className="text-2xl font-bold mb-2">
              No hay participantes
            </h2>

            <p className="text-gray-400">
              No se encontraron alumnos para el filtro seleccionado.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {participantesFiltrados.map((participante) => {
              const seleccionado = seleccionados.includes(
                participante.alumnoId
              );

              return (
                <button
                  key={participante.alumnoId}
                  type="button"
                  disabled={participante.ganador}
                  onClick={() => alternarSeleccion(participante.alumnoId)}
                  className={`text-left rounded-3xl border p-6 transition-all ${
                    participante.ganador
                      ? "bg-[#4adea8]/10 border-[#4adea8]/30 cursor-default"
                      : seleccionado
                      ? "bg-[#4adea8]/10 border-[#4adea8]"
                      : "bg-[#1a2b24] border-[#2d463b] hover:border-[#4adea8]/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-14 h-14 rounded-full border flex items-center justify-center font-bold text-lg ${
                          participante.ganador || seleccionado
                            ? "bg-[#4adea8] text-[#12201b] border-[#4adea8]"
                            : "bg-[#12201b] text-[#4adea8] border-[#2d463b]"
                        }`}
                      >
                        {participante.ganador || seleccionado
                          ? "✓"
                          : `${participante.nombre[0]}${participante.apellido[0]}`}
                      </div>

                      <div>
                        <h3 className="text-xl font-bold">
                          {participante.nombre} {participante.apellido}
                        </h3>

                        <p className="text-gray-400 text-sm">
                          Alumno #{participante.alumnoId}
                        </p>
                      </div>
                    </div>

                    {participante.ganador ? (
                      <span className="px-3 py-1 rounded-full bg-[#4adea8]/10 text-[#4adea8] border border-[#4adea8]/30 text-xs font-bold">
                        Ganador
                      </span>
                    ) : seleccionado ? (
                      <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 text-xs font-bold">
                        Seleccionado
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-300 border border-yellow-500/30 text-xs font-bold">
                        Pendiente
                      </span>
                    )}
                  </div>

                  <div className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-4">
                    <p className="text-sm text-gray-400">Resultado</p>

                    <p className="font-semibold mt-1">
                      {participante.resultado ?? "Sin resultado registrado"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>

      {confirmando && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] px-4">
          <div className="w-full max-w-lg bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-7 shadow-2xl">
            <h2 className="text-2xl font-bold mb-2">
              Confirmar ganadores
            </h2>

            <p className="text-gray-400 mb-6">
              Se marcarán {seleccionados.length} alumno
              {seleccionados.length === 1 ? "" : "s"} como ganador
              {seleccionados.length === 1 ? "" : "es"}.
            </p>

            <div className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-5 mb-6 space-y-2 text-sm text-gray-300">
              <p>✔ Se generarán los beneficios configurados.</p>
              <p>✔ Se enviarán notificaciones a los alumnos.</p>
              <p>✔ Se registrará auditoría del administrador.</p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                disabled={guardando}
                onClick={() => setConfirmando(false)}
                className="px-5 py-3 rounded-xl bg-[#12201b] border border-[#2d463b] hover:border-[#4adea8] disabled:opacity-60"
              >
                Cancelar
              </button>

              <button
                disabled={guardando}
                onClick={confirmarGanadores}
                className="px-5 py-3 rounded-xl bg-[#4adea8] text-[#12201b] font-bold hover:opacity-90 disabled:opacity-60"
              >
                {guardando ? "Confirmando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ResumenCard({ titulo, valor }: { titulo: string; valor: number }) {
  return (
    <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6">
      <p className="text-sm text-gray-400">{titulo}</p>
      <h2 className="text-4xl font-bold mt-3">{valor}</h2>
    </div>
  );
}

function BotonFiltro({
  texto,
  activo,
  onClick,
}: {
  texto: string;
  activo: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-5 py-3 rounded-xl border font-semibold transition-all ${
        activo
          ? "bg-[#4adea8] text-[#12201b] border-[#4adea8]"
          : "bg-[#12201b] text-gray-300 border-[#2d463b] hover:border-[#4adea8]"
      }`}
    >
      {texto}
    </button>
  );
}