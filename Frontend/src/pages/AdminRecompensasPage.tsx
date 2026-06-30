import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import TopBar from "../components/navigation/DashboardTopBar";
import FullScreenLoading from "../components/FullScreenSpinner";

import { obtenerDesafios } from "../services/AdminDesafio.Service";
import { obtenerDescuentos } from "../services/AdminDescuento.service";

import {
  obtenerRecompensasPorDesafio,
  crearRecompensa,
  editarRecompensa,
  eliminarRecompensa,
} from "../services/AdminRecompensa.Service";

import type { Desafio, Recompensa, Descuento } from "../types";

type TipoRecompensa = "PRODUCTO_REGALO" | "DESCUENTO_CUOTA" | "CUOTA_GRATIS";

type FormRecompensa = {
  descripcion: string;
  tipo: TipoRecompensa;
  premioFisico: string;
  descuentoId: string;
  otorgaCuotaGratis: boolean;
};

const formInicial: FormRecompensa = {
  descripcion: "",
  tipo: "PRODUCTO_REGALO",
  premioFisico: "",
  descuentoId: "",
  otorgaCuotaGratis: false,
};

export default function AdminRecompensasPage() {
  const navigate = useNavigate();

  const [desafios, setDesafios] = useState<Desafio[]>([]);
  const [descuentos, setDescuentos] = useState<Descuento[]>([]);
  const [recompensas, setRecompensas] = useState<Recompensa[]>([]);

  const [desafioSeleccionado, setDesafioSeleccionado] = useState<number>(0);

  const [loading, setLoading] = useState(true);
  const [loadingRecompensas, setLoadingRecompensas] = useState(false);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Recompensa | null>(null);
  const [recompensaAEliminar, setRecompensaAEliminar] =
    useState<Recompensa | null>(null);

  const [form, setForm] = useState<FormRecompensa>(formInicial);

  const cargarDatosIniciales = async () => {
    try {
      setLoading(true);

      const [desafiosData, descuentosData] = await Promise.all([
        obtenerDesafios(),
        obtenerDescuentos(),
      ]);

      setDesafios(desafiosData);
      setDescuentos(descuentosData);
    } catch (error) {
      console.error(error);
      toast.error("No fue posible cargar los datos iniciales");
    } finally {
      setLoading(false);
    }
  };

  const cargarRecompensas = async (desafioId: number) => {
    try {
      setLoadingRecompensas(true);

      const data = await obtenerRecompensasPorDesafio(desafioId);

      setRecompensas(data);
    } catch (error) {
      console.error(error);
      toast.error("No fue posible cargar las recompensas");
    } finally {
      setLoadingRecompensas(false);
    }
  };

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  useEffect(() => {
    if (!desafioSeleccionado) {
      setRecompensas([]);
      return;
    }

    cargarRecompensas(desafioSeleccionado);
  }, [desafioSeleccionado]);

  const desafioActual = useMemo(() => {
    return desafios.find(
      (d) => d.id === desafioSeleccionado || d.desafioId === desafioSeleccionado
    );
  }, [desafios, desafioSeleccionado]);

  const descuentoSeleccionado = useMemo(() => {
    return descuentos.find((d) => String(d.id) === form.descuentoId);
  }, [descuentos, form.descuentoId]);

  const totalPremiosFisicos = recompensas.filter(
    (r) => r.tipo === "PRODUCTO_REGALO"
  ).length;

  const totalDescuentos = recompensas.filter(
    (r) => r.tipo === "DESCUENTO_CUOTA"
  ).length;

  const totalCuotasGratis = recompensas.filter(
    (r) => r.tipo === "CUOTA_GRATIS" || r.otorgaCuotaGratis
  ).length;

  const abrirCrear = () => {
    if (!desafioSeleccionado) {
      toast.error("Primero seleccioná un desafío");
      return;
    }

    setEditando(null);
    setForm(formInicial);
    setModalAbierto(true);
  };

  const abrirEditar = (recompensa: Recompensa) => {
    let tipo: TipoRecompensa = "PRODUCTO_REGALO";

    if (recompensa.tipo === "CUOTA_GRATIS" || recompensa.otorgaCuotaGratis) {
      tipo = "CUOTA_GRATIS";
    } else if (recompensa.tipo === "DESCUENTO_CUOTA" || recompensa.descuentoId) {
      tipo = "DESCUENTO_CUOTA";
    }

    setEditando(recompensa);

    setForm({
      descripcion: recompensa.descripcion ?? "",
      tipo,
      premioFisico: recompensa.premioFisico ?? "",
      descuentoId: recompensa.descuentoId ? String(recompensa.descuentoId) : "",
      otorgaCuotaGratis: tipo === "CUOTA_GRATIS",
    });

    setModalAbierto(true);
  };

  const validar = () => {
    if (!desafioSeleccionado) {
      toast.error("Seleccioná un desafío");
      return false;
    }

    if (!form.descripcion.trim()) {
      toast.error("La descripción es obligatoria");
      return false;
    }

    if (form.tipo === "PRODUCTO_REGALO" && !form.premioFisico.trim()) {
      toast.error("Indicá el premio físico");
      return false;
    }

    if (form.tipo === "DESCUENTO_CUOTA" && !form.descuentoId.trim()) {
      toast.error("Seleccioná un descuento");
      return false;
    }

    return true;
  };

  const guardar = async () => {
    if (!validar()) return;

    const payload: Recompensa = {
      id: editando?.id ?? 0,
      desafioId: desafioSeleccionado,
      descripcion: form.descripcion,
      tipo: form.tipo,
      premioFisico: form.tipo === "PRODUCTO_REGALO" ? form.premioFisico : null,
      descuentoId:
        form.tipo === "DESCUENTO_CUOTA" ? Number(form.descuentoId) : null,
      otorgaCuotaGratis: form.tipo === "CUOTA_GRATIS",
    };

    try {
      if (editando) {
        await editarRecompensa(editando.id, payload);
        toast.success("Recompensa actualizada correctamente");
      } else {
        await crearRecompensa(payload);
        toast.success("Recompensa creada correctamente");
      }

      setModalAbierto(false);
      cargarRecompensas(desafioSeleccionado);
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.mensaje ?? "No fue posible guardar la recompensa"
      );
    }
  };

  const confirmarEliminar = async () => {
    if (!recompensaAEliminar) return;

    try {
      await eliminarRecompensa(recompensaAEliminar.id);

      toast.success("Recompensa eliminada correctamente");

      setRecompensaAEliminar(null);
      cargarRecompensas(desafioSeleccionado);
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.mensaje ?? "No fue posible eliminar la recompensa"
      );
    }
  };

  const obtenerTipoVisual = (recompensa: Recompensa) => {
    if (recompensa.tipo === "CUOTA_GRATIS" || recompensa.otorgaCuotaGratis) {
      return {
        titulo: "Cuota gratis",
        badge: "bg-purple-500/10 text-purple-300 border-purple-500/30",
        detalle: "La próxima cuota del ganador quedará bonificada.",
      };
    }

    if (recompensa.tipo === "DESCUENTO_CUOTA" || recompensa.descuentoId) {
      const descuento = descuentos.find((d) => d.id === recompensa.descuentoId);

      return {
        titulo: "Descuento",
        badge: "bg-[#4adea8]/10 text-[#4adea8] border-[#4adea8]/30",
        detalle: descuento
          ? `${descuento.nombre} • ${descuento.porcentaje}% durante ${
              descuento.mesesDuracion
            } mes${descuento.mesesDuracion > 1 ? "es" : ""}`
          : "Descuento asociado",
      };
    }

    return {
      titulo: "Premio físico",
      badge: "bg-sky-500/10 text-sky-300 border-sky-500/30",
      detalle: recompensa.premioFisico ?? "Premio físico",
    };
  };

  if (loading) {
    return <FullScreenLoading />;
  }

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      <TopBar />

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
          <div>
            <h1 className="text-4xl font-bold">
              Recompensas por desafío
            </h1>

            <p className="text-gray-400 mt-2 max-w-3xl">
              Seleccioná un desafío y configurá qué recibirán sus ganadores.
              La recompensa queda asociada automáticamente al desafío elegido.
            </p>
          </div>

          <button
            type="button"
            onClick={abrirCrear}
            className="px-6 py-3 rounded-xl bg-[#4adea8] text-[#12201b] font-bold hover:opacity-90"
          >
            + Nueva recompensa
          </button>
        </div>

        <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-5 mb-8">
          <label className="block text-sm text-gray-400 mb-2">
            Desafío
          </label>

          <select
            value={desafioSeleccionado}
            onChange={(e) => setDesafioSeleccionado(Number(e.target.value))}
            className="w-full p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8]"
          >
            <option value={0}>Seleccione un desafío...</option>

            {desafios.map((desafio) => (
              <option key={desafio.id} value={desafio.id}>
                {desafio.titulo}
              </option>
            ))}
          </select>
        </div>

        {desafioActual && (
          <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-7 mb-8">
            <span className="inline-block px-3 py-1 rounded-full bg-[#4adea8]/10 text-[#4adea8] border border-[#4adea8]/30 text-xs font-bold mb-4">
              Desafío seleccionado
            </span>

            <h2 className="text-3xl font-bold">{desafioActual.titulo}</h2>

            <p className="text-gray-400 mt-2">{desafioActual.descripcion}</p>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <ResumenCard titulo="Recompensas" valor={recompensas.length} />
          <ResumenCard titulo="Premios físicos" valor={totalPremiosFisicos} />
          <ResumenCard titulo="Descuentos" valor={totalDescuentos} />
          <ResumenCard titulo="Cuotas gratis" valor={totalCuotasGratis} />
        </div>

        <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-5 mb-8">
          <div className="flex items-start gap-4">
            <CardGiftcardOutlinedIcon className="text-[#4adea8]" />

            <div>
              <h2 className="font-bold text-lg">Funcionamiento</h2>

              <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                Cuando selecciones ganadores en un desafío, el sistema generará
                automáticamente estas recompensas para cada alumno ganador. Los
                premios físicos deberán marcarse como entregados desde la pantalla
                de premios pendientes.
              </p>
            </div>
          </div>
        </div>

        {!desafioSeleccionado ? (
          <EstadoVacio
            titulo="Seleccioná un desafío"
            descripcion="Elegí un desafío para visualizar y configurar sus recompensas."
          />
        ) : loadingRecompensas ? (
          <FullScreenLoading />
        ) : recompensas.length === 0 ? (
          <EstadoVacio
            titulo="No hay recompensas configuradas"
            descripcion="Agregá una recompensa para este desafío."
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {recompensas.map((recompensa) => {
              const visual = obtenerTipoVisual(recompensa);

              return (
                <div
                  key={recompensa.id}
                  className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6 hover:border-[#4adea8]/40 transition-all"
                >
                  <span
                    className={`inline-block px-3 py-1 rounded-full border text-xs font-bold mb-4 ${visual.badge}`}
                  >
                    {visual.titulo}
                  </span>

                  <h2 className="text-xl font-bold">
                    {recompensa.descripcion}
                  </h2>

                  <div className="mt-5 bg-[#12201b] border border-[#2d463b] rounded-2xl p-4">
                    <p className="text-sm text-gray-400">Detalle</p>

                    <p className="font-semibold mt-1">{visual.detalle}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-5">
                    <button
                      type="button"
                      onClick={() => abrirEditar(recompensa)}
                      className="py-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 font-semibold hover:border-blue-400 flex items-center justify-center gap-2"
                    >
                      <EditOutlinedIcon sx={{ fontSize: 18 }} /> Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => setRecompensaAEliminar(recompensa)}
                      className="py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-semibold hover:border-red-400 flex items-center justify-center gap-2"
                    >
                      <DeleteOutlineOutlinedIcon sx={{ fontSize: 18 }} />
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {modalAbierto && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] px-4">
          <div className="w-full max-w-xl bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-2">
              {editando ? "Editar recompensa" : "Nueva recompensa"}
            </h2>

            <p className="text-gray-400 mb-6">
              Esta recompensa quedará asociada al desafío seleccionado.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Tipo de recompensa
                </label>

                <select
                  value={form.tipo}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      tipo: e.target.value as TipoRecompensa,
                      premioFisico: "",
                      descuentoId: "",
                      otorgaCuotaGratis:
                        e.target.value === "CUOTA_GRATIS",
                    })
                  }
                  className="w-full p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8]"
                >
                  <option value="PRODUCTO_REGALO">Premio físico</option>
                  <option value="DESCUENTO_CUOTA">Descuento</option>
                  <option value="CUOTA_GRATIS">Cuota gratis</option>
                </select>
              </div>

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
                  placeholder="Ej: Premio para ganadores del desafío"
                  className="w-full p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8]"
                />
              </div>

              {form.tipo === "PRODUCTO_REGALO" && (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Premio físico
                  </label>

                  <input
                    value={form.premioFisico}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        premioFisico: e.target.value,
                      })
                    }
                    placeholder="Ej: Remera, botella, medalla"
                    className="w-full p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8]"
                  />
                </div>
              )}

              {form.tipo === "DESCUENTO_CUOTA" && (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Descuento
                  </label>

                  <select
                    value={form.descuentoId}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        descuentoId: e.target.value,
                      })
                    }
                    className="w-full p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8]"
                  >
                    <option value="">Seleccione un descuento...</option>

                    {descuentos
                      .filter((d) => d.activo)
                      .map((descuento) => (
                        <option key={descuento.id} value={descuento.id}>
                          {descuento.nombre} • {descuento.porcentaje}% •{" "}
                          {descuento.mesesDuracion} mes
                          {descuento.mesesDuracion > 1 ? "es" : ""}
                        </option>
                      ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => navigate("/admin/descuentos")}
                    className="mt-3 text-[#4adea8] text-sm font-semibold hover:underline"
                  >
                    + Crear nuevo descuento
                  </button>

                  {!descuentoSeleccionado ? (
                    <div className="mt-4 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4">
                      <p className="text-yellow-300 font-bold">
                        No hay descuento seleccionado
                      </p>

                      <p className="text-sm text-gray-300 mt-1">
                        Seleccioná un descuento para ver sus características.
                      </p>
                    </div>
                  ) : (
                    <div className="mt-4 rounded-2xl border border-[#4adea8]/30 bg-[#4adea8]/10 p-4">
                      <p className="text-[#4adea8] font-bold mb-3">
                        Descuento seleccionado
                      </p>

                      <div className="grid md:grid-cols-2 gap-3">
                        <Dato titulo="Nombre" valor={descuentoSeleccionado.nombre} />

                        <Dato
                          titulo="Estado"
                          valor={descuentoSeleccionado.activo ? "Activo" : "Inactivo"}
                        />

                        <Dato
                          titulo="Descripción"
                          valor={descuentoSeleccionado.descripcion}
                        />

                        <Dato
                          titulo="Duración"
                          valor={`${descuentoSeleccionado.mesesDuracion} mes${
                            descuentoSeleccionado.mesesDuracion > 1 ? "es" : ""
                          }`}
                        />

                        <Dato
                          titulo="Porcentaje"
                          valor={`${descuentoSeleccionado.porcentaje}%`}
                          destacado
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <VistaPrevia
                form={form}
                descuentoSeleccionado={descuentoSeleccionado}
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

      {recompensaAEliminar && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] px-4">
          <div className="w-full max-w-lg bg-[#1a2b24] border border-red-500/30 rounded-3xl p-7 shadow-2xl">
            <h2 className="text-2xl font-bold mb-2">Eliminar recompensa</h2>

            <p className="text-gray-400 mb-6">
              Esta acción quitará la recompensa del desafío.
            </p>

            <div className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-5 mb-6">
              <p className="text-gray-400 text-sm">Recompensa</p>

              <p className="font-bold mt-1">
                {recompensaAEliminar.descripcion}
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setRecompensaAEliminar(null)}
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

function EstadoVacio({
  titulo,
  descripcion,
}: {
  titulo: string;
  descripcion: string;
}) {
  return (
    <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-10 text-center">
      <AddOutlinedIcon sx={{ fontSize: 54, color: "#4adea8" }} />

      <h2 className="text-2xl font-bold mt-4 mb-2">{titulo}</h2>

      <p className="text-gray-400">{descripcion}</p>
    </div>
  );
}

function Dato({
  titulo,
  valor,
  destacado = false,
}: {
  titulo: string;
  valor?: string | number | null;
  destacado?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-gray-400">{titulo}</p>

      <p
        className={`font-semibold ${
          destacado ? "text-2xl text-[#4adea8]" : ""
        }`}
      >
        {valor || "-"}
      </p>
    </div>
  );
}

function VistaPrevia({
  form,
  descuentoSeleccionado,
}: {
  form: FormRecompensa;
  descuentoSeleccionado?: Descuento;
}) {
  if (form.tipo === "PRODUCTO_REGALO") {
    return (
      <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 p-4">
        <p className="text-sky-300 font-bold">Vista previa: premio físico</p>

        <p className="text-sm text-gray-300 mt-2">
          Los ganadores recibirán:{" "}
          <strong>{form.premioFisico || "premio físico sin definir"}</strong>.
        </p>

        <p className="text-xs text-gray-400 mt-2">
          Este premio quedará pendiente hasta que el administrador lo marque
          como entregado.
        </p>
      </div>
    );
  }

  if (form.tipo === "DESCUENTO_CUOTA") {
    return (
      <div className="rounded-2xl border border-[#4adea8]/30 bg-[#4adea8]/10 p-4">
        <p className="text-[#4adea8] font-bold">Vista previa: descuento</p>

        {descuentoSeleccionado ? (
          <>
            <p className="text-sm text-gray-300 mt-2">
              Los ganadores recibirán un descuento de{" "}
              <strong>{descuentoSeleccionado.porcentaje}%</strong> durante{" "}
              <strong>
                {descuentoSeleccionado.mesesDuracion} mes
                {descuentoSeleccionado.mesesDuracion > 1 ? "es" : ""}
              </strong>
              .
            </p>

            <p className="text-xs text-gray-400 mt-2">
              Se aplicará automáticamente en las próximas cuotas
              correspondientes.
            </p>
          </>
        ) : (
          <p className="text-sm text-gray-300 mt-2">
            Seleccioná un descuento para ver la vista previa.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-4">
      <p className="text-purple-300 font-bold">Vista previa: cuota gratis</p>

      <p className="text-sm text-gray-300 mt-2">
        Los ganadores recibirán una cuota gratis. La próxima cuota generada
        quedará con monto final 0.
      </p>
    </div>
  );
}