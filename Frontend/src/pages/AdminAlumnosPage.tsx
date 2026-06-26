import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  const [alumnoAEliminar, setAlumnoAEliminar] = useState<Alumno | null>(null);
  const [eliminando, setEliminando] = useState(false);

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroEspecial, setFiltroEspecial] = useState("todos");
  const [menuAbiertoId, setMenuAbiertoId] = useState<number | null>(null);

  const [searchParams] = useSearchParams();

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

  useEffect(() => {
    const filtro = searchParams.get("filtro");

    if (!filtro) return;

    switch (filtro) {
      case "cuotas-pendientes":
        setFiltroEspecial("cuotas-pendientes");
        break;

      case "bloqueados":
        setFiltroEspecial("bloqueados-inasistencias");
        break;

      case "deuda":
        setFiltroEspecial("bloqueados-deuda");
        break;

      case "racha":
        setFiltroEspecial("racha-alta");
        break;

      default:
        setFiltroEspecial("todos");
        break;
    }
  }, [searchParams]);

  const obtenerTextoFiltroEspecial = () => {
    if (filtroEspecial === "cuotas-pendientes") {
      return "Mostrando alumnos con cuotas pendientes";
    }

    if (filtroEspecial === "bloqueados-inasistencias") {
      return "Mostrando alumnos bloqueados por inasistencias";
    }

    if (filtroEspecial === "bloqueados-deuda") {
      return "Mostrando alumnos bloqueados por deuda";
    }

    if (filtroEspecial === "racha-alta") {
      return "Mostrando alumnos con racha alta";
    }

    return "";
  };

  const limpiarFiltroEspecial = () => {
    setFiltroEspecial("todos");
  };

  const verDetalle = async (alumnoId: number) => {
    try {
      setCargandoDetalle(true);
      setMenuAbiertoId(null);

      const data = await obtenerAlumno(alumnoId);
      setDetalle(data);
    } catch (error) {
      console.error(error);
      toast.error("No fue posible obtener el detalle del alumno");
    } finally {
      setCargandoDetalle(false);
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

  const obtenerGeneroTexto = (genero?: number) => {
    if (genero === 0) return "Masculino";
    if (genero === 1) return "Femenino";
    if (genero === 2) return "Otro";

    return "No especificado";
  };

  const formatearFecha = (fecha?: string) => {
    if (!fecha) return "No registrado";
    return new Date(fecha).toLocaleDateString("es-UY");
  };

  const formatearNumero = (valor?: number, decimales = 1) => {
    if (valor === undefined || valor === null) return "No registrado";
    return valor.toFixed(decimales);
  };

  const iniciales = (alumno: Alumno) => {
    return `${alumno.nombre?.charAt(0) ?? ""}${
      alumno.apellido?.charAt(0) ?? ""
    }`.toUpperCase();
  };

  const obtenerRacha = (alumno: Alumno) => {
    return alumno.rachaAsistenciaMensual ?? alumno.rachaMensual ?? 0;
  };

  const obtenerClases = (alumno: Alumno) => {
    return alumno.clasesInscriptas ?? alumno.cantidadClasesInscripto ?? 0;
  };

  const obtenerCuotasPendientes = (alumno: Alumno) => {
    return alumno.cuotasPendientes ?? 0;
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

        if (
          filtroEspecial === "bloqueados-inasistencias" &&
          !alumno.bloqueadoPorInasistencias
        ) {
          return false;
        }

        if (
          filtroEspecial === "bloqueados-deuda" &&
          !alumno.bloqueadoPorDeuda
        ) {
          return false;
        }

        if (
          filtroEspecial === "cuotas-pendientes" &&
          !(obtenerCuotasPendientes(alumno) > 0)
        ) {
          return false;
        }

        if (filtroEspecial === "racha-alta" && !(obtenerRacha(alumno) >= 5)) {
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
  }, [alumnos, busqueda, filtroEstado, filtroEspecial]);

  const totalActivos = alumnos.filter(
    (a) => a.estado?.toUpperCase() === "ACTIVO"
  ).length;

  const totalBloqueados = alumnos.filter(
    (a) => a.bloqueadoPorInasistencias || a.bloqueadoPorDeuda
  ).length;

  const totalCuotasPendientes = alumnos.filter(
    (a) => obtenerCuotasPendientes(a) > 0
  ).length;

  const totalRachaAlta = alumnos.filter((a) => obtenerRacha(a) >= 5).length;

  const promedioRacha =
    alumnos.length === 0
      ? 0
      : Math.round(
          alumnos.reduce((total, alumno) => total + obtenerRacha(alumno), 0) /
            alumnos.length
        );

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
            <p className="text-sm text-gray-400">⚠️ Bloqueos</p>
            <h2 className="text-4xl font-bold mt-3 text-yellow-300">
              {totalBloqueados}
            </h2>
            <p className="text-xs text-gray-500 mt-2">
              Por deuda o inasistencias
            </p>
          </div>

          <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6">
            <p className="text-sm text-gray-400">🔥 Promedio racha</p>
            <h2 className="text-4xl font-bold mt-3 text-orange-300">
              {promedioRacha}
            </h2>
            <p className="text-xs text-gray-500 mt-2">
              Asistencias mensuales promedio
            </p>
          </div>
        </div>

        {(totalCuotasPendientes > 0 ||
          totalBloqueados > 0 ||
          totalRachaAlta > 0) && (
          <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-5 mb-8">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-bold">Centro de alertas</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Indicadores rápidos para revisar alumnos que requieren atención.
                </p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <button
                type="button"
                onClick={() => setFiltroEspecial("cuotas-pendientes")}
                className="text-left bg-[#12201b] border border-red-500/30 rounded-2xl p-4 hover:border-red-400 transition-all"
              >
                <p className="text-red-400 font-bold">💰 Cuotas pendientes</p>
                <p className="text-sm text-gray-400 mt-1">
                  {totalCuotasPendientes} alumno
                  {totalCuotasPendientes === 1 ? "" : "s"} con deuda.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setFiltroEspecial("bloqueados-inasistencias")}
                className="text-left bg-[#12201b] border border-yellow-500/30 rounded-2xl p-4 hover:border-yellow-300 transition-all"
              >
                <p className="text-yellow-300 font-bold">⚠️ Bloqueos</p>
                <p className="text-sm text-gray-400 mt-1">
                  {totalBloqueados} alumno{totalBloqueados === 1 ? "" : "s"}{" "}
                  con bloqueo.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setFiltroEspecial("racha-alta")}
                className="text-left bg-[#12201b] border border-orange-500/30 rounded-2xl p-4 hover:border-orange-300 transition-all"
              >
                <p className="text-orange-300 font-bold">🔥 Racha alta</p>
                <p className="text-sm text-gray-400 mt-1">
                  {totalRachaAlta} alumno{totalRachaAlta === 1 ? "" : "s"} con
                  racha de 5 o más.
                </p>
              </button>
            </div>
          </div>
        )}

        <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-5 mb-8">
          <div className="grid lg:grid-cols-[1fr_auto_auto] gap-4">
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
              <option value="todos">Todos los estados</option>
              <option value="ACTIVO">Activos</option>
              <option value="BLOQUEADO">Bloqueados</option>
              <option value="INACTIVO">Inactivos</option>
            </select>

            <select
              value={filtroEspecial}
              onChange={(e) => setFiltroEspecial(e.target.value)}
              className="p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8]"
            >
              <option value="todos">Todos</option>
              <option value="bloqueados-inasistencias">
                Bloqueados por inasistencias
              </option>
              <option value="bloqueados-deuda">Bloqueados por deuda</option>
              <option value="cuotas-pendientes">Con cuotas pendientes</option>
              <option value="racha-alta">Racha alta</option>
            </select>
          </div>
        </div>

        {filtroEspecial !== "todos" && (
          <div className="mb-8 rounded-3xl border border-[#4adea8]/30 bg-[#4adea8]/10 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-[#4adea8] font-bold">
                {obtenerTextoFiltroEspecial()}
              </p>

              <p className="text-sm text-gray-400 mt-1">
                Se muestran {alumnosFiltrados.length} alumno
                {alumnosFiltrados.length === 1 ? "" : "s"} según el filtro aplicado.
              </p>
            </div>

            <button
              type="button"
              onClick={limpiarFiltroEspecial}
              className="px-4 py-2 rounded-xl bg-[#12201b] border border-[#2d463b] text-[#4adea8] hover:border-[#4adea8]"
            >
              Quitar filtro
            </button>
          </div>
        )}

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
          <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl overflow-visible">
            <div className="px-6 py-5 border-b border-[#2d463b] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold">Listado de alumnos</h2>
                <p className="text-sm text-gray-400 mt-1">
                  {alumnosFiltrados.length} alumno
                  {alumnosFiltrados.length === 1 ? "" : "s"} encontrado
                  {alumnosFiltrados.length === 1 ? "" : "s"}
                </p>
              </div>

              {filtroEspecial !== "todos" && (
                <button
                  type="button"
                  onClick={limpiarFiltroEspecial}
                  className="px-4 py-2 rounded-xl bg-[#12201b] border border-[#2d463b] text-[#4adea8] hover:border-[#4adea8]"
                >
                  Limpiar alerta
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#12201b] text-gray-400 text-sm">
                  <tr>
                    <th className="px-6 py-4">👤 Alumno</th>
                    <th className="px-6 py-4">📈 Actividad</th>
                    <th className="px-6 py-4">💰 Situación</th>
                    <th className="px-6 py-4">🚫 Bloqueos</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {alumnosFiltrados.map((alumno) => {
                    const racha = obtenerRacha(alumno);
                    const clases = obtenerClases(alumno);
                    const cuotas = obtenerCuotasPendientes(alumno);
                    const tieneBloqueos =
                      alumno.bloqueadoPorDeuda ||
                      alumno.bloqueadoPorInasistencias;

                    return (
                      <tr
                        key={alumno.id}
                        className="border-t border-[#2d463b] hover:bg-[#4adea8]/5 transition-all"
                      >
                        <td className="px-6 py-4 min-w-[280px]">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-[#4adea8]/10 border border-[#4adea8]/30 text-[#4adea8] flex items-center justify-center font-bold">
                              {iniciales(alumno)}
                            </div>

                            <div>
                              <p className="font-bold text-white">
                                {alumno.nombre} {alumno.apellido}
                              </p>
                              <p className="text-sm text-gray-400">
                                {alumno.email}
                              </p>
                              <p className="text-xs text-[#4adea8] mt-1">
                                Alumno registrado
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 min-w-[190px]">
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-300 border border-orange-500/30 text-xs font-semibold">
                              🔥 Racha {racha}
                            </span>

                            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 text-xs font-semibold">
                              📚 {clases} clase{clases === 1 ? "" : "s"}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 min-w-[150px]">
                          {cuotas > 0 ? (
                            <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-semibold">
                              💳 {cuotas} pendiente{cuotas === 1 ? "" : "s"}
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-[#4adea8]/10 text-[#4adea8] border border-[#4adea8]/30 text-xs font-semibold">
                              💰 Al día
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 min-w-[170px]">
                          {tieneBloqueos ? (
                            <div className="flex flex-wrap gap-2">
                              {alumno.bloqueadoPorDeuda && (
                                <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-semibold">
                                  Deuda
                                </span>
                              )}

                              {alumno.bloqueadoPorInasistencias && (
                                <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-300 border border-yellow-500/30 text-xs font-semibold">
                                  Inasistencias
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500">
                              Sin bloqueos
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 min-w-[120px]">
                          <span
                            className={`px-3 py-1 rounded-full border text-xs font-semibold ${obtenerEstadoClase(
                              alumno.estado
                            )}`}
                          >
                            {alumno.estado ?? "Sin estado"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right relative min-w-[90px]">
                          <button
                            type="button"
                            onClick={() =>
                              setMenuAbiertoId((prev) =>
                                prev === alumno.id ? null : alumno.id
                              )
                            }
                            className="px-4 py-2 rounded-xl bg-[#12201b] border border-[#2d463b] hover:border-[#4adea8] transition-all text-xl leading-none"
                          >
                            ⋮
                          </button>

                          {menuAbiertoId === alumno.id && (
                            <div className="absolute right-6 top-14 z-20 w-52 bg-[#12201b] border border-[#2d463b] rounded-2xl shadow-2xl overflow-hidden text-left">
                              <button
                                type="button"
                                onClick={() => verDetalle(alumno.id)}
                                className="w-full px-4 py-3 text-sm hover:bg-[#4adea8]/10 text-white"
                              >
                                Ver detalle
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setAlumnoAEliminar(alumno);
                                  setMenuAbiertoId(null);
                                }}
                                className="w-full px-4 py-3 text-sm hover:bg-red-500/10 text-red-400 border-t border-[#2d463b]"
                              >
                                Eliminar alumno
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {cargandoDetalle && <FullScreenLoading />}

      {detalle && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] px-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-7 shadow-2xl">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#4adea8]/10 border border-[#4adea8]/30 text-[#4adea8] flex items-center justify-center text-2xl font-bold">
                  {iniciales(detalle)}
                </div>

                <div>
                  <h2 className="text-3xl font-bold">
                    {detalle.nombre} {detalle.apellido}
                  </h2>

                  <p className="text-gray-400 mt-1">{detalle.email}</p>
                </div>
              </div>

              <button
                onClick={() => setDetalle(null)}
                className="px-4 py-2 rounded-xl bg-[#12201b] border border-[#2d463b] hover:border-[#4adea8]"
              >
                Cerrar
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-5">
                <p className="text-gray-400 text-sm">🔥 Racha mensual</p>

                <h3 className="text-3xl font-bold mt-2 text-orange-300">
                  {obtenerRacha(detalle)}
                </h3>
              </div>

              <div className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-5">
                <p className="text-gray-400 text-sm">📚 Clases inscripto</p>

                <h3 className="text-3xl font-bold mt-2">
                  {obtenerClases(detalle)}
                </h3>
              </div>

              <div className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-5">
                <p className="text-gray-400 text-sm">💰 Cuotas pendientes</p>

                <h3
                  className={`text-3xl font-bold mt-2 ${
                    obtenerCuotasPendientes(detalle) > 0
                      ? "text-red-400"
                      : "text-[#4adea8]"
                  }`}
                >
                  {obtenerCuotasPendientes(detalle)}
                </h3>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-5">
              <section className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-5">
                <h3 className="text-xl font-bold mb-4">
                  Información personal
                </h3>

                <div className="space-y-3 text-sm">
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
                    <span className="text-gray-400">Celular:</span>{" "}
                    <strong>{detalle.celular ?? "No registrado"}</strong>
                  </p>

                  <p>
                    <span className="text-gray-400">Fecha nacimiento:</span>{" "}
                    <strong>{formatearFecha(detalle.fechaNacimiento)}</strong>
                  </p>

                  <p>
                    <span className="text-gray-400">Género:</span>{" "}
                    <strong>{obtenerGeneroTexto(detalle.genero)}</strong>
                  </p>
                </div>
              </section>

              <section className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-5">
                <h3 className="text-xl font-bold mb-4">Salud</h3>

                <div className="space-y-3 text-sm">
                  <p>
                    <span className="text-gray-400">Sociedad médica:</span>{" "}
                    <strong>
                      {detalle.sociedadMedica ?? "No registrada"}
                    </strong>
                  </p>

                  <p>
                    <span className="text-gray-400">Peso:</span>{" "}
                    <strong>
                      {detalle.peso
                        ? `${formatearNumero(detalle.peso)} kg`
                        : "No registrado"}
                    </strong>
                  </p>

                  <p>
                    <span className="text-gray-400">Estatura:</span>{" "}
                    <strong>
                      {detalle.estatura
                        ? `${formatearNumero(detalle.estatura, 2)} m`
                        : "No registrada"}
                    </strong>
                  </p>

                  <p>
                    <span className="text-gray-400">IMC:</span>{" "}
                    <strong>{formatearNumero(detalle.imc)}</strong>
                  </p>
                </div>
              </section>

              <section className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-5">
                <h3 className="text-xl font-bold mb-4">Estado y bloqueos</h3>

                <div className="space-y-3 text-sm">
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

                  <p>
                    <span className="text-gray-400">Bloqueo por deuda:</span>{" "}
                    <strong>{detalle.bloqueadoPorDeuda ? "Sí" : "No"}</strong>
                  </p>

                  <p>
                    <span className="text-gray-400">
                      Bloqueo por inasistencias:
                    </span>{" "}
                    <strong>
                      {detalle.bloqueadoPorInasistencias ? "Sí" : "No"}
                    </strong>
                  </p>
                </div>
              </section>

              <section className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-5">
                <h3 className="text-xl font-bold mb-4">Seguridad</h3>

                <div className="space-y-3 text-sm">
                  <p>
                    <span className="text-gray-400">2FA:</span>{" "}
                    <strong>
                      {detalle.twoFactorEnabled ? "Activado" : "Desactivado"}
                    </strong>
                  </p>
                </div>
              </section>
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
