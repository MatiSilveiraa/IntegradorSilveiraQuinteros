import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

import TopBar from "../components/navigation/DashboardTopBar";
import FullScreenLoading from "../components/FullScreenSpinner";
import ResumenCard from "../components/ui/ResumenCard";

import { obtenerGrupoPorId } from "../services/Grupo.Service";
import {
  eliminarClase,
  cambiarEstadoClase,
} from "../services/Clase.Service";

import type { Clase, Grupo, EstadoClaseValor } from "../types";

type FiltroEstadoClase =
  | "todos"
  | "programada"
  | "realizada"
  | "cancelada"
  | "suspendida";

type FiltroTipoClase = "todas" | "fijas" | "puntuales";

type FiltroOcupacion =
  | "todas"
  | "con-cupo"
  | "completas";

const diasSemana = [
  { valor: 1, texto: "Lunes" },
  { valor: 2, texto: "Martes" },
  { valor: 3, texto: "Miércoles" },
  { valor: 4, texto: "Jueves" },
  { valor: 5, texto: "Viernes" },
  { valor: 6, texto: "Sábado" },
  { valor: 7, texto: "Domingo" },
];

const ordenDias: Record<string, number> = {
  Lunes: 1,
  Martes: 2,
  Miércoles: 3,
  Miercoles: 3,
  Jueves: 4,
  Viernes: 5,
  Sábado: 6,
  Sabado: 6,
  Domingo: 7,
};

const estadosClase = [
  { valor: 0, texto: "Programada" },
  { valor: 1, texto: "Realizada" },
  { valor: 2, texto: "Cancelada" },
  { valor: 3, texto: "Suspendida" },
];

export default function AdminGrupoDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const grupoId = Number(id);

  const [grupo, setGrupo] = useState<Grupo | null>(null);
  const [loading, setLoading] = useState(true);

  const [claseAEliminar, setClaseAEliminar] =
    useState<Clase | null>(null);

  const [claseCambioEstado, setClaseCambioEstado] =
    useState<Clase | null>(null);

  const [estadoNuevo, setEstadoNuevo] =
    useState<EstadoClaseValor>(0);

  const [motivoEstado, setMotivoEstado] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] =
    useState<FiltroEstadoClase>("todos");
  const [filtroTipo, setFiltroTipo] =
    useState<FiltroTipoClase>("todas");
  const [filtroOcupacion, setFiltroOcupacion] =
    useState<FiltroOcupacion>("todas");

  const cargarDatos = async () => {
    try {
      setLoading(true);

      const data = await obtenerGrupoPorId(grupoId);

      setGrupo(data);
    } catch (error: any) {
      console.error(error);

      toast.error(
        error.response?.data?.mensaje ??
          "No fue posible cargar el grupo"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!grupoId) return;

    cargarDatos();
  }, [grupoId]);

  const formatearDia = (dia: string | number) => {
    const numero = Number(dia);

    const encontrado = diasSemana.find(
      (d) => d.valor === numero
    );

    return encontrado?.texto ?? String(dia);
  };

  const formatearFecha = (fecha?: string | null) => {
    if (!fecha) return "-";

    return new Date(fecha).toLocaleDateString("es-UY", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatearHora = (hora?: string) => {
    if (!hora) return "--:--";

    const coincidencia = hora.match(/^(\d{1,2}):(\d{2})/);

    if (!coincidencia) {
      return "--:--";
    }

    return `${coincidencia[1].padStart(
      2,
      "0",
    )}:${coincidencia[2]}`;
  };

  const convertirHoraAMinutos = (hora?: string) => {
    if (!hora) return Number.MAX_SAFE_INTEGER;

    const coincidencia = hora.match(/^(\d{1,2}):(\d{2})/);

    if (!coincidencia) {
      return Number.MAX_SAFE_INTEGER;
    }

    return (
      Number(coincidencia[1]) * 60 +
      Number(coincidencia[2])
    );
  };

  const clases = useMemo(() => {
    return [...(grupo?.clases ?? [])].sort((a, b) => {
      const diaA =
        ordenDias[formatearDia(a.diaSemana)] ??
        Number(a.diaSemana);

      const diaB =
        ordenDias[formatearDia(b.diaSemana)] ??
        Number(b.diaSemana);

      if (diaA !== diaB) {
        return diaA - diaB;
      }

      const horaA = convertirHoraAMinutos(a.horaInicio);
      const horaB = convertirHoraAMinutos(b.horaInicio);

      if (horaA !== horaB) {
        return horaA - horaB;
      }

      return a.id - b.id;
    });
  }, [grupo]);

  const clasesFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return clases.filter((clase) => {
      const estado = clase.estado?.toUpperCase() ?? "";
      const dia = formatearDia(clase.diaSemana).toLowerCase();
      const horario = `${formatearHora(
        clase.horaInicio,
      )} ${formatearHora(clase.horaFin)}`.toLowerCase();

      if (
        filtroEstado !== "todos" &&
        estado !== filtroEstado.toUpperCase()
      ) {
        return false;
      }

      if (filtroTipo === "fijas" && !clase.esFija) {
        return false;
      }

      if (filtroTipo === "puntuales" && clase.esFija) {
        return false;
      }

      const ocupados = clase.cantidadInscriptos ?? 0;
      const cupo = clase.cupoMaximo ?? 0;

      if (
        filtroOcupacion === "con-cupo" &&
        cupo > 0 &&
        ocupados >= cupo
      ) {
        return false;
      }

      if (
        filtroOcupacion === "completas" &&
        (cupo === 0 || ocupados < cupo)
      ) {
        return false;
      }

      if (!termino) {
        return true;
      }

      return [dia, horario, clase.estado, clase.esFija ? "fija" : "puntual"]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(termino);
    });
  }, [
    clases,
    busqueda,
    filtroEstado,
    filtroTipo,
    filtroOcupacion,
  ]);

  const limpiarFiltros = () => {
    setBusqueda("");
    setFiltroEstado("todos");
    setFiltroTipo("todas");
    setFiltroOcupacion("todas");
  };

  const hayFiltrosActivos =
    Boolean(busqueda.trim()) ||
    filtroEstado !== "todos" ||
    filtroTipo !== "todas" ||
    filtroOcupacion !== "todas";

  const resumen = useMemo(() => {
    const alumnosInscriptos = clases.reduce(
      (total, clase) =>
        total + (clase.cantidadInscriptos ?? 0),
      0
    );

    return {
      total: clases.length,
      programadas: clases.filter(
        (c) => c.estado?.toUpperCase() === "PROGRAMADA"
      ).length,
      suspendidas: clases.filter(
        (c) => c.estado?.toUpperCase() === "SUSPENDIDA"
      ).length,
      alumnosInscriptos,
    };
  }, [clases]);

  const obtenerEstadoClase = (estado?: string) => {
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

  const abrirCambioEstado = (clase: Clase) => {
    setClaseCambioEstado(clase);

    const estadoActual =
      estadosClase.find(
        (e) =>
          e.texto.toUpperCase() ===
          clase.estado?.toUpperCase(),
      )?.valor ?? 0;

    setEstadoNuevo(estadoActual as EstadoClaseValor);
    setMotivoEstado("");
  };

  const guardarCambioEstado = async () => {
    if (!claseCambioEstado) return;

    try {
      await cambiarEstadoClase(claseCambioEstado.id, {
        estado: estadoNuevo,
        motivo: motivoEstado || undefined,
      });

      toast.success("Estado actualizado correctamente");

      setClaseCambioEstado(null);
      cargarDatos();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error.response?.data?.mensaje ??
          "No fue posible cambiar el estado"
      );
    }
  };

  const confirmarEliminarClase = async () => {
    if (!claseAEliminar) return;

    try {
      await eliminarClase(claseAEliminar.id);

      toast.success("Clase eliminada correctamente");

      setClaseAEliminar(null);
      cargarDatos();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error.response?.data?.mensaje ??
          "No fue posible eliminar la clase"
      );
    }
  };

  if (loading) {
    return <FullScreenLoading />;
  }

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      <TopBar />

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-10">

        <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-7 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
            <div>
              <h1 className="text-4xl font-bold">
                {grupo?.nombre ?? "Detalle del grupo"}
              </h1>

              <p className="text-gray-400 mt-2">
                Nivel{" "}
                <span className="text-white font-semibold">
                  {grupo?.nivel}
                </span>
              </p>
            </div>

            <button
              onClick={() =>
                navigate(`/admin/clases/nueva?grupoId=${grupoId}`)
              }
              className="px-6 py-3 rounded-xl bg-[#4adea8] text-[#12201b] font-bold hover:opacity-90 flex items-center justify-center gap-2"
            >
              <AddOutlinedIcon />
              Nueva clase
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <ResumenCard titulo="Total" valor={resumen.total} />
          <ResumenCard titulo="Programadas" valor={resumen.programadas} />
          <ResumenCard titulo="Suspendidas" valor={resumen.suspendidas} />
          <ResumenCard titulo="Inscriptos" valor={resumen.alumnosInscriptos} />
        </div>

        {clases.length > 0 && (
          <section className="mb-8 rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-4 sm:p-5">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px_220px]">
              <div className="relative">
                <SearchOutlinedIcon
                  sx={{
                    color: "#9ca3af",
                    position: "absolute",
                    left: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />

                <input
                  type="text"
                  value={busqueda}
                  onChange={(event) =>
                    setBusqueda(event.target.value)
                  }
                  placeholder="Buscar por día, horario, estado o tipo..."
                  className="h-12 w-full rounded-2xl border border-[#2d463b] bg-[#12201b] pl-12 pr-12 outline-none transition-all focus:border-[#4adea8]"
                />

                {busqueda && (
                  <button
                    type="button"
                    onClick={() => setBusqueda("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    aria-label="Limpiar búsqueda"
                  >
                    <ClearOutlinedIcon fontSize="small" />
                  </button>
                )}
              </div>

              <select
                value={filtroTipo}
                onChange={(event) =>
                  setFiltroTipo(
                    event.target.value as FiltroTipoClase,
                  )
                }
                className="h-12 rounded-2xl border border-[#2d463b] bg-[#12201b] px-4 outline-none transition-all focus:border-[#4adea8]"
              >
                <option value="todas">Todos los tipos</option>
                <option value="fijas">Clases fijas</option>
                <option value="puntuales">Clases puntuales</option>
              </select>

              <select
                value={filtroOcupacion}
                onChange={(event) =>
                  setFiltroOcupacion(
                    event.target.value as FiltroOcupacion,
                  )
                }
                className="h-12 rounded-2xl border border-[#2d463b] bg-[#12201b] px-4 outline-none transition-all focus:border-[#4adea8]"
              >
                <option value="todas">Cualquier ocupación</option>
                <option value="con-cupo">Con lugares disponibles</option>
                <option value="completas">Clases completas</option>
              </select>
            </div>

            <div className="mt-4 flex flex-col gap-4 border-t border-[#2d463b] pt-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                <FiltroEstadoBoton
                  activo={filtroEstado === "todos"}
                  texto="Todas"
                  onClick={() => setFiltroEstado("todos")}
                />

                <FiltroEstadoBoton
                  activo={filtroEstado === "programada"}
                  texto="Programadas"
                  onClick={() => setFiltroEstado("programada")}
                />

                <FiltroEstadoBoton
                  activo={filtroEstado === "realizada"}
                  texto="Realizadas"
                  onClick={() => setFiltroEstado("realizada")}
                />

                <FiltroEstadoBoton
                  activo={filtroEstado === "suspendida"}
                  texto="Suspendidas"
                  onClick={() => setFiltroEstado("suspendida")}
                />

                <FiltroEstadoBoton
                  activo={filtroEstado === "cancelada"}
                  texto="Canceladas"
                  onClick={() => setFiltroEstado("cancelada")}
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-gray-400">
                  {clasesFiltradas.length}{" "}
                  {clasesFiltradas.length === 1
                    ? "clase encontrada"
                    : "clases encontradas"}
                </span>

                {hayFiltrosActivos && (
                  <button
                    type="button"
                    onClick={limpiarFiltros}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#2d463b] bg-[#12201b] px-4 text-sm font-semibold text-[#4adea8] hover:border-[#4adea8]"
                  >
                    <ClearOutlinedIcon fontSize="small" />
                    Limpiar
                  </button>
                )}
              </div>
            </div>
          </section>
        )}

        {clases.length === 0 ? (
          <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-10 text-center">
            <h2 className="text-2xl font-bold mb-2">
              Este grupo no tiene clases
            </h2>

            <p className="text-gray-400 mb-6">
              Agregá una clase para comenzar a usar el grupo.
            </p>

            <button
              onClick={() =>
                navigate(`/admin/clases/nueva?grupoId=${grupoId}`)
              }
              className="px-6 py-3 rounded-xl bg-[#4adea8] text-[#12201b] font-bold"
            >
              Crear clase
            </button>
          </div>
        ) : clasesFiltradas.length === 0 ? (
          <div className="rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-10 text-center">
            <h2 className="text-2xl font-bold">
              No hay clases que coincidan
            </h2>

            <p className="mt-2 text-gray-400">
              Probá cambiar la búsqueda o alguno de los filtros.
            </p>

            <button
              type="button"
              onClick={limpiarFiltros}
              className="mt-6 rounded-xl bg-[#4adea8] px-5 py-3 font-bold text-[#12201b]"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {clasesFiltradas.map((clase) => {
              const ocupados =
                clase.cantidadInscriptos ?? 0;

              const disponibles =
                clase.cupoMaximo - ocupados;

              return (
                <div
                  key={clase.id}
                  className="flex h-full flex-col bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-5 hover:border-[#4adea8]/40 transition-all"
                >
                  <span
                    className={`inline-block px-3 py-1 rounded-full border text-xs font-bold mb-4 ${obtenerEstadoClase(
                      clase.estado
                    )}`}
                  >
                    {clase.estado}
                  </span>

                  <p className="text-sm text-gray-400 mb-1">
                    Clase del día
                  </p>

                  <h2 className="text-2xl font-bold">
                    {formatearDia(clase.diaSemana)}
                  </h2>

                  <p className="text-gray-400 mt-2">
                    {formatearHora(clase.horaInicio)} -{" "}
                    {formatearHora(clase.horaFin)}
                  </p>

                  <div className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-4 my-4">
                    <p className="text-sm text-gray-400">
                      Alumnos inscriptos
                    </p>

                    <p className="text-3xl font-bold text-[#4adea8] mt-2">
                      {ocupados}/{clase.cupoMaximo}
                    </p>

                    <p className="text-sm text-gray-500 mt-2">
                      {disponibles} lugares disponibles
                    </p>
                  </div>

                  <div className="space-y-3 mb-5">

                    <DetalleLinea
                      icono="📅"
                      titulo="Vigencia"
                      valor={`${formatearFecha(
                        clase.fechaInicio
                      )} - ${formatearFecha(clase.fechaFin)}`}
                    />

                    <DetalleLinea
                      icono="🔁"
                      titulo="Tipo"
                      valor={
                        clase.esFija
                          ? "Clase fija"
                          : "Clase puntual"
                      }
                    />
                  </div>

                  <div className="mt-auto grid grid-cols-1 gap-3 pt-1">
                    <button
                      onClick={() =>
                        navigate(`/admin/clases/${clase.id}`)
                      }
                      className="py-3 rounded-xl bg-[#4adea8] text-[#12201b] font-bold hover:opacity-90 flex items-center justify-center gap-2"
                    >
                      <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                      Ver detalle
                    </button>

                    <button
                      onClick={() => abrirCambioEstado(clase)}
                      className="py-3 rounded-xl bg-[#12201b] border border-[#2d463b] hover:border-[#4adea8] font-semibold"
                    >
                      Cambiar estado
                    </button>

<button
  onClick={() => setClaseAEliminar(clase)}
  className="py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-semibold hover:border-red-400 flex items-center justify-center gap-2"
>
  <DeleteOutlineOutlinedIcon sx={{ fontSize: 18 }} />
  Eliminar clase
</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {claseCambioEstado && (
        <ModalEstadoClase
          estadoNuevo={estadoNuevo}
          setEstadoNuevo={setEstadoNuevo}
          motivoEstado={motivoEstado}
          setMotivoEstado={setMotivoEstado}
          onClose={() => setClaseCambioEstado(null)}
          onGuardar={guardarCambioEstado}
        />
      )}

      {claseAEliminar && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] px-4">
          <div className="w-full max-w-lg bg-[#1a2b24] border border-red-500/30 rounded-3xl p-7 shadow-2xl">
            <h2 className="text-2xl font-bold mb-2">
              Eliminar clase
            </h2>

            <p className="text-gray-400 mb-6">
              La clase dejará de estar disponible para nuevas operaciones.
            </p>

            <div className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-5 mb-6">
              <p className="text-gray-400 text-sm">Clase</p>

              <p className="font-bold mt-1">
                {formatearDia(claseAEliminar.diaSemana)}{" "}
                {formatearHora(claseAEliminar.horaInicio)} -{" "}
                {formatearHora(claseAEliminar.horaFin)}
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setClaseAEliminar(null)}
                className="px-5 py-3 rounded-xl bg-[#12201b] border border-[#2d463b] hover:border-[#4adea8]"
              >
                Cancelar
              </button>

              <button
                onClick={confirmarEliminarClase}
                className="px-5 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function FiltroEstadoBoton({
  activo,
  texto,
  onClick,
}: {
  activo: boolean;
  texto: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-10 rounded-xl border px-4 text-sm font-semibold transition-all ${
        activo
          ? "border-[#4adea8] bg-[#4adea8] text-[#12201b]"
          : "border-[#2d463b] bg-[#12201b] text-gray-300 hover:border-[#4adea8]"
      }`}
    >
      {texto}
    </button>
  );
}

function DetalleLinea({
  icono,
  titulo,
  valor,
}: {
  icono: string;
  titulo: string;
  valor: string;
}) {
  return (
    <div className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-4 flex gap-3">
      <div className="text-xl">{icono}</div>

      <div>
        <p className="text-sm text-gray-400">{titulo}</p>

        <p className="font-semibold mt-1">{valor}</p>
      </div>
    </div>
  );
}

function ModalEstadoClase({
  estadoNuevo,
  setEstadoNuevo,
  motivoEstado,
  setMotivoEstado,
  onClose,
  onGuardar,
}: {
  estadoNuevo: EstadoClaseValor;
  setEstadoNuevo: (value: EstadoClaseValor) => void;
  motivoEstado: string;
  setMotivoEstado: (value: string) => void;
  onClose: () => void;
  onGuardar: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] px-4">
      <div className="w-full max-w-lg bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-7 shadow-2xl">
        <h2 className="text-2xl font-bold mb-2">
          Cambiar estado
        </h2>

        <p className="text-gray-400 mb-6">
          Si suspendés o cancelás una clase, los alumnos inscriptos serán
          notificados.
        </p>

        <div className="space-y-4">
          <SelectCampo
            label="Nuevo estado"
            value={estadoNuevo}
            onChange={(value) =>
              setEstadoNuevo(Number(value) as EstadoClaseValor)
            }
            opciones={estadosClase}
          />

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Motivo opcional
            </label>

            <textarea
              rows={3}
              value={motivoEstado}
              onChange={(e) => setMotivoEstado(e.target.value)}
              placeholder="Ej: Se suspende por mal tiempo"
              className="w-full p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-7">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl bg-[#12201b] border border-[#2d463b] hover:border-[#4adea8]"
          >
            Cancelar
          </button>

          <button
            onClick={onGuardar}
            className="px-5 py-3 rounded-xl bg-[#4adea8] text-[#12201b] font-bold hover:opacity-90"
          >
            Guardar cambio
          </button>
        </div>
      </div>
    </div>
  );
}

function SelectCampo({
  label,
  value,
  onChange,
  opciones,
}: {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  opciones: { valor: string | number; texto: string }[];
}) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8]"
      >
        {opciones.map((opcion) => (
          <option key={opcion.valor} value={opcion.valor}>
            {opcion.texto}
          </option>
        ))}
      </select>
    </div>
  );
}