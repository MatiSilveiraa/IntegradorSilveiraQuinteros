import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import TopBar from "../components/navigation/DashboardTopBar";
import FullScreenLoading from "../components/FullScreenSpinner";
import ResumenCard from "../components/ui/ResumenCard";

import { obtenerGrupoPorId } from "../services/Grupo.Service";
import {
  crearClase,
  editarClase,
  eliminarClase,
  cambiarEstadoClase,
} from "../services/Clase.Service";

import type { Clase, Grupo, EstadoClaseValor } from "../types";

const formClaseInicial = {
  diaSemana: 1,
  horaInicio: "09:00",
  horaFin: "10:00",
  latitud: 0,
  longitud: 0,
  codigoPostal: "",
  radioGeolocalizacion: 100,
  esFija: true,
  fechaInicio: "",
  fechaFin: "",
  cupoMaximo: 20,
};

const diasSemana = [
  { valor: 1, texto: "Lunes" },
  { valor: 2, texto: "Martes" },
  { valor: 3, texto: "Miércoles" },
  { valor: 4, texto: "Jueves" },
  { valor: 5, texto: "Viernes" },
  { valor: 6, texto: "Sábado" },
  { valor: 7, texto: "Domingo" },
];

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

  const [modalClase, setModalClase] = useState(false);
  const [editandoClase, setEditandoClase] = useState<Clase | null>(null);
  const [claseAEliminar, setClaseAEliminar] = useState<Clase | null>(null);
  const [claseCambioEstado, setClaseCambioEstado] = useState<Clase | null>(null);

  const [formClase, setFormClase] = useState(formClaseInicial);

  const [estadoNuevo, setEstadoNuevo] = useState<EstadoClaseValor>(0);
  const [motivoEstado, setMotivoEstado] = useState("");

  const cargarDatos = async () => {
    try {
      setLoading(true);

      const data = await obtenerGrupoPorId(grupoId);

      setGrupo(data);
    } catch (error: any) {
      console.error(error);

      toast.error(
        error.response?.data?.mensaje ?? "No fue posible cargar el grupo"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!grupoId) return;

    cargarDatos();
  }, [grupoId]);

  const clases = grupo?.clases ?? [];

  const resumen = useMemo(() => {
    return {
      total: clases.length,
      programadas: clases.filter((c) => c.estado === "Programada").length,
      realizadas: clases.filter((c) => c.estado === "Realizada").length,
      canceladas: clases.filter(
        (c) => c.estado === "Cancelada" || c.estado === "Suspendida"
      ).length,
    };
  }, [clases]);

  const formatearDia = (dia: string | number) => {
    const numero = Number(dia);

    const encontrado = diasSemana.find((d) => d.valor === numero);

    return encontrado?.texto ?? String(dia);
  };

  const obtenerEstadoClase = (estado: string) => {
    if (estado === "Programada") {
      return "bg-[#4adea8]/10 text-[#4adea8] border-[#4adea8]/30";
    }

    if (estado === "Realizada") {
      return "bg-blue-500/10 text-blue-300 border-blue-500/30";
    }

    if (estado === "Cancelada") {
      return "bg-red-500/10 text-red-400 border-red-500/30";
    }

    return "bg-yellow-500/10 text-yellow-300 border-yellow-500/30";
  };

  const abrirCrearClase = () => {
    setEditandoClase(null);
    setFormClase(formClaseInicial);
    setModalClase(true);
  };

  const abrirEditarClase = (clase: Clase) => {
    setEditandoClase(clase);

    setFormClase({
      diaSemana: Number(clase.diaSemana),
      horaInicio: clase.horaInicio,
      horaFin: clase.horaFin,
      latitud: clase.latitud,
      longitud: clase.longitud,
      codigoPostal: clase.codigoPostal ?? "",
      radioGeolocalizacion: clase.radioGeolocalizacion,
      esFija: clase.esFija,
      fechaInicio: clase.fechaInicio?.substring(0, 10) ?? "",
      fechaFin: clase.fechaFin?.substring(0, 10) ?? "",
      cupoMaximo: clase.cupoMaximo,
    });

    setModalClase(true);
  };

  const validarClase = () => {
    if (formClase.cupoMaximo <= 0) {
      toast.error("El cupo debe ser mayor a cero");
      return false;
    }

    if (formClase.horaFin <= formClase.horaInicio) {
      toast.error("La hora de fin debe ser mayor a la hora de inicio");
      return false;
    }

    if (!formClase.fechaInicio) {
      toast.error("La fecha de inicio es obligatoria");
      return false;
    }

    return true;
  };

  const guardarClase = async () => {
    if (!validarClase()) return;

    const payload = {
      grupoId,
      diaSemana: Number(formClase.diaSemana),
      horaInicio: formClase.horaInicio,
      horaFin: formClase.horaFin,
      latitud: Number(formClase.latitud),
      longitud: Number(formClase.longitud),
      codigoPostal: formClase.codigoPostal,
      radioGeolocalizacion: Number(formClase.radioGeolocalizacion),
      esFija: formClase.esFija,
      fechaInicio: formClase.fechaInicio,
      fechaFin: formClase.fechaFin || null,
      cupoMaximo: Number(formClase.cupoMaximo),
    };

    try {
      if (editandoClase) {
        await editarClase(editandoClase.id, payload);

        toast.success("Clase actualizada correctamente");
      } else {
        await crearClase(payload);

        toast.success("Clase creada correctamente");
      }

      setModalClase(false);
      cargarDatos();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error.response?.data?.mensaje ?? "No fue posible guardar la clase"
      );
    }
  };

  const abrirCambioEstado = (clase: Clase) => {
    setClaseCambioEstado(clase);

    const estadoActual =
      estadosClase.find((e) => e.texto === clase.estado)?.valor ?? 0;

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
        error.response?.data?.mensaje ?? "No fue posible cambiar el estado"
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
        error.response?.data?.mensaje ?? "No fue posible eliminar la clase"
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
        <button
          onClick={() => navigate("/admin/grupos")}
          className="text-[#4adea8] hover:underline mb-6"
        >
          ← Volver a grupos
        </button>

        <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-7 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
            <div>
              <h1 className="text-4xl font-bold">
                {grupo?.nombre ?? "Detalle del grupo"}
              </h1>

              <p className="text-gray-400 mt-2">
                Nivel:{" "}
                <span className="text-white font-semibold">
                  {grupo?.nivel}
                </span>
              </p>
            </div>

            <button
  onClick={() => navigate(`/admin/clases/nueva?grupoId=${grupoId}`)}
  className="px-6 py-3 rounded-xl bg-[#4adea8] text-[#12201b] font-bold hover:opacity-90 flex items-center justify-center gap-2"
>
  <AddOutlinedIcon />
  Nueva clase
</button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <ResumenCard titulo="Clases" valor={resumen.total} />
          <ResumenCard titulo="Programadas" valor={resumen.programadas} />
          <ResumenCard titulo="Realizadas" valor={resumen.realizadas} />
          <ResumenCard titulo="Canceladas/Suspendidas" valor={resumen.canceladas} />
        </div>

        {clases.length === 0 ? (
          <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-10 text-center">
            <h2 className="text-2xl font-bold mb-2">
              Este grupo no tiene clases
            </h2>

            <p className="text-gray-400 mb-6">
              Agregá una clase para comenzar a usar el grupo.
            </p>

           <button
  onClick={() => navigate(`/admin/clases/nueva?grupoId=${grupoId}`)}
  className="px-6 py-3 rounded-xl bg-[#4adea8] text-[#12201b] font-bold"
>
  Crear clase
</button>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {clases.map((clase) => (
              <div
                key={clase.id}
                className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6 hover:border-[#4adea8]/40 transition-all"
              >
                <span
                  className={`inline-block px-3 py-1 rounded-full border text-xs font-bold mb-4 ${obtenerEstadoClase(
                    clase.estado
                  )}`}
                >
                  {clase.estado}
                </span>

                <h2 className="text-2xl font-bold">
                  {formatearDia(clase.diaSemana)}
                </h2>

                <p className="text-gray-400 mt-2">
                  {clase.horaInicio} - {clase.horaFin}
                </p>

                <div className="grid grid-cols-2 gap-3 my-5">
                  <InfoBox
                    titulo="Cupo"
                    valor={`${clase.cantidadInscriptos ?? 0}/${clase.cupoMaximo}`}
                  />

                  <InfoBox
                    titulo="Radio"
                    valor={`${clase.radioGeolocalizacion} m`}
                  />
                </div>

                <div className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-4 mb-5">
                  <p className="text-sm text-gray-400">Ubicación</p>

                  <p className="font-semibold mt-1">
                    CP {clase.codigoPostal || "-"}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    {clase.latitud}, {clase.longitud}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => abrirCambioEstado(clase)}
                    className="py-3 rounded-xl bg-[#12201b] border border-[#2d463b] hover:border-[#4adea8] font-semibold"
                  >
                    Cambiar estado
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => abrirEditarClase(clase)}
                      className="py-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 font-semibold hover:border-blue-400 flex items-center justify-center gap-2"
                    >
                      <EditOutlinedIcon sx={{ fontSize: 18 }} />
                      Editar
                    </button>

                    <button
                      onClick={() => setClaseAEliminar(clase)}
                      className="py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-semibold hover:border-red-400 flex items-center justify-center gap-2"
                    >
                      <DeleteOutlineOutlinedIcon sx={{ fontSize: 18 }} />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {modalClase && (
        <ModalClase
          editando={!!editandoClase}
          form={formClase}
          setForm={setFormClase}
          onClose={() => setModalClase(false)}
          onGuardar={guardarClase}
        />
      )}

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
            <h2 className="text-2xl font-bold mb-2">Eliminar clase</h2>

            <p className="text-gray-400 mb-6">
              La clase dejará de estar disponible para nuevas operaciones.
            </p>

            <div className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-5 mb-6">
              <p className="text-gray-400 text-sm">Clase</p>

              <p className="font-bold mt-1">
                {formatearDia(claseAEliminar.diaSemana)}{" "}
                {claseAEliminar.horaInicio} - {claseAEliminar.horaFin}
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

function InfoBox({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-4">
      <p className="text-sm text-gray-400">{titulo}</p>
      <p className="text-xl font-bold text-[#4adea8] mt-1">{valor}</p>
    </div>
  );
}

function ModalClase({
  editando,
  form,
  setForm,
  onClose,
  onGuardar,
}: {
  editando: boolean;
  form: typeof formClaseInicial;
  setForm: React.Dispatch<React.SetStateAction<typeof formClaseInicial>>;
  onClose: () => void;
  onGuardar: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] px-4">
      <div className="w-full max-w-2xl bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-2">
          {editando ? "Editar clase" : "Nueva clase"}
        </h2>

        <p className="text-gray-400 mb-6">
          Configurá el horario, cupo y ubicación de la clase.
        </p>

        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <SelectCampo
              label="Día"
              value={form.diaSemana}
              onChange={(value) =>
                setForm({
                  ...form,
                  diaSemana: Number(value),
                })
              }
              opciones={diasSemana}
            />

            <SelectCampo
              label="Tipo"
              value={form.esFija ? 1 : 0}
              onChange={(value) =>
                setForm({
                  ...form,
                  esFija: Number(value) === 1,
                })
              }
              opciones={[
                { valor: 1, texto: "Fija" },
                { valor: 0, texto: "No fija" },
              ]}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <InputCampo
              label="Hora inicio"
              type="time"
              value={form.horaInicio}
              onChange={(value) =>
                setForm({
                  ...form,
                  horaInicio: value,
                })
              }
            />

            <InputCampo
              label="Hora fin"
              type="time"
              value={form.horaFin}
              onChange={(value) =>
                setForm({
                  ...form,
                  horaFin: value,
                })
              }
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <InputCampo
              label="Cupo máximo"
              type="number"
              value={String(form.cupoMaximo)}
              onChange={(value) =>
                setForm({
                  ...form,
                  cupoMaximo: Number(value),
                })
              }
            />

            <InputCampo
              label="Radio geolocalización"
              type="number"
              value={String(form.radioGeolocalizacion)}
              onChange={(value) =>
                setForm({
                  ...form,
                  radioGeolocalizacion: Number(value),
                })
              }
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <InputCampo
              label="Latitud"
              type="number"
              value={String(form.latitud)}
              onChange={(value) =>
                setForm({
                  ...form,
                  latitud: Number(value),
                })
              }
            />

            <InputCampo
              label="Longitud"
              type="number"
              value={String(form.longitud)}
              onChange={(value) =>
                setForm({
                  ...form,
                  longitud: Number(value),
                })
              }
            />
          </div>

          <InputCampo
            label="Código postal"
            value={form.codigoPostal}
            onChange={(value) =>
              setForm({
                ...form,
                codigoPostal: value,
              })
            }
          />

          <div className="grid md:grid-cols-2 gap-4">
            <InputCampo
              label="Fecha inicio"
              type="date"
              value={form.fechaInicio}
              onChange={(value) =>
                setForm({
                  ...form,
                  fechaInicio: value,
                })
              }
            />

            <InputCampo
              label="Fecha fin"
              type="date"
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
            onClick={onClose}
            className="px-5 py-3 rounded-xl bg-[#12201b] border border-[#2d463b] hover:border-[#4adea8]"
          >
            Cancelar
          </button>

          <button
            onClick={onGuardar}
            className="px-5 py-3 rounded-xl bg-[#4adea8] text-[#12201b] font-bold hover:opacity-90"
          >
            Guardar
          </button>
        </div>
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
        <h2 className="text-2xl font-bold mb-2">Cambiar estado</h2>

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

function InputCampo({
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
      <label className="block text-sm text-gray-400 mb-2">{label}</label>

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
      <label className="block text-sm text-gray-400 mb-2">{label}</label>

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