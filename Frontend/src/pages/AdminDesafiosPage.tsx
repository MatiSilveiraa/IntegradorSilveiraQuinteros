import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  obtenerDesafios,
  crearDesafio,
  editarDesafio,
  eliminarDesafio,
} from "../services/AdminDesafio.Service";

import type { Desafio } from "../types";
import FullScreenLoading from "../components/FullScreenSpinner";
import TopBar from "../components/navigation/DashboardTopBar";

type EstadoVisual = "ACTIVO" | "PROXIMO" | "FINALIZADO";

export default function AdminDesafiosPage() {
  const navigate = useNavigate();

  const [desafios, setDesafios] = useState<Desafio[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Desafio | null>(null);

  const [desafioAEliminar, setDesafioAEliminar] =
    useState<Desafio | null>(null);

  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const cargarDatos = async () => {
    try {
      setLoading(true);

      const data = await obtenerDesafios();

      setDesafios(data);
    } catch (error) {
      console.error(error);
      toast.error("No fue posible cargar los desafíos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const obtenerEstado = (desafio: Desafio): EstadoVisual => {
    const hoy = new Date();
    const inicio = new Date(desafio.fechaInicio);
    const fin = new Date(desafio.fechaFin);

    if (hoy < inicio) return "PROXIMO";
    if (hoy > fin) return "FINALIZADO";

    return "ACTIVO";
  };

  const obtenerEstadoClase = (estado: EstadoVisual) => {
    if (estado === "ACTIVO") {
      return "bg-[#4adea8]/10 text-[#4adea8] border-[#4adea8]/30";
    }

    if (estado === "PROXIMO") {
      return "bg-blue-500/10 text-blue-300 border-blue-500/30";
    }

    return "bg-gray-500/10 text-gray-300 border-gray-500/30";
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-UY", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const abrirCrear = () => {
    setEditando(null);

    setForm({
      titulo: "",
      descripcion: "",
      fechaInicio: "",
      fechaFin: "",
    });

    setModalAbierto(true);
  };

  const abrirEditar = (desafio: Desafio) => {
    setEditando(desafio);

    setForm({
      titulo: desafio.titulo,
      descripcion: desafio.descripcion,
      fechaInicio: desafio.fechaInicio.substring(0, 16),
      fechaFin: desafio.fechaFin.substring(0, 16),
    });

    setModalAbierto(true);
  };

  const validarForm = () => {
    if (!form.titulo.trim()) {
      toast.error("El título es obligatorio");
      return false;
    }

    if (!form.fechaInicio || !form.fechaFin) {
      toast.error("Debés ingresar fecha de inicio y fecha de fin");
      return false;
    }

    if (new Date(form.fechaFin) < new Date(form.fechaInicio)) {
      toast.error("La fecha de fin debe ser mayor o igual a la fecha de inicio");
      return false;
    }

    return true;
  };

  const guardar = async () => {
    if (!validarForm()) return;

    try {
      if (editando) {
        await editarDesafio(editando.id!, form);

        toast.success("Desafío actualizado correctamente");
      } else {
        await crearDesafio(form);

        toast.success("Desafío creado correctamente");
      }

      setModalAbierto(false);
      cargarDatos();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error.response?.data?.mensaje ?? "No fue posible guardar el desafío"
      );
    }
  };

  const confirmarEliminar = async () => {
    if (!desafioAEliminar?.id) return;

    try {
      await eliminarDesafio(desafioAEliminar.id);

      toast.success("Desafío eliminado correctamente");

      setDesafioAEliminar(null);
      cargarDatos();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error.response?.data?.mensaje ?? "No fue posible eliminar el desafío"
      );
    }
  };

  const resumen = useMemo(() => {
    const activos = desafios.filter((d) => obtenerEstado(d) === "ACTIVO")
      .length;

    const proximos = desafios.filter((d) => obtenerEstado(d) === "PROXIMO")
      .length;

    const finalizados = desafios.filter(
      (d) => obtenerEstado(d) === "FINALIZADO"
    ).length;

    return {
      total: desafios.length,
      activos,
      proximos,
      finalizados,
    };
  }, [desafios]);

  if (loading) {
    return <FullScreenLoading />;
  }

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      <TopBar />

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold">Desafíos</h1>

            <p className="text-gray-400 mt-2">
              Crear, editar y administrar desafíos, recompensas y ganadores.
            </p>
          </div>

          <button
            onClick={abrirCrear}
            className="px-6 py-3 rounded-xl bg-[#4adea8] text-[#12201b] font-bold hover:opacity-90"
          >
            + Nuevo desafío
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <ResumenCard titulo="Total" valor={resumen.total} />
          <ResumenCard titulo="Activos" valor={resumen.activos} />
          <ResumenCard titulo="Próximos" valor={resumen.proximos} />
          <ResumenCard titulo="Finalizados" valor={resumen.finalizados} />
        </div>

        {desafios.length === 0 ? (
          <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-10 text-center">
            <h2 className="text-2xl font-bold mb-2">
              No hay desafíos registrados
            </h2>

            <p className="text-gray-400 mb-6">
              Creá el primer desafío para comenzar a motivar a los alumnos.
            </p>

            <button
              onClick={abrirCrear}
              className="px-6 py-3 rounded-xl bg-[#4adea8] text-[#12201b] font-bold"
            >
              Crear desafío
            </button>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {desafios.map((desafio) => {
              const estado = obtenerEstado(desafio);

              return (
                <div
                  key={desafio.id}
                  className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6 hover:border-[#4adea8]/40 transition-all"
                >
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div>
                      <span
                        className={`inline-block px-3 py-1 rounded-full border text-xs font-bold mb-3 ${obtenerEstadoClase(
                          estado
                        )}`}
                      >
                        {estado}
                      </span>

                      <h2 className="text-xl font-bold">{desafio.titulo}</h2>
                    </div>
                  </div>

                  <p className="text-gray-400 min-h-[48px]">
                    {desafio.descripcion}
                  </p>

                  <div className="mt-5 bg-[#12201b] border border-[#2d463b] rounded-2xl p-4">
                    <p className="text-sm text-gray-400">Duración</p>

                    <p className="font-bold mt-1">
                      {formatearFecha(desafio.fechaInicio)} -{" "}
                      {formatearFecha(desafio.fechaFin)}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 mt-5">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/admin/desafios/${desafio.id}`)
                      }
                      className="py-3 rounded-xl bg-[#12201b] border border-[#2d463b] hover:border-[#4adea8] font-semibold"
                    >
                      Gestionar desafío
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => abrirEditar(desafio)}
                        className="py-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 font-semibold hover:border-blue-400"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => setDesafioAEliminar(desafio)}
                        className="py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-semibold hover:border-red-400"
                      >
                        Eliminar
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
          <div className="w-full max-w-xl bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-7 shadow-2xl">
            <h2 className="text-2xl font-bold mb-2">
              {editando ? "Editar desafío" : "Nuevo desafío"}
            </h2>

            <p className="text-gray-400 mb-6">
              Definí el título, descripción y período de vigencia.
            </p>

            <div className="space-y-4">
              <Input
                label="Título"
                value={form.titulo}
                onChange={(value) =>
                  setForm({
                    ...form,
                    titulo: value,
                  })
                }
                placeholder="Ej: Desafío de Invierno"
              />

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Descripción
                </label>

                <textarea
                  value={form.descripcion}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      descripcion: e.target.value,
                    })
                  }
                  placeholder="Explicá en qué consiste el desafío."
                  rows={4}
                  className="w-full p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8]"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Fecha inicio"
                  type="datetime-local"
                  value={form.fechaInicio}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      fechaInicio: value,
                    })
                  }
                />

                <Input
                  label="Fecha fin"
                  type="datetime-local"
                  value={form.fechaFin}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      fechaFin: value,
                    })
                  }
                />
              </div>
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

      {desafioAEliminar && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] px-4">
          <div className="w-full max-w-lg bg-[#1a2b24] border border-red-500/30 rounded-3xl p-7 shadow-2xl">
            <h2 className="text-2xl font-bold mb-2">Eliminar desafío</h2>

            <p className="text-gray-400 mb-6">
              El desafío no se borrará físicamente. Se marcará como inactivo.
            </p>

            <div className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-5 mb-6">
              <p className="text-gray-400 text-sm">Desafío</p>

              <p className="font-bold mt-1">{desafioAEliminar.titulo}</p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDesafioAEliminar(null)}
                className="px-5 py-3 rounded-xl bg-[#12201b] border border-[#2d463b] hover:border-[#4adea8]"
              >
                Cancelar
              </button>

              <button
                onClick={confirmarEliminar}
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

function ResumenCard({ titulo, valor }: { titulo: string; valor: number }) {
  return (
    <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6">
      <p className="text-sm text-gray-400">{titulo}</p>

      <h2 className="text-4xl font-bold mt-3">{valor}</h2>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8]"
      />
    </div>
  );
}