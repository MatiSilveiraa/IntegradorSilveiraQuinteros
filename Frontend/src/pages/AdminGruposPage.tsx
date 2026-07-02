import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

import TopBar from "../components/navigation/DashboardTopBar";
import FullScreenLoading from "../components/FullScreenSpinner";
import ResumenCard from "../components/ui/ResumenCard";
import FormInput from "../components/ui/FormInput";

import {
  obtenerGrupos,
  crearGrupo,
  editarGrupo,
  eliminarGrupo,
} from "../services/Grupo.Service";

import type { Grupo } from "../types";

const formInicial = {
  nombre: "",
  nivel: "",
};

export default function AdminGruposPage() {
  const navigate = useNavigate();

  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Grupo | null>(null);
  const [grupoAEliminar, setGrupoAEliminar] = useState<Grupo | null>(null);

  const [form, setForm] = useState(formInicial);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      const data = await obtenerGrupos();

      setGrupos(data);
    } catch (error) {
      console.error(error);
      toast.error("No fue posible cargar los grupos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
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
    setEditando(null);
    setForm(formInicial);
    setModalAbierto(true);
  };

  const abrirEditar = (grupo: Grupo) => {
    setEditando(grupo);

    setForm({
      nombre: grupo.nombre,
      nivel: grupo.nivel,
    });

    setModalAbierto(true);
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
      if (editando) {
        await editarGrupo(editando.id, {
          nombre: form.nombre,
          nivel: form.nivel,
        });

        toast.success("Grupo actualizado correctamente");
      } else {
        await crearGrupo({
          nombre: form.nombre,
          nivel: form.nivel,
        });

        toast.success("Grupo creado correctamente");
      }

      setModalAbierto(false);
      cargarDatos();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error.response?.data?.mensaje ?? "No fue posible guardar el grupo"
      );
    }
  };

  const confirmarEliminar = async () => {
    if (!grupoAEliminar) return;

    try {
      await eliminarGrupo(grupoAEliminar.id);

      toast.success("Grupo desactivado correctamente");

      setGrupoAEliminar(null);
      cargarDatos();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error.response?.data?.mensaje ?? "No fue posible desactivar el grupo"
      );
    }
  };

  const resumen = useMemo(() => {
    const activos = grupos.filter(
      (g) => obtenerEstado(g).toUpperCase() === "ACTIVO"
    ).length;

    const inactivos = grupos.filter(
      (g) => obtenerEstado(g).toUpperCase() === "INACTIVO"
    ).length;

    const clases = grupos.reduce(
      (total, grupo) => total + obtenerCantidadClases(grupo),
      0
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

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold">Grupos</h1>

            <p className="text-gray-400 mt-2">
              Gestioná las propuestas de entrenamiento y sus clases asociadas.
            </p>
          </div>

          <button
            onClick={abrirCrear}
            className="px-6 py-3 rounded-xl bg-[#4adea8] text-[#12201b] font-bold hover:opacity-90 flex items-center justify-center gap-2"
          >
            <AddOutlinedIcon />
            Nuevo grupo
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <ResumenCard titulo="Total" valor={resumen.total} />
          <ResumenCard titulo="Activos" valor={resumen.activos} />
          <ResumenCard titulo="Inactivos" valor={resumen.inactivos} />
          <ResumenCard titulo="Clases" valor={resumen.clases} />
        </div>

        {grupos.length === 0 ? (
          <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-10 text-center">
            <GroupsOutlinedIcon sx={{ fontSize: 60, color: "#4adea8" }} />

            <h2 className="text-2xl font-bold mt-4 mb-2">
              No hay grupos registrados
            </h2>

            <p className="text-gray-400 mb-6">
              Creá el primer grupo para comenzar a organizar las clases.
            </p>

            <button
              onClick={abrirCrear}
              className="px-6 py-3 rounded-xl bg-[#4adea8] text-[#12201b] font-bold"
            >
              Crear grupo
            </button>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {grupos.map((grupo) => {
              const estado = obtenerEstado(grupo);
              const activo = estado.toUpperCase() === "ACTIVO";

              return (
                <div
                  key={grupo.id}
                  className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6 hover:border-[#4adea8]/40 transition-all"
                >
                  <span
                    className={`inline-block px-3 py-1 rounded-full border text-xs font-bold mb-4 ${
                      activo
                        ? "bg-[#4adea8]/10 text-[#4adea8] border-[#4adea8]/30"
                        : "bg-red-500/10 text-red-400 border-red-500/30"
                    }`}
                  >
                    {activo ? "Activo" : "Inactivo"}
                  </span>

                  <h2 className="text-2xl font-bold">{grupo.nombre}</h2>

                  <p className="text-gray-400 mt-2">
                    Nivel:{" "}
                    <span className="text-white font-semibold">
                      {grupo.nivel}
                    </span>
                  </p>

                  <div className="mt-5 bg-[#12201b] border border-[#2d463b] rounded-2xl p-4">
                    <p className="text-sm text-gray-400">Clases asociadas</p>

                    <p className="text-3xl font-bold text-[#4adea8] mt-1">
                      {obtenerCantidadClases(grupo)}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 mt-5">
                    <button
                      onClick={() => navigate(`/admin/grupos/${grupo.id}`)}
                      className="py-3 rounded-xl bg-[#12201b] border border-[#2d463b] hover:border-[#4adea8] font-semibold flex items-center justify-center gap-2"
                    >
                      <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                      Ver clases
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => abrirEditar(grupo)}
                        className="py-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 font-semibold hover:border-blue-400 flex items-center justify-center gap-2"
                      >
                        <EditOutlinedIcon sx={{ fontSize: 18 }} />
                        Editar
                      </button>

                      <button
                        disabled={!activo}
                        onClick={() => setGrupoAEliminar(grupo)}
                        className="py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-semibold hover:border-red-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <DeleteOutlineOutlinedIcon sx={{ fontSize: 18 }} />
                        Desactivar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {modalAbierto && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] px-4">
          <div className="w-full max-w-lg bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-7 shadow-2xl">
            <h2 className="text-2xl font-bold mb-2">
              {editando ? "Editar grupo" : "Nuevo grupo"}
            </h2>

            <p className="text-gray-400 mb-6">
              Definí el nombre y nivel del grupo.
            </p>

            <div className="space-y-4">
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

            <div className="flex justify-end gap-3 mt-7">
              <button
                onClick={() => setModalAbierto(false)}
                className="px-5 py-3 rounded-xl bg-[#12201b] border border-[#2d463b] hover:border-[#4adea8]"
              >
                Cancelar
              </button>

              <button
                onClick={guardar}
                className="px-5 py-3 rounded-xl bg-[#4adea8] text-[#12201b] font-bold hover:opacity-90"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {grupoAEliminar && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] px-4">
          <div className="w-full max-w-lg bg-[#1a2b24] border border-red-500/30 rounded-3xl p-7 shadow-2xl">
            <h2 className="text-2xl font-bold mb-2">Desactivar grupo</h2>

            <p className="text-gray-400 mb-6">
              El grupo no se eliminará físicamente. Pasará a estado inactivo y
              conservará su historial.
            </p>

            <div className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-5 mb-6">
              <p className="text-gray-400 text-sm">Grupo</p>

              <p className="font-bold mt-1">{grupoAEliminar.nombre}</p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setGrupoAEliminar(null)}
                className="px-5 py-3 rounded-xl bg-[#12201b] border border-[#2d463b] hover:border-[#4adea8]"
              >
                Cancelar
              </button>

              <button
                onClick={confirmarEliminar}
                className="px-5 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600"
              >
                Desactivar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}