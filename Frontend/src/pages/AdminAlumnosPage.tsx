import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  obtenerAlumnos,
  obtenerAlumno,
  eliminarAlumno,
} from "../services/AdminAlumno.Service";

import type { Alumno } from "../types";
import FullScreenLoading from "../components/FullScreenSpinner";
import TopBar from "../components/navigation/DashboardTopBar";

export default function AdminAlumnosPage() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [loading, setLoading] = useState(true);

  const [detalle, setDetalle] = useState<Alumno | null>(null);
  const [alumnoAEliminar, setAlumnoAEliminar] = useState<Alumno | null>(null);
  const [eliminando, setEliminando] = useState(false);

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const data = await obtenerAlumnos();
      setAlumnos(data);
    } catch (error) {
      console.error(error);
      toast.error("No fue posible cargar los alumnos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const verDetalle = async (alumnoId: number) => {
    try {
      const data = await obtenerAlumno(alumnoId);
      setDetalle(data);
    } catch (error) {
      console.error(error);
      toast.error("No fue posible obtener el detalle del alumno");
    }
  };

  const confirmarEliminar = async () => {
    if (!alumnoAEliminar) return;

    try {
      setEliminando(true);

      await eliminarAlumno(alumnoAEliminar.id);

      toast.success("Alumno eliminado correctamente");

      setAlumnoAEliminar(null);
      cargarDatos();
    } catch (error) {
      console.error(error);
      toast.error("No fue posible eliminar el alumno");
    } finally {
      setEliminando(false);
    }
  };

  const obtenerEstadoClase = (estado?: string) => {
    const normalizado = estado?.toUpperCase();

    if (normalizado === "ACTIVO") {
      return "bg-[#4adea8]/10 text-[#4adea8] border-[#4adea8]/30";
    }

    if (normalizado === "BLOQUEADO") {
      return "bg-yellow-500/10 text-yellow-300 border-yellow-500/30";
    }

    if (normalizado === "INACTIVO") {
      return "bg-gray-500/10 text-gray-300 border-gray-500/30";
    }

    return "bg-[#12201b] text-gray-300 border-[#2d463b]";
  };

  const alumnosFiltrados = useMemo(() => {
    return alumnos
      .filter((alumno) => {
        if (
          filtroEstado !== "todos" &&
          alumno.estado?.toUpperCase() !== filtroEstado
        ) {
          return false;
        }

        const texto = `${alumno.nombre} ${alumno.apellido} ${alumno.email} ${
          alumno.estado ?? ""
        }`.toLowerCase();

        return texto.includes(busqueda.toLowerCase());
      })
      .sort((a, b) => {
        const nombreA = `${a.nombre} ${a.apellido}`.toLowerCase();
        const nombreB = `${b.nombre} ${b.apellido}`.toLowerCase();

        return nombreA.localeCompare(nombreB);
      });
  }, [alumnos, busqueda, filtroEstado]);

  const totalActivos = alumnos.filter(
    (a) => a.estado?.toUpperCase() === "ACTIVO"
  ).length;

  const totalBloqueados = alumnos.filter(
    (a) => a.estado?.toUpperCase() === "BLOQUEADO"
  ).length;

  const totalInactivos = alumnos.filter(
    (a) => a.estado?.toUpperCase() === "INACTIVO"
  ).length;

  if (loading) {
    return <FullScreenLoading />;
  }

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      <TopBar />

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Alumnos</h1>

          <p className="text-gray-400 mt-2">
            Gestión de alumnos registrados en Joki.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
          <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6">
            <p className="text-sm text-gray-400">Total de alumnos</p>

            <h2 className="text-4xl font-bold mt-3">{alumnos.length}</h2>

            <p className="text-xs text-gray-500 mt-2">
              Alumnos registrados en el sistema
            </p>
          </div>

          <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6">
            <p className="text-sm text-gray-400">🟢 Activos</p>

            <h2 className="text-4xl font-bold mt-3 text-[#4adea8]">
              {totalActivos}
            </h2>

            <p className="text-xs text-gray-500 mt-2">
              Pueden usar la plataforma
            </p>
          </div>

          <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6">
            <p className="text-sm text-gray-400">🟡 Bloqueados</p>

            <h2 className="text-4xl font-bold mt-3 text-yellow-300">
              {totalBloqueados}
            </h2>

            <p className="text-xs text-gray-500 mt-2">
              Requieren revisión del admin
            </p>
          </div>

          <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6">
            <p className="text-sm text-gray-400">⚪ Inactivos</p>

            <h2 className="text-4xl font-bold mt-3 text-gray-300">
              {totalInactivos}
            </h2>

            <p className="text-xs text-gray-500 mt-2">
              Sin actividad actual
            </p>
          </div>
        </div>

        <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-5 mb-8">
          <div className="grid md:grid-cols-[1fr_auto] gap-4">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, apellido, email o estado..."
              className="w-full p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8]"
            />

            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8]"
            >
              <option value="todos">Todos</option>
              <option value="ACTIVO">Activos</option>
              <option value="BLOQUEADO">Bloqueados</option>
              <option value="INACTIVO">Inactivos</option>
            </select>
          </div>
        </div>

        {alumnos.length === 0 ? (
          <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-10 text-center">
            <h2 className="text-2xl font-bold mb-2">
              No hay alumnos registrados
            </h2>

            <p className="text-gray-400">
              Cuando se registren alumnos, aparecerán en esta pantalla.
            </p>
          </div>
        ) : alumnosFiltrados.length === 0 ? (
          <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-10 text-center">
            <h2 className="text-2xl font-bold mb-2">
              No se encontraron alumnos
            </h2>

            <p className="text-gray-400">
              Probá cambiar la búsqueda o el filtro seleccionado.
            </p>
          </div>
        ) : (
          <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl overflow-hidden">
            <div className="px-6 py-5 border-b border-[#2d463b]">
              <h2 className="text-2xl font-bold">Listado de alumnos</h2>

              <p className="text-sm text-gray-400 mt-1">
                {alumnosFiltrados.length} alumno
                {alumnosFiltrados.length === 1 ? "" : "s"} encontrado
                {alumnosFiltrados.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#12201b] text-gray-400 text-sm">
                  <tr>
                    <th className="px-6 py-4">Alumno</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {alumnosFiltrados.map((alumno) => (
                    <tr
                      key={alumno.id}
                      className="border-t border-[#2d463b] hover:bg-[#4adea8]/5 transition-all"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-[#4adea8]/10 border border-[#4adea8]/30 text-[#4adea8] flex items-center justify-center font-bold">
                            {alumno.nombre?.charAt(0)}
                            {alumno.apellido?.charAt(0)}
                          </div>

                          <div>
                            <p className="font-bold">
                              {alumno.nombre} {alumno.apellido}
                            </p>

                            <p className="text-xs text-gray-500">
                              ID #{alumno.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-gray-300">
                        {alumno.email}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full border text-xs font-semibold ${obtenerEstadoClase(
                            alumno.estado
                          )}`}
                        >
                          {alumno.estado ?? "Sin estado"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => verDetalle(alumno.id)}
                            className="px-4 py-2 rounded-xl bg-[#12201b] border border-[#2d463b] hover:border-[#4adea8] transition-all"
                          >
                            Ver
                          </button>

                          <button
                            onClick={() => setAlumnoAEliminar(alumno)}
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
          </div>
        )}
      </main>

      {detalle && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] px-4">
          <div className="w-full max-w-lg bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-7 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-[#4adea8]/10 border border-[#4adea8]/30 flex items-center justify-center text-[#4adea8] text-xl font-bold mb-5">
              {detalle.nombre?.charAt(0)}
              {detalle.apellido?.charAt(0)}
            </div>

            <h2 className="text-2xl font-bold mb-2">
              {detalle.nombre} {detalle.apellido}
            </h2>

            <p className="text-gray-400 mb-6">Detalle del alumno seleccionado.</p>

            <div className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-5 mb-6 space-y-3">
              <p>
                <span className="text-gray-400">Nombre:</span>{" "}
                <strong>{detalle.nombre}</strong>
              </p>

              <p>
                <span className="text-gray-400">Apellido:</span>{" "}
                <strong>{detalle.apellido}</strong>
              </p>

              <p>
                <span className="text-gray-400">Email:</span>{" "}
                <strong>{detalle.email}</strong>
              </p>

              <p>
                <span className="text-gray-400">Estado:</span>{" "}
                <span
                  className={`px-3 py-1 rounded-full border text-xs font-semibold ${obtenerEstadoClase(
                    detalle.estado
                  )}`}
                >
                  {detalle.estado ?? "Sin estado"}
                </span>
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setDetalle(null)}
                className="px-5 py-3 rounded-xl bg-[#4adea8] text-[#12201b] font-bold hover:opacity-90"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {alumnoAEliminar && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] px-4">
          <div className="w-full max-w-lg bg-[#1a2b24] border border-red-500/30 rounded-3xl p-7 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-3xl mb-5">
              🗑️
            </div>

            <h2 className="text-2xl font-bold mb-2">Eliminar alumno</h2>

            <p className="text-gray-400 mb-6">
              ¿Estás seguro de que querés eliminar este alumno? Esta acción no
              se puede deshacer.
            </p>

            <div className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-5 mb-6 space-y-2">
              <p>
                <span className="text-gray-400">Alumno:</span>{" "}
                <strong>
                  {alumnoAEliminar.nombre} {alumnoAEliminar.apellido}
                </strong>
              </p>

              <p>
                <span className="text-gray-400">Email:</span>{" "}
                <strong>{alumnoAEliminar.email}</strong>
              </p>

              <p>
                <span className="text-gray-400">Estado:</span>{" "}
                <strong>{alumnoAEliminar.estado}</strong>
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setAlumnoAEliminar(null)}
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
                {eliminando ? "Eliminando..." : "Eliminar alumno"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}