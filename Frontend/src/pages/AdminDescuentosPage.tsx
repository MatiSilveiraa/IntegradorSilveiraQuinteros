import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import TopBar from "../components/navigation/DashboardTopBar";
import FullScreenLoading from "../components/FullScreenSpinner";

import {
  obtenerDescuentos,
  crearDescuento,
  editarDescuento,
} from "../services/AdminDescuento.service";

import type { Descuento } from "../types";

const formInicial = {
  nombre: "",
  descripcion: "",
  porcentaje: 10,
  mesesDuracion: 1,
  tipo: "DESAFIO",
  alcance: "ALUMNOS_SELECCIONADOS",
  activo: true,
};

const porcentajesDisponibles = [
  5, 10, 15, 20, 25, 30, 40, 50, 75, 100,
];

export default function AdminDescuentosPage() {
  const [descuentos, setDescuentos] = useState<Descuento[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Descuento | null>(null);
  const [form, setForm] = useState(formInicial);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      const data = await obtenerDescuentos();

      setDescuentos(data);
    } catch (error) {
      console.error(error);
      toast.error("No fue posible cargar los descuentos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const abrirCrear = () => {
    setEditando(null);
    setForm(formInicial);
    setModalAbierto(true);
  };

  const abrirEditar = (descuento: Descuento) => {
    setEditando(descuento);

    setForm({
      nombre: descuento.nombre,
      descripcion: descuento.descripcion,
      porcentaje: descuento.porcentaje,
      mesesDuracion: descuento.mesesDuracion,
      tipo: descuento.tipo,
      alcance: descuento.alcance,
      activo: descuento.activo,
    });

    setModalAbierto(true);
  };

  const validar = () => {
    if (!form.nombre.trim()) {
      toast.error("El nombre es obligatorio");
      return false;
    }

    if (!form.descripcion.trim()) {
      toast.error("La descripción es obligatoria");
      return false;
    }

    if (form.porcentaje <= 0 || form.porcentaje > 100) {
      toast.error("El porcentaje debe estar entre 1 y 100");
      return false;
    }

    if (form.mesesDuracion <= 0) {
      toast.error("La duración debe ser mayor a 0");
      return false;
    }

    return true;
  };

  const guardar = async () => {
    if (!validar()) return;

    try {
      if (editando) {
        await editarDescuento(editando.id, {
          nombre: form.nombre,
          descripcion: form.descripcion,
          porcentaje: form.porcentaje,
          mesesDuracion: form.mesesDuracion,
          activo: form.activo,
        });

        toast.success("Descuento actualizado correctamente");
      } else {
        await crearDescuento({
          nombre: form.nombre,
          descripcion: form.descripcion,
          porcentaje: form.porcentaje,
          mesesDuracion: form.mesesDuracion,
          tipo: "DESAFIO",
          alcance: "ALUMNOS_SELECCIONADOS",
          desafioId: null,
          alumnosIds: [],
        });

        toast.success("Descuento creado correctamente");
      }

      setModalAbierto(false);
      cargarDatos();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error.response?.data?.mensaje ??
          "No fue posible guardar el descuento"
      );
    }
  };

  const cambiarEstado = async (descuento: Descuento) => {
    try {
      await editarDescuento(descuento.id, {
        nombre: descuento.nombre,
        descripcion: descuento.descripcion,
        porcentaje: descuento.porcentaje,
        mesesDuracion: descuento.mesesDuracion,
        activo: !descuento.activo,
      });

      toast.success(
        descuento.activo
          ? "Descuento desactivado correctamente"
          : "Descuento activado correctamente"
      );

      cargarDatos();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error.response?.data?.mensaje ??
          "No fue posible actualizar el estado"
      );
    }
  };

  if (loading) return <FullScreenLoading />;

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      <TopBar />

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold">Descuentos</h1>

            <p className="text-gray-400 mt-2">
              Creá plantillas de descuento para asociarlas luego a recompensas
              de desafíos.
            </p>
          </div>

          <button
            onClick={abrirCrear}
            className="px-6 py-3 rounded-xl bg-[#4adea8] text-[#12201b] font-bold hover:opacity-90"
          >
            + Nuevo descuento
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <ResumenCard titulo="Total" valor={descuentos.length} />

          <ResumenCard
            titulo="Activos"
            valor={descuentos.filter((d) => d.activo).length}
          />

          <ResumenCard
            titulo="Inactivos"
            valor={descuentos.filter((d) => !d.activo).length}
          />
        </div>

        {descuentos.length === 0 ? (
          <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-10 text-center">
            <h2 className="text-2xl font-bold mb-2">
              No hay descuentos registrados
            </h2>

            <p className="text-gray-400 mb-6">
              Creá descuentos para usarlos como recompensas en desafíos.
            </p>

            <button
              onClick={abrirCrear}
              className="px-6 py-3 rounded-xl bg-[#4adea8] text-[#12201b] font-bold"
            >
              Crear descuento
            </button>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {descuentos.map((descuento) => (
              <div
                key={descuento.id}
                className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6 hover:border-[#4adea8]/40 transition-all"
              >
                <span
                  className={`inline-block px-3 py-1 rounded-full border text-xs font-bold mb-3 ${
                    descuento.activo
                      ? "bg-[#4adea8]/10 text-[#4adea8] border-[#4adea8]/30"
                      : "bg-red-500/10 text-red-400 border-red-500/30"
                  }`}
                >
                  {descuento.activo ? "Activo" : "Inactivo"}
                </span>

                <h2 className="text-xl font-bold">{descuento.nombre}</h2>

                <p className="text-gray-400 mt-1">
                  {descuento.descripcion}
                </p>

                <div className="grid grid-cols-2 gap-3 my-5">
                  <InfoBox
                    titulo="Porcentaje"
                    valor={`${descuento.porcentaje}%`}
                  />

                  <InfoBox
                    titulo="Duración"
                    valor={`${descuento.mesesDuracion} mes${
                      descuento.mesesDuracion > 1 ? "es" : ""
                    }`}
                  />
                </div>

                <div className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-4 mb-5">
                  <p className="text-sm text-gray-400">Aplicación</p>

                  <p className="text-sm text-gray-300 mt-1">
                    Este descuento no se entrega al crearlo. Se usará como
                    plantilla y se convertirá en beneficio cuando un alumno gane
                    un desafío asociado.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => abrirEditar(descuento)}
                    className="py-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 font-semibold hover:border-blue-400"
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => cambiarEstado(descuento)}
                    className={`py-3 rounded-xl border font-semibold ${
                      descuento.activo
                        ? "bg-red-500/10 border-red-500/30 text-red-400 hover:border-red-400"
                        : "bg-[#4adea8]/10 border-[#4adea8]/30 text-[#4adea8] hover:border-[#4adea8]"
                    }`}
                  >
                    {descuento.activo ? "Desactivar" : "Activar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {modalAbierto && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] px-4">
          <div className="w-full max-w-xl bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-7 shadow-2xl">
            <h2 className="text-2xl font-bold mb-2">
              {editando ? "Editar descuento" : "Nuevo descuento"}
            </h2>

            <p className="text-gray-400 mb-6">
              Configurá el descuento que podrá usarse como recompensa.
            </p>

            <div className="space-y-4">
              <Input
                label="Nombre"
                value={form.nombre}
                onChange={(value) =>
                  setForm({
                    ...form,
                    nombre: value,
                  })
                }
                placeholder="Ej: Ganadores Oro"
              />

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Descripción
                </label>

                <textarea
                  rows={3}
                  value={form.descripcion}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      descripcion: e.target.value,
                    })
                  }
                  placeholder="Ej: Descuento para ganadores del desafío"
                  className="w-full p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8]"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Porcentaje
                  </label>

                  <select
                    value={form.porcentaje}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        porcentaje: Number(e.target.value),
                      })
                    }
                    className="w-full p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8]"
                  >
                    {porcentajesDisponibles.map((porcentaje) => (
                      <option key={porcentaje} value={porcentaje}>
                        {porcentaje}%
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Duración
                  </label>

                  <select
                    value={form.mesesDuracion}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        mesesDuracion: Number(e.target.value),
                      })
                    }
                    className="w-full p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8]"
                  >
                    {[1, 2, 3, 4, 5, 6, 12].map((meses) => (
                      <option key={meses} value={meses}>
                        {meses} mes{meses > 1 ? "es" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {editando && (
                <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4">
                  <p className="text-yellow-300 font-bold">
                    Importante al desactivar
                  </p>

                  <p className="text-sm text-gray-300 mt-1">
                    Si desactivás este descuento, ya no podrá usarse para nuevas
                    recompensas.
                  </p>
                </div>
              )}

              <div className="rounded-2xl border border-[#4adea8]/30 bg-[#4adea8]/10 p-4">
                <p className="text-[#4adea8] font-bold">Vista previa</p>

                <p className="text-sm text-gray-300 mt-2">
                  Los alumnos ganadores recibirán un descuento de{" "}
                  <strong>{form.porcentaje}%</strong> durante{" "}
                  <strong>
                    {form.mesesDuracion} mes
                    {form.mesesDuracion > 1 ? "es" : ""}
                  </strong>
                  .
                </p>

                <p className="text-xs text-gray-400 mt-2">
                  El descuento se aplicará automáticamente en las próximas
                  cuotas correspondientes.
                </p>
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
    </div>
  );
}

function ResumenCard({
  titulo,
  valor,
}: {
  titulo: string;
  valor: number;
}) {
  return (
    <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6">
      <p className="text-sm text-gray-400">{titulo}</p>
      <h2 className="text-4xl font-bold mt-3">{valor}</h2>
    </div>
  );
}

function InfoBox({
  titulo,
  valor,
}: {
  titulo: string;
  valor: string;
}) {
  return (
    <div className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-4">
      <p className="text-sm text-gray-400">{titulo}</p>
      <p className="text-xl font-bold text-[#4adea8] mt-1">{valor}</p>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8]"
      />
    </div>
  );
}