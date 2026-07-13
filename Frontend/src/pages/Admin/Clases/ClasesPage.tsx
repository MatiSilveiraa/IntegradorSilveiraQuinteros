import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import TopBar from "../../../components/navigation/DashboardTopBar";
import FullScreenLoading from "../../../components/FullScreenSpinner";
import ClassLocationMap from "../../../components/maps/ClassLocationMap";

import {
  obtenerClases,
  eliminarClase,
  cambiarEstadoClase,
} from "../../../services/Clase.Service";

import type { Clase, EstadoClaseValor } from "../../../types";

export default function ClasesPage() {
  const navigate = useNavigate();

  const [clases, setClases] = useState<Clase[]>([]);
  const [loading, setLoading] = useState(true);

  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<
    "todas" | "fijas" | "eventuales"
  >("todas");

  const [claseAEliminar, setClaseAEliminar] = useState<Clase | null>(null);
  const [eliminando, setEliminando] = useState(false);

  const [claseUbicacion, setClaseUbicacion] = useState<Clase | null>(null);

  const [claseEstado, setClaseEstado] = useState<Clase | null>(null);
  const [nuevoEstado, setNuevoEstado] = useState<EstadoClaseValor>(0);
  const [motivoEstado, setMotivoEstado] = useState("");
  const [cambiandoEstado, setCambiandoEstado] = useState(false);

  const cargarClases = async () => {
    try {
      setLoading(true);
      const data = await obtenerClases();
      setClases(data);
    } catch (error) {
      console.error(error);
      toast.error("No se pudieron cargar las clases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClases();
  }, []);

  const formatearHora = (hora: string) => {
    if (!hora) return "-";
    return hora.substring(0, 5);
  };

  const ordenDias: Record<string, number> = {
    Domingo: 0,
    Lunes: 1,
    Martes: 2,
    Miércoles: 3,
    Miercoles: 3,
    Jueves: 4,
    Viernes: 5,
    Sábado: 6,
    Sabado: 6,
  };

  const obtenerNombreGrupo = (clase: Clase) => {
    return clase.grupoNombre ?? `Grupo #${clase.grupoId}`;
  };

  const obtenerValorEstado = (estado?: string): EstadoClaseValor => {
    const normalizado = estado?.toUpperCase();

    if (normalizado === "PROGRAMADA") return 0;
    if (normalizado === "REALIZADA") return 1;
    if (normalizado === "CANCELADA") return 2;
    if (normalizado === "SUSPENDIDA") return 3;

    return 0;
  };

  const obtenerTextoEstado = (estado?: string) => {
    const normalizado = estado?.toUpperCase();

    if (normalizado === "PROGRAMADA") return "🟢 Programada";
    if (normalizado === "REALIZADA") return "✅ Realizada";
    if (normalizado === "CANCELADA") return "🔴 Cancelada";
    if (normalizado === "SUSPENDIDA") return "🟡 Suspendida";

    return estado ?? "Sin estado";
  };

  const obtenerClaseEstado = (estado?: string) => {
    const normalizado = estado?.toUpperCase();

    if (normalizado === "PROGRAMADA") {
      return "bg-[#4adea8]/10 text-[#4adea8] border-[#4adea8]/30";
    }

    if (normalizado === "REALIZADA") {
      return "bg-blue-500/10 text-blue-300 border-blue-500/30";
    }

    if (normalizado === "CANCELADA") {
      return "bg-red-500/10 text-red-400 border-red-500/30";
    }

    if (normalizado === "SUSPENDIDA") {
      return "bg-yellow-500/10 text-yellow-300 border-yellow-500/30";
    }

    return "bg-[#12201b] text-gray-300 border-[#2d463b]";
  };

  const abrirModalEstado = (clase: Clase) => {
    setClaseEstado(clase);
    setNuevoEstado(obtenerValorEstado(clase.estado));
    setMotivoEstado("");
  };

  const confirmarCambiarEstado = async () => {
    if (!claseEstado) return;

    try {
      setCambiandoEstado(true);

      await cambiarEstadoClase(claseEstado.id, {
        estado: nuevoEstado,
        motivo: motivoEstado.trim() || undefined,
      });

      toast.success("Estado de clase actualizado correctamente");

      setClaseEstado(null);
      setMotivoEstado("");
      cargarClases();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error.response?.data?.mensaje ?? "No se pudo cambiar el estado",
      );
    } finally {
      setCambiandoEstado(false);
    }
  };

  const clasesFiltradas = useMemo(() => {
    return clases
      .filter((clase) => {
        if (filtroTipo === "fijas" && !clase.esFija) return false;
        if (filtroTipo === "eventuales" && clase.esFija) return false;

        const texto = `${obtenerNombreGrupo(clase)} ${clase.diaSemana} ${
          clase.estado ?? ""
        }`.toLowerCase();

        return texto.includes(busqueda.toLowerCase());
      })
      .sort((a, b) => {
        const diaA = ordenDias[a.diaSemana] ?? 99;
        const diaB = ordenDias[b.diaSemana] ?? 99;

        if (diaA !== diaB) return diaA - diaB;

        return formatearHora(a.horaInicio).localeCompare(
          formatearHora(b.horaInicio),
        );
      });
  }, [clases, busqueda, filtroTipo]);

  const clasesAgrupadas = useMemo(() => {
    return clasesFiltradas.reduce<Record<string, Clase[]>>((acc, clase) => {
      const dia = clase.diaSemana || "Sin día";

      if (!acc[dia]) acc[dia] = [];

      acc[dia].push(clase);

      return acc;
    }, {});
  }, [clasesFiltradas]);

  const totalProgramadas = clases.filter(
    (c) => c.estado?.toUpperCase() === "PROGRAMADA",
  ).length;

  const totalFijas = clases.filter((c) => c.esFija).length;
  const totalEventuales = clases.filter((c) => !c.esFija).length;

  const confirmarEliminar = async () => {
    if (!claseAEliminar) return;

    try {
      setEliminando(true);

      await eliminarClase(claseAEliminar.id);

      toast.success("Clase eliminada correctamente");

      setClaseAEliminar(null);
      cargarClases();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error.response?.data?.mensaje ?? "No se pudo eliminar la clase",
      );
    } finally {
      setEliminando(false);
    }
  };

  if (loading) {
    return <FullScreenLoading />;
  }

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      <TopBar />

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-10">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <button
              onClick={() => navigate("/admin")}
              className="text-[#4adea8] hover:underline mb-4"
            >
              ← Volver al panel
            </button>

            <h1 className="text-4xl font-bold">Gestionar Clases</h1>

            <p className="text-gray-400 mt-2">
              Clases organizadas por día, horario, grupo y estado.
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/clases/nueva")}
            className="px-6 py-3 rounded-xl bg-[#4adea8] text-[#12201b] font-bold hover:opacity-90"
          >
            + Nueva Clase
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-5">
            <p className="text-gray-400 text-sm">Total clases</p>
            <h2 className="text-3xl font-bold mt-2">{clases.length}</h2>
          </div>

          <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-5">
            <p className="text-gray-400 text-sm">Programadas</p>
            <h2 className="text-3xl font-bold mt-2">{totalProgramadas}</h2>
          </div>

          <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-5">
            <p className="text-gray-400 text-sm">Recurrentes</p>
            <h2 className="text-3xl font-bold mt-2">{totalFijas}</h2>
          </div>

          <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-5">
            <p className="text-gray-400 text-sm">Puntuales</p>
            <h2 className="text-3xl font-bold mt-2">{totalEventuales}</h2>
          </div>
        </div>

        <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-5 mb-8">
          <div className="grid md:grid-cols-[1fr_auto] gap-4">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por grupo, día o estado..."
              className="w-full p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8]"
            />

            <select
              value={filtroTipo}
              onChange={(e) =>
                setFiltroTipo(
                  e.target.value as "todas" | "fijas" | "eventuales",
                )
              }
              className="p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8]"
            >
              <option value="todas">Todas</option>
              <option value="fijas">Recurrentes</option>
              <option value="eventuales">Puntuales</option>
            </select>
          </div>
        </div>

        {clases.length === 0 ? (
          <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-10 text-center">
            <h2 className="text-2xl font-bold mb-2">
              No hay clases registradas
            </h2>

            <p className="text-gray-400 mb-6">
              Creá la primera clase para comenzar a organizar los horarios.
            </p>

            <button
              onClick={() => navigate("/admin/clases/nueva")}
              className="px-6 py-3 rounded-xl bg-[#4adea8] text-[#12201b] font-bold"
            >
              Crear Clase
            </button>
          </div>
        ) : clasesFiltradas.length === 0 ? (
          <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-10 text-center">
            <h2 className="text-2xl font-bold mb-2">
              No se encontraron clases
            </h2>

            <p className="text-gray-400">
              Probá cambiar la búsqueda o el filtro seleccionado.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(clasesAgrupadas)
              .sort(([diaA], [diaB]) => {
                return (ordenDias[diaA] ?? 99) - (ordenDias[diaB] ?? 99);
              })
              .map(([dia, clasesDia]) => (
                <section
                  key={dia}
                  className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl overflow-hidden"
                >
                  <div className="px-6 py-5 border-b border-[#2d463b] flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">{dia}</h2>

                      <p className="text-sm text-gray-400 mt-1">
                        {clasesDia.length} clase
                        {clasesDia.length === 1 ? "" : "s"} programada
                        {clasesDia.length === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-[#12201b] text-gray-400 text-sm">
                        <tr>
                          <th className="px-6 py-4">Horario</th>
                          <th className="px-6 py-4">Grupo</th>
                          <th className="px-6 py-4">Entrenadores</th>
                          <th className="px-6 py-4">Tipo</th>
                          <th className="px-6 py-4">Cupo</th>
                          <th className="px-6 py-4">Inscriptos</th>
                          <th className="px-6 py-4">Radio</th>
                          <th className="px-6 py-4">Estado</th>
                          <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                      </thead>

                      <tbody>
                        {clasesDia.map((clase) => (
                          <tr
                            key={clase.id}
                            className="border-t border-[#2d463b] hover:bg-[#4adea8]/5 transition-all"
                          >
                            <td className="px-6 py-4">
                              <p className="font-bold text-[#4adea8]">
                                {formatearHora(clase.horaInicio)} -{" "}
                                {formatearHora(clase.horaFin)}
                              </p>
                            </td>

                            <td className="px-6 py-4">
                              <p className="font-semibold">
                                {obtenerNombreGrupo(clase)}
                              </p>
                            </td>

                            <td className="px-6 py-4">
                              {clase.entrenadores.length === 0 ? (
                                <span className="text-gray-500">
                                  Sin asignar
                                </span>
                              ) : (
                                <div className="flex flex-wrap gap-2">
                                  {clase.entrenadores.map((nombre) => (
                                    <span
                                      key={nombre}
                                      className="px-2 py-1 rounded-full bg-[#4adea8]/10 text-[#4adea8] text-xs"
                                    >
                                      {nombre}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </td>

                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  clase.esFija
                                    ? "bg-[#4adea8]/10 text-[#4adea8]"
                                    : "bg-blue-500/10 text-blue-300"
                                }`}
                              >
                                {clase.esFija ? "🔁 Recurrente" : "📅 Puntual"}
                              </span>
                            </td>

                            <td className="px-6 py-4">
                              {clase.cupoMaximo ?? 0}
                            </td>

                            <td className="px-6 py-4">
                              <span
                                className={
                                  clase.cantidadInscriptos &&
                                  clase.cupoMaximo &&
                                  clase.cantidadInscriptos >= clase.cupoMaximo
                                    ? "text-red-400 font-bold"
                                    : ""
                                }
                              >
                                {clase.cantidadInscriptos ?? 0}
                              </span>
                            </td>

                            <td className="px-6 py-4">
                              {clase.radioGeolocalizacion ?? 0} m
                            </td>

                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full border text-xs font-semibold ${obtenerClaseEstado(
                                  clase.estado,
                                )}`}
                              >
                                {obtenerTextoEstado(clase.estado)}
                              </span>
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => setClaseUbicacion(clase)}
                                  className="px-4 py-2 rounded-xl bg-[#12201b] border border-[#2d463b] hover:border-[#4adea8] transition-all"
                                >
                                  Ubicación
                                </button>

                                <button
                                  onClick={() => abrirModalEstado(clase)}
                                  className="px-4 py-2 rounded-xl bg-[#12201b] border border-[#2d463b] hover:border-yellow-400 transition-all"
                                >
                                  Estado
                                </button>

                                <button
                                  onClick={() =>
                                    navigate(`/admin/clases/editar/${clase.id}`)
                                  }
                                  className="px-4 py-2 rounded-xl bg-[#12201b] border border-[#2d463b] hover:border-[#4adea8] transition-all"
                                >
                                  Editar
                                </button>

                                <button
                                  onClick={() => setClaseAEliminar(clase)}
                                  className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:border-red-400 transition-all"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ))}
          </div>
        )}
      </main>

      {claseEstado && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] px-4">
          <div className="w-full max-w-lg bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-7 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-3xl mb-5">
              ⚙️
            </div>

            <h2 className="text-2xl font-bold mb-2">Cambiar estado de clase</h2>

            <p className="text-gray-400 mb-6">
              Modificá el estado de la clase. Si corresponde, los alumnos
              inscriptos recibirán una notificación automática.
            </p>

            <div className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-5 mb-6 space-y-2">
              <p>
                <span className="text-gray-400">Grupo:</span>{" "}
                <strong>{obtenerNombreGrupo(claseEstado)}</strong>
              </p>

              <p>
                <span className="text-gray-400">Día:</span>{" "}
                <strong>{claseEstado.diaSemana}</strong>
              </p>

              <p>
                <span className="text-gray-400">Horario:</span>{" "}
                <strong>
                  {formatearHora(claseEstado.horaInicio)} -{" "}
                  {formatearHora(claseEstado.horaFin)}
                </strong>
              </p>

              <p>
                <span className="text-gray-400">Estado actual:</span>{" "}
                <strong>{obtenerTextoEstado(claseEstado.estado)}</strong>
              </p>
            </div>

            <div className="mb-5">
              <label className="block mb-2 text-sm text-gray-300">
                Nuevo estado
              </label>

              <select
                value={nuevoEstado}
                onChange={(e) =>
                  setNuevoEstado(Number(e.target.value) as EstadoClaseValor)
                }
                className="w-full p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8]"
              >
                <option value={0}>Programada</option>
                <option value={1}>Realizada</option>
                <option value={2}>Cancelada</option>
                <option value={3}>Suspendida</option>
              </select>
            </div>

            {(nuevoEstado === 0 || nuevoEstado === 2 || nuevoEstado === 3) && (
              <div className="mb-6">
                <label className="block mb-2 text-sm text-gray-300">
                  Motivo opcional
                </label>

                <textarea
                  value={motivoEstado}
                  onChange={(e) => setMotivoEstado(e.target.value)}
                  placeholder={
                    nuevoEstado === 3
                      ? "Ej: Se suspende por lluvia."
                      : nuevoEstado === 2
                        ? "Ej: Se cancela por falta de disponibilidad."
                        : "Ej: Se retoma normalmente."
                  }
                  rows={4}
                  className="w-full p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8] resize-none"
                />
              </div>
            )}

            {(nuevoEstado === 0 || nuevoEstado === 2 || nuevoEstado === 3) && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 mb-6 text-yellow-200 text-sm">
                ⚠ Al guardar este cambio, los alumnos inscriptos serán
                notificados automáticamente.
              </div>
            )}

            {nuevoEstado === 1 && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 mb-6 text-blue-200 text-sm">
                ℹ Al marcar la clase como realizada, el backend no enviará
                notificaciones automáticas.
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setClaseEstado(null)}
                disabled={cambiandoEstado}
                className="px-5 py-3 rounded-xl bg-[#12201b] border border-[#2d463b] hover:border-[#4adea8] disabled:opacity-60"
              >
                Cancelar
              </button>

              <button
                onClick={confirmarCambiarEstado}
                disabled={cambiandoEstado}
                className="px-5 py-3 rounded-xl bg-[#4adea8] text-[#12201b] font-bold hover:opacity-90 disabled:opacity-60"
              >
                {cambiandoEstado ? "Guardando..." : "Guardar estado"}
              </button>
            </div>
          </div>
        </div>
      )}

      {claseAEliminar && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] px-4">
          <div className="w-full max-w-lg bg-[#1a2b24] border border-red-500/30 rounded-3xl p-7 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-3xl mb-5">
              🗑️
            </div>

            <h2 className="text-2xl font-bold mb-2">Eliminar clase</h2>

            <p className="text-gray-400 mb-6">
              ¿Estás seguro de que querés eliminar esta clase? Esta acción no se
              puede deshacer.
            </p>

            <div className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-5 mb-6 space-y-2">
              <p>
                <span className="text-gray-400">Grupo:</span>{" "}
                <strong>{obtenerNombreGrupo(claseAEliminar)}</strong>
              </p>

              <p>
                <span className="text-gray-400">Día:</span>{" "}
                <strong>{claseAEliminar.diaSemana}</strong>
              </p>

              <p>
                <span className="text-gray-400">Horario:</span>{" "}
                <strong>
                  {formatearHora(claseAEliminar.horaInicio)} -{" "}
                  {formatearHora(claseAEliminar.horaFin)}
                </strong>
              </p>

              <p>
                <span className="text-gray-400">Inscriptos:</span>{" "}
                <strong>{claseAEliminar.cantidadInscriptos ?? 0}</strong>
              </p>
            </div>

            {(claseAEliminar.cantidadInscriptos ?? 0) > 0 && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 mb-6 text-yellow-200 text-sm">
                ⚠ Esta clase tiene alumnos inscriptos. Si la eliminás, podrían
                perder su inscripción a este horario.
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setClaseAEliminar(null)}
                disabled={eliminando}
                className="px-5 py-3 rounded-xl bg-[#12201b] border border-[#2d463b] hover:border-[#4adea8] disabled:opacity-60"
              >
                Cancelar
              </button>

              <button
                onClick={confirmarEliminar}
                disabled={eliminando}
                className="px-5 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 disabled:opacity-60"
              >
                {eliminando ? "Eliminando..." : "Eliminar clase"}
              </button>
            </div>
          </div>
        </div>
      )}

      {claseUbicacion && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] px-4">
          <div className="w-full max-w-3xl bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-7 shadow-2xl">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="text-2xl font-bold">Ubicación de la clase</h2>

                <p className="text-gray-400 mt-1">
                  {obtenerNombreGrupo(claseUbicacion)} ·{" "}
                  {claseUbicacion.diaSemana} ·{" "}
                  {formatearHora(claseUbicacion.horaInicio)} -{" "}
                  {formatearHora(claseUbicacion.horaFin)}
                </p>
              </div>

              <button
                onClick={() => setClaseUbicacion(null)}
                className="px-4 py-2 rounded-xl bg-[#12201b] border border-[#2d463b] hover:border-[#4adea8]"
              >
                Cerrar
              </button>
            </div>

            <ClassLocationMap
              latitud={claseUbicacion.latitud}
              longitud={claseUbicacion.longitud}
              radio={claseUbicacion.radioGeolocalizacion}
            />

            <p className="text-xs text-gray-500 mt-3">
              Coordenadas: {claseUbicacion.latitud.toFixed(6)},{" "}
              {claseUbicacion.longitud.toFixed(6)} · Radio:{" "}
              {claseUbicacion.radioGeolocalizacion} m
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
