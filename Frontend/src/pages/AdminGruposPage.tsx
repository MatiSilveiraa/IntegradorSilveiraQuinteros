import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import TopBar from "../components/navigation/DashboardTopBar";
import FullScreenLoading from "../components/FullScreenSpinner";
import FormInput from "../components/ui/FormInput";

import {
  crearGrupo,
  editarGrupo,
  eliminarGrupo,
  obtenerGrupos,
} from "../services/Grupo.Service";

import type { Grupo } from "../types";

type FiltroEstado = "todos" | "activos" | "inactivos";

const formInicial = {
  nombre: "",
  nivel: "",
};

export default function AdminGruposPage() {
  const navigate = useNavigate();

  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] = useState(false);

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] =
    useState<FiltroEstado>("todos");

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Grupo | null>(null);
  const [grupoAEliminar, setGrupoAEliminar] =
    useState<Grupo | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [eliminando, setEliminando] = useState(false);

  const [menuGrupoId, setMenuGrupoId] =
    useState<number | null>(null);

  const [form, setForm] = useState(formInicial);

  const cargarDatos = async (
    mostrarCargaCompleta = true,
  ) => {
    try {
      if (mostrarCargaCompleta) {
        setLoading(true);
      } else {
        setActualizando(true);
      }

      const data = await obtenerGrupos();

      setGrupos(Array.isArray(data) ? data : []);
    } catch (error: any) {
      if (!error?.response || error.response.status >= 500) {
        console.error("[Cargar grupos]", error);
      }

      toast.error(
        error?.response?.data?.mensaje ??
          "No fue posible cargar los grupos",
      );
    } finally {
      setLoading(false);
      setActualizando(false);
    }
  };

  useEffect(() => {
    void cargarDatos();
  }, []);

  const obtenerEstado = (grupo: Grupo) => {
    return grupo.estado ?? "ACTIVO";
  };

  const obtenerCantidadClases = (grupo: Grupo) => {
    if (grupo.cantidadClases !== undefined) {
      return grupo.cantidadClases;
    }

    return grupo.clases?.length ?? 0;
  };

  const abrirCrear = () => {
    setMenuGrupoId(null);
    setEditando(null);
    setForm(formInicial);
    setModalAbierto(true);
  };

  const abrirEditar = (grupo: Grupo) => {
    setMenuGrupoId(null);
    setEditando(grupo);

    setForm({
      nombre: grupo.nombre,
      nivel: grupo.nivel,
    });

    setModalAbierto(true);
  };

  const cerrarModal = () => {
    if (guardando) return;

    setModalAbierto(false);
    setEditando(null);
    setForm(formInicial);
  };

  const validar = () => {
    if (!form.nombre.trim()) {
      toast.error("El nombre es obligatorio");
      return false;
    }

    if (!form.nivel.trim()) {
      toast.error("El nivel es obligatorio");
      return false;
    }

    return true;
  };

  const guardar = async () => {
    if (!validar()) return;

    try {
      setGuardando(true);

      const payload = {
        nombre: form.nombre.trim(),
        nivel: form.nivel.trim(),
      };

      if (editando) {
        await editarGrupo(editando.id, payload);
        toast.success("Grupo actualizado correctamente");
      } else {
        await crearGrupo(payload);
        toast.success("Grupo creado correctamente");
      }

      cerrarModal();
      await cargarDatos(false);
    } catch (error: any) {
      if (!error?.response || error.response.status >= 500) {
        console.error("[Guardar grupo]", error);
      }

      toast.error(
        error?.response?.data?.mensaje ??
          "No fue posible guardar el grupo",
      );
    } finally {
      setGuardando(false);
    }
  };

  const confirmarEliminar = async () => {
    if (!grupoAEliminar) return;

    try {
      setEliminando(true);

      await eliminarGrupo(grupoAEliminar.id);

      toast.success("Grupo desactivado correctamente");

      setGrupoAEliminar(null);
      await cargarDatos(false);
    } catch (error: any) {
      if (!error?.response || error.response.status >= 500) {
        console.error("[Desactivar grupo]", error);
      }

      toast.error(
        error?.response?.data?.mensaje ??
          "No fue posible desactivar el grupo",
      );
    } finally {
      setEliminando(false);
    }
  };

  const gruposFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return [...grupos]
      .filter((grupo) => {
        const estado = obtenerEstado(grupo).toUpperCase();

        if (
          filtroEstado === "activos" &&
          estado !== "ACTIVO"
        ) {
          return false;
        }

        if (
          filtroEstado === "inactivos" &&
          estado !== "INACTIVO"
        ) {
          return false;
        }

        if (!termino) {
          return true;
        }

        return [
          grupo.nombre,
          grupo.nivel,
          estado,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(termino);
      })
      .sort((a, b) => {
        const estadoA =
          obtenerEstado(a).toUpperCase();
        const estadoB =
          obtenerEstado(b).toUpperCase();

        if (estadoA !== estadoB) {
          return estadoA === "ACTIVO" ? -1 : 1;
        }

        return a.nombre.localeCompare(b.nombre, "es");
      });
  }, [grupos, busqueda, filtroEstado]);

  const resumen = useMemo(() => {
    const activos = grupos.filter(
      (grupo) =>
        obtenerEstado(grupo).toUpperCase() === "ACTIVO",
    ).length;

    const inactivos = grupos.filter(
      (grupo) =>
        obtenerEstado(grupo).toUpperCase() ===
        "INACTIVO",
    ).length;

    const clases = grupos.reduce(
      (total, grupo) =>
        total + obtenerCantidadClases(grupo),
      0,
    );

    return {
      total: grupos.length,
      activos,
      inactivos,
      clases,
    };
  }, [grupos]);

  if (loading) {
    return <FullScreenLoading />;
  }

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      <TopBar />

      <main className="mx-auto w-full max-w-[1500px] px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            disabled={actualizando}
            onClick={() => void cargarDatos(false)}
            className="inline-flex h-10 w-fit items-center gap-2 rounded-xl border border-[#2d463b] bg-[#1a2b24] px-4 text-sm font-semibold text-gray-300 transition-all hover:border-[#4adea8] hover:text-[#4adea8] disabled:opacity-50"
          >
            {actualizando ? "Actualizando..." : "Actualizar"}
          </button>
        </div>

        <section className="mb-8 rounded-3xl border border-[#4adea8]/20 bg-gradient-to-r from-[#1a2b24] to-[#163129] p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#4adea8]">
                Administración
              </p>

              <h1 className="mt-2 text-3xl font-bold md:text-4xl">
                Gestión de grupos
              </h1>

              <p className="mt-2 max-w-3xl text-gray-300">
                Organizá grupos, niveles y clases asociadas
                desde una vista clara y preparada para crecer.
              </p>
            </div>

            <button
              type="button"
              onClick={abrirCrear}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#4adea8] px-5 font-bold text-[#12201b] transition-all hover:brightness-110"
            >
              <AddOutlinedIcon fontSize="small" />
              Nuevo grupo
            </button>
          </div>
        </section>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ResumenGrupoCard
            titulo="Total"
            valor={resumen.total}
            descripcion="Grupos registrados"
            icono={<GroupsOutlinedIcon />}
          />

          <ResumenGrupoCard
            titulo="Activos"
            valor={resumen.activos}
            descripcion="Disponibles para operar"
            icono={<GroupsOutlinedIcon />}
          />

          <ResumenGrupoCard
            titulo="Inactivos"
            valor={resumen.inactivos}
            descripcion="Conservan su historial"
            icono={<GroupsOutlinedIcon />}
          />

          <ResumenGrupoCard
            titulo="Clases"
            valor={resumen.clases}
            descripcion="Asociadas a grupos"
            icono={<CalendarMonthOutlinedIcon />}
          />
        </section>

        <section className="mb-8 rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-4 sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
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
                placeholder="Buscar por nombre, nivel o estado..."
                className="h-12 w-full rounded-2xl border border-[#2d463b] bg-[#12201b] pl-12 pr-4 outline-none transition-all focus:border-[#4adea8]"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <FiltroBoton
                activo={filtroEstado === "todos"}
                texto="Todos"
                onClick={() => setFiltroEstado("todos")}
              />

              <FiltroBoton
                activo={filtroEstado === "activos"}
                texto="Activos"
                onClick={() => setFiltroEstado("activos")}
              />

              <FiltroBoton
                activo={filtroEstado === "inactivos"}
                texto="Inactivos"
                onClick={() => setFiltroEstado("inactivos")}
              />
            </div>
          </div>

          <p className="mt-4 border-t border-[#2d463b] pt-4 text-sm text-gray-400">
            {gruposFiltrados.length}{" "}
            {gruposFiltrados.length === 1
              ? "grupo encontrado"
              : "grupos encontrados"}
          </p>
        </section>

        {grupos.length === 0 ? (
          <EstadoVacio
            titulo="No hay grupos registrados"
            descripcion="Creá el primer grupo para comenzar a organizar las clases."
            accionTexto="Crear grupo"
            onAccion={abrirCrear}
          />
        ) : gruposFiltrados.length === 0 ? (
          <EstadoVacio
            titulo="No se encontraron grupos"
            descripcion="Probá cambiar la búsqueda o el filtro seleccionado."
          />
        ) : (
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {gruposFiltrados.map((grupo) => {
              const estado = obtenerEstado(grupo);
              const activo =
                estado.toUpperCase() === "ACTIVO";
              const cantidadClases =
                obtenerCantidadClases(grupo);

              return (
                <article
                  key={grupo.id}
                  className="relative flex min-h-[280px] flex-col overflow-visible rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-5 transition-all hover:-translate-y-1 hover:border-[#4adea8]/50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#4adea8]/20 bg-[#4adea8]/10">
                        <GroupsOutlinedIcon
                          sx={{ color: "#4adea8" }}
                        />
                      </div>

                      <div className="min-w-0">
                        <h2 className="break-words text-xl font-bold">
                          {grupo.nombre}
                        </h2>

                        <p className="mt-1 text-sm text-gray-400">
                          Nivel{" "}
                          <span className="font-semibold text-white">
                            {grupo.nivel}
                          </span>
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-bold uppercase ${
                        activo
                          ? "border-[#4adea8]/30 bg-[#4adea8]/10 text-[#4adea8]"
                          : "border-red-500/30 bg-red-500/10 text-red-400"
                      }`}
                    >
                      {activo ? "Activo" : "Inactivo"}
                    </span>
                  </div>

                  <div className="mt-5 rounded-2xl border border-[#2d463b] bg-[#12201b] p-4">
                    <div className="flex items-center gap-3">
                      <CalendarMonthOutlinedIcon
                        sx={{
                          color: "#4adea8",
                          fontSize: 22,
                        }}
                      />

                      <div>
                        <p className="text-sm font-semibold">
                          {cantidadClases}{" "}
                          {cantidadClases === 1
                            ? "clase asociada"
                            : "clases asociadas"}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {cantidadClases === 0
                            ? "Todavía no tiene horarios configurados"
                            : "Consultá horarios, alumnos y estado"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center gap-3 pt-5">
                    <button
                      type="button"
                      onClick={() =>
                        cantidadClases === 0
                          ? navigate(
                              `/admin/clases/nueva?grupoId=${grupo.id}`,
                            )
                          : navigate(
                              `/admin/grupos/${grupo.id}`,
                            )
                      }
                      className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#4adea8] font-bold text-[#12201b] transition-all hover:brightness-110"
                    >
                      {cantidadClases === 0 ? (
                        <>
                          <AddOutlinedIcon fontSize="small" />
                          Crear primera clase
                        </>
                      ) : (
                        <>
                          <VisibilityOutlinedIcon fontSize="small" />
                          Gestionar grupo
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setMenuGrupoId((actual) =>
                          actual === grupo.id
                            ? null
                            : grupo.id,
                        )
                      }
                      className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#2d463b] bg-[#12201b] transition-all hover:border-[#4adea8]"
                      aria-label={`Más acciones de ${grupo.nombre}`}
                    >
                      <MoreVertOutlinedIcon />
                    </button>
                  </div>

                  {menuGrupoId === grupo.id && (
  <div className="absolute bottom-20 right-5 z-50 w-56 overflow-hidden rounded-2xl border border-[#2d463b] bg-[#12201b] shadow-2xl">
                      <button
                        type="button"
                        onClick={() => {
                          setMenuGrupoId(null);
                          navigate(`/admin/grupos/${grupo.id}`);
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-[#4adea8]/10"
                      >
                        <VisibilityOutlinedIcon fontSize="small" />
                        Ver clases
                      </button>

                      <button
                        type="button"
                        onClick={() => abrirEditar(grupo)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-blue-500/10"
                      >
                        <EditOutlinedIcon fontSize="small" />
                        Editar grupo
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setMenuGrupoId(null);
                          navigate(
                            `/admin/clases/nueva?grupoId=${grupo.id}`,
                          );
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-[#4adea8]/10"
                      >
                        <AddOutlinedIcon fontSize="small" />
                        Crear clase
                      </button>

                      <button
                        type="button"
                        disabled={!activo}
                        onClick={() => {
                          setMenuGrupoId(null);
                          setGrupoAEliminar(grupo);
                        }}
                        className="flex w-full items-center gap-3 border-t border-[#2d463b] px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <DeleteOutlineOutlinedIcon fontSize="small" />
                        Desactivar grupo
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </section>
        )}
      </main>

      {modalAbierto && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <section className="w-full max-w-lg rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-7 shadow-2xl">
            <h2 className="text-2xl font-bold">
              {editando ? "Editar grupo" : "Nuevo grupo"}
            </h2>

            <p className="mt-2 text-gray-400">
              Definí el nombre y nivel del grupo.
            </p>

            <div className="mt-6 space-y-4">
              <FormInput
                label="Nombre"
                value={form.nombre}
                onChange={(value) =>
                  setForm({
                    ...form,
                    nombre: value,
                  })
                }
                placeholder="Ej: Funcional Mañana"
              />

              <FormInput
                label="Nivel"
                value={form.nivel}
                onChange={(value) =>
                  setForm({
                    ...form,
                    nivel: value,
                  })
                }
                placeholder="Ej: Inicial, Intermedio, Avanzado"
              />
            </div>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                onClick={cerrarModal}
                disabled={guardando}
                className="rounded-xl border border-[#2d463b] bg-[#12201b] px-5 py-3 disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={guardar}
                disabled={guardando}
                className="rounded-xl bg-[#4adea8] px-5 py-3 font-bold text-[#12201b] disabled:opacity-50"
              >
                {guardando ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </section>
        </div>
      )}

      {grupoAEliminar && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <section className="w-full max-w-lg rounded-3xl border border-red-500/30 bg-[#1a2b24] p-7 shadow-2xl">
            <h2 className="text-2xl font-bold">
              Desactivar grupo
            </h2>

            <p className="mt-2 text-gray-400">
              El grupo no se eliminará físicamente. Pasará a
              estado inactivo y conservará su historial.
            </p>

            <div className="mt-6 rounded-2xl border border-[#2d463b] bg-[#12201b] p-5">
              <p className="text-sm text-gray-400">
                Grupo
              </p>

              <p className="mt-1 font-bold">
                {grupoAEliminar.nombre}
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setGrupoAEliminar(null)}
                disabled={eliminando}
                className="rounded-xl border border-[#2d463b] bg-[#12201b] px-5 py-3 disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmarEliminar}
                disabled={eliminando}
                className="rounded-xl bg-red-500 px-5 py-3 font-bold text-white disabled:opacity-50"
              >
                {eliminando
                  ? "Desactivando..."
                  : "Desactivar"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function ResumenGrupoCard({
  titulo,
  valor,
  descripcion,
  icono,
}: {
  titulo: string;
  valor: number;
  descripcion: string;
  icono: React.ReactNode;
}) {
  return (
    <article className="rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-5">
      <div className="text-[#4adea8]">{icono}</div>

      <p className="mt-4 text-sm text-gray-400">
        {titulo}
      </p>

      <p className="mt-1 text-3xl font-bold">
        {valor}
      </p>

      <p className="mt-2 text-xs text-gray-500">
        {descripcion}
      </p>
    </article>
  );
}

function FiltroBoton({
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
      className={`h-11 rounded-xl border px-5 text-sm font-semibold transition-all ${
        activo
          ? "border-[#4adea8] bg-[#4adea8] text-[#12201b]"
          : "border-[#2d463b] bg-[#12201b] text-gray-300 hover:border-[#4adea8]"
      }`}
    >
      {texto}
    </button>
  );
}

function EstadoVacio({
  titulo,
  descripcion,
  accionTexto,
  onAccion,
}: {
  titulo: string;
  descripcion: string;
  accionTexto?: string;
  onAccion?: () => void;
}) {
  return (
    <section className="rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-10 text-center">
      <GroupsOutlinedIcon
        sx={{
          color: "#4adea8",
          fontSize: 56,
        }}
      />

      <h2 className="mt-4 text-2xl font-bold">
        {titulo}
      </h2>

      <p className="mt-2 text-gray-400">
        {descripcion}
      </p>

      {accionTexto && onAccion && (
        <button
          type="button"
          onClick={onAccion}
          className="mt-6 rounded-xl bg-[#4adea8] px-5 py-3 font-bold text-[#12201b]"
        >
          {accionTexto}
        </button>
      )}
    </section>
  );
}
