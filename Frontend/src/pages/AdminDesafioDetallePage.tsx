import { useEffect, useMemo, useState } from "react";
import {useParams } from "react-router-dom";
import toast from "react-hot-toast";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import TopBar from "../components/navigation/DashboardTopBar";
import FullScreenLoading from "../components/FullScreenSpinner";

import ResumenCard from "../components/ui/ResumenCard";
import FormInput from "../components/ui/FormInput";
import BotonFiltro from "../components/desafios/BotonFiltro";
import VistaPreviaRecompensa from "../components/desafios/VistaPreviaRecompensa";

import {
  obtenerDesafios,
  obtenerParticipantesDesafio,
  asignarGanadoresDesafio,
} from "../services/AdminDesafio.Service";

import {
  obtenerRecompensasPorDesafio,
  crearRecompensa,
  editarRecompensa,
  eliminarRecompensa,
} from "../services/AdminRecompensa.Service";

import {
  obtenerDescuentos,
  crearDescuento,
} from "../services/AdminDescuento.service";

import type {
  Desafio,
  ParticipanteDesafio,
  Recompensa,
  Descuento,
} from "../types";

type Filtro = "todos" | "ganadores" | "pendientes";
type EstadoVisual = "ACTIVO" | "PROXIMO" | "FINALIZADO";
type TipoRecompensa = "PRODUCTO_REGALO" | "DESCUENTO_CUOTA" | "CUOTA_GRATIS";

type FormRecompensa = {
  descripcion: string;
  tipo: TipoRecompensa;
  premioFisico: string;
  descuentoId: string;
};

const formRecompensaInicial: FormRecompensa = {
  descripcion: "",
  tipo: "PRODUCTO_REGALO",
  premioFisico: "",
  descuentoId: "",
};

const formDescuentoInicial = {
  nombre: "",
  descripcion: "",
  porcentaje: 10,
  mesesDuracion: 1,
};

const porcentajesDisponibles = [
  5, 10, 15, 20, 25, 30, 40, 50, 75, 100,
];

export default function AdminDesafioDetallePage() {
  const { id } = useParams();

  const desafioId = Number(id);

  const [desafio, setDesafio] = useState<Desafio | null>(null);
  const [participantes, setParticipantes] = useState<ParticipanteDesafio[]>([]);
  const [recompensas, setRecompensas] = useState<Recompensa[]>([]);
  const [descuentos, setDescuentos] = useState<Descuento[]>([]);

  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todos");

  const [loading, setLoading] = useState(true);
  const [confirmando, setConfirmando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [modalRecompensa, setModalRecompensa] = useState(false);
  const [editandoRecompensa, setEditandoRecompensa] =
    useState<Recompensa | null>(null);
  const [recompensaAEliminar, setRecompensaAEliminar] =
    useState<Recompensa | null>(null);

  const [formRecompensa, setFormRecompensa] =
    useState<FormRecompensa>(formRecompensaInicial);

  const [modalDescuentoRapido, setModalDescuentoRapido] = useState(false);
  const [guardandoDescuento, setGuardandoDescuento] = useState(false);
  const [formDescuento, setFormDescuento] = useState(formDescuentoInicial);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      const [
        desafiosData,
        participantesData,
        recompensasData,
        descuentosData,
      ] = await Promise.all([
        obtenerDesafios(),
        obtenerParticipantesDesafio(desafioId),
        obtenerRecompensasPorDesafio(desafioId),
        obtenerDescuentos(),
      ]);

      const desafioEncontrado = desafiosData.find(
        (d: Desafio) => d.id === desafioId || d.desafioId === desafioId
      );

      setDesafio(desafioEncontrado ?? null);
      setParticipantes(participantesData);
      setRecompensas(recompensasData);
      setDescuentos(descuentosData);
    } catch (error: any) {
      console.error(error);

      toast.error(
        error.response?.data?.mensaje ??
          "No fue posible cargar los datos del desafío"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!desafioId) return;

    cargarDatos();
  }, [desafioId]);

  const descuentoSeleccionado = useMemo(() => {
    return descuentos.find((d) => String(d.id) === formRecompensa.descuentoId);
  }, [descuentos, formRecompensa.descuentoId]);

  const obtenerEstado = (desafioActual?: Desafio | null): EstadoVisual => {
    if (!desafioActual) return "ACTIVO";

    const hoy = new Date();
    const inicio = new Date(desafioActual.fechaInicio);
    const fin = new Date(desafioActual.fechaFin);

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

  const formatearFecha = (fecha?: string) => {
    if (!fecha) return "-";

    return new Date(fecha).toLocaleDateString("es-UY", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const totalGanadores = participantes.filter((p) => p.ganador).length;
  const totalPendientes = participantes.length - totalGanadores;

  const participantesFiltrados = useMemo(() => {
    return participantes
      .filter((participante) => {
        if (filtro === "ganadores" && !participante.ganador) return false;
        if (filtro === "pendientes" && participante.ganador) return false;

        const texto = `${participante.nombre} ${participante.apellido} ${
          participante.resultado ?? ""
        }`.toLowerCase();

        return texto.includes(busqueda.toLowerCase());
      })
      .sort((a, b) => {
        if (a.ganador !== b.ganador) {
          return a.ganador ? -1 : 1;
        }

        return `${a.nombre} ${a.apellido}`.localeCompare(
          `${b.nombre} ${b.apellido}`
        );
      });
  }, [participantes, busqueda, filtro]);

  const alternarSeleccion = (alumnoId: number) => {
    setSeleccionados((prev) =>
      prev.includes(alumnoId)
        ? prev.filter((id) => id !== alumnoId)
        : [...prev, alumnoId]
    );
  };

  const seleccionarTodosVisibles = () => {
    const idsVisibles = participantesFiltrados
      .filter((p) => !p.ganador)
      .map((p) => p.alumnoId);

    const todosSeleccionados = idsVisibles.every((id) =>
      seleccionados.includes(id)
    );

    if (todosSeleccionados) {
      setSeleccionados((prev) =>
        prev.filter((id) => !idsVisibles.includes(id))
      );

      return;
    }

    setSeleccionados((prev) => Array.from(new Set([...prev, ...idsVisibles])));
  };

  const limpiarSeleccion = () => {
    setSeleccionados([]);
  };

  const abrirCrearRecompensa = () => {
    setEditandoRecompensa(null);
    setFormRecompensa(formRecompensaInicial);
    setModalRecompensa(true);
  };

  const abrirEditarRecompensa = (recompensa: Recompensa) => {
    let tipo: TipoRecompensa = "PRODUCTO_REGALO";

    if (recompensa.tipo === "CUOTA_GRATIS" || recompensa.otorgaCuotaGratis) {
      tipo = "CUOTA_GRATIS";
    } else if (recompensa.tipo === "DESCUENTO_CUOTA" || recompensa.descuentoId) {
      tipo = "DESCUENTO_CUOTA";
    }

    setEditandoRecompensa(recompensa);

    setFormRecompensa({
      descripcion: recompensa.descripcion ?? "",
      tipo,
      premioFisico: recompensa.premioFisico ?? "",
      descuentoId: recompensa.descuentoId ? String(recompensa.descuentoId) : "",
    });

    setModalRecompensa(true);
  };

  const validarRecompensa = () => {
    if (!formRecompensa.descripcion.trim()) {
      toast.error("La descripción es obligatoria");
      return false;
    }

    if (
      formRecompensa.tipo === "PRODUCTO_REGALO" &&
      !formRecompensa.premioFisico.trim()
    ) {
      toast.error("Indicá el premio físico");
      return false;
    }

    if (formRecompensa.tipo === "DESCUENTO_CUOTA") {
  const yaTieneEseDescuento = recompensas.some(
    (r) =>
      r.descuentoId === Number(formRecompensa.descuentoId) &&
      r.id !== editandoRecompensa?.id
  );

  if (yaTieneEseDescuento) {
    toast.error("Este desafío ya tiene una recompensa con ese descuento");
    return false;
  }
}

    if (formRecompensa.tipo === "CUOTA_GRATIS") {
      const yaTieneCuotaGratis = recompensas.some(
        (r) =>
          (r.tipo === "CUOTA_GRATIS" || r.otorgaCuotaGratis) &&
          r.id !== editandoRecompensa?.id
      );

      if (yaTieneCuotaGratis) {
        toast.error("Este desafío ya tiene una recompensa de cuota gratis");
        return false;
      }
    }

    return true;
  };

  const guardarRecompensa = async () => {
    if (!validarRecompensa()) return;

    const payload: Recompensa = {
      id: editandoRecompensa?.id ?? 0,
      desafioId,
      descripcion: formRecompensa.descripcion,
      tipo: formRecompensa.tipo,
      premioFisico:
        formRecompensa.tipo === "PRODUCTO_REGALO"
          ? formRecompensa.premioFisico
          : null,
      descuentoId:
        formRecompensa.tipo === "DESCUENTO_CUOTA"
          ? Number(formRecompensa.descuentoId)
          : null,
      otorgaCuotaGratis: formRecompensa.tipo === "CUOTA_GRATIS",
    };

    try {
      if (editandoRecompensa) {
        await editarRecompensa(editandoRecompensa.id, payload);
        toast.success("Recompensa actualizada correctamente");
      } else {
        await crearRecompensa(payload);
        toast.success("Recompensa creada correctamente");
      }

      setModalRecompensa(false);
      cargarDatos();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error.response?.data?.mensaje ?? "No fue posible guardar la recompensa"
      );
    }
  };

  const guardarDescuentoRapido = async () => {
    if (!formDescuento.nombre.trim()) {
      toast.error("El nombre del descuento es obligatorio");
      return;
    }

    if (!formDescuento.descripcion.trim()) {
      toast.error("La descripción del descuento es obligatoria");
      return;
    }

    try {
      setGuardandoDescuento(true);

     await crearDescuento({
  nombre: formDescuento.nombre,
  descripcion: formDescuento.descripcion,
  porcentaje: formDescuento.porcentaje,
  mesesDuracion: formDescuento.mesesDuracion,
  tipo: "DESAFIO",
  alcance: "ALUMNOS_SELECCIONADOS",
  desafioId: null,
  alumnosIds: [],
  soloPlantilla: true,
});

      const descuentosActualizados = await obtenerDescuentos();

      setDescuentos(descuentosActualizados);

      const descuentoCreado = descuentosActualizados.find(
        (d: Descuento) =>
          d.nombre === formDescuento.nombre &&
          d.porcentaje === formDescuento.porcentaje &&
          d.mesesDuracion === formDescuento.mesesDuracion
      );

      if (descuentoCreado) {
        setFormRecompensa((prev) => ({
          ...prev,
          descuentoId: String(descuentoCreado.id),
        }));
      }

      toast.success("Descuento creado correctamente");

      setModalDescuentoRapido(false);
      setFormDescuento(formDescuentoInicial);
    } catch (error: any) {
      console.error(error);

      toast.error(
        error.response?.data?.mensaje ?? "No fue posible crear el descuento"
      );
    } finally {
      setGuardandoDescuento(false);
    }
  };

  const confirmarEliminarRecompensa = async () => {
    if (!recompensaAEliminar) return;

    try {
      await eliminarRecompensa(recompensaAEliminar.id);

      toast.success("Recompensa eliminada correctamente");

      setRecompensaAEliminar(null);
      cargarDatos();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error.response?.data?.mensaje ??
          "No fue posible eliminar la recompensa"
      );
    }
  };

  const confirmarGanadores = async () => {
    if (seleccionados.length === 0) {
      toast.error("Seleccioná al menos un ganador");
      return;
    }

    if (recompensas.length === 0) {
      toast.error("Configurá al menos una recompensa antes de asignar ganadores");
      return;
    }

    try {
      setGuardando(true);

      await asignarGanadoresDesafio(desafioId, seleccionados);

      toast.success("Ganadores asignados correctamente");

      setConfirmando(false);
      setSeleccionados([]);

      cargarDatos();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error.response?.data?.mensaje ??
          "No fue posible asignar los ganadores"
      );
    } finally {
      setGuardando(false);
    }
  };

  const obtenerVisualRecompensa = (recompensa: Recompensa) => {
    if (recompensa.tipo === "CUOTA_GRATIS" || recompensa.otorgaCuotaGratis) {
      return {
        titulo: "Cuota gratis",
        detalle: "La próxima cuota del ganador quedará bonificada.",
        badge: "bg-purple-500/10 text-purple-300 border-purple-500/30",
      };
    }

    if (recompensa.tipo === "DESCUENTO_CUOTA" || recompensa.descuentoId) {
      const descuento = descuentos.find((d) => d.id === recompensa.descuentoId);

      return {
        titulo: "Descuento",
        detalle: descuento
          ? `${descuento.nombre} • ${descuento.porcentaje}% durante ${
              descuento.mesesDuracion
            } mes${descuento.mesesDuracion > 1 ? "es" : ""}`
          : "Descuento asociado",
        badge: "bg-[#4adea8]/10 text-[#4adea8] border-[#4adea8]/30",
      };
    }

    return {
      titulo: "Premio físico",
      detalle: recompensa.premioFisico ?? "Premio físico",
      badge: "bg-sky-500/10 text-sky-300 border-sky-500/30",
    };
  };

  if (loading) {
    return <FullScreenLoading />;
  }

  const estadoDesafio = obtenerEstado(desafio);

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      <TopBar />

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-10">

        <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-7 mb-8">
          <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
            <div>
              <span
                className={`inline-block px-3 py-1 rounded-full border text-xs font-bold mb-4 ${obtenerEstadoClase(
                  estadoDesafio
                )}`}
              >
                {estadoDesafio}
              </span>

              <h1 className="text-4xl font-bold">
                {desafio?.titulo ?? "Detalle del desafío"}
              </h1>

              <p className="text-gray-400 mt-3 max-w-3xl">
                {desafio?.descripcion ??
                  "Gestioná los participantes, recompensas y ganadores del desafío."}
              </p>

              <div className="mt-5 bg-[#12201b] border border-[#2d463b] rounded-2xl p-4 inline-block">
                <p className="text-sm text-gray-400">Duración</p>

                <p className="font-bold mt-1">
                  {formatearFecha(desafio?.fechaInicio)} -{" "}
                  {formatearFecha(desafio?.fechaFin)}
                </p>
              </div>
            </div>

            <button
              disabled={seleccionados.length === 0}
              onClick={() => setConfirmando(true)}
              className="px-6 py-3 rounded-xl bg-[#4adea8] text-[#12201b] font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Asignar ganadores
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <ResumenCard titulo="Participantes" valor={participantes.length} />
          <ResumenCard titulo="Ganadores" valor={totalGanadores} />
          <ResumenCard titulo="Pendientes" valor={totalPendientes} />
          <ResumenCard titulo="Seleccionados" valor={seleccionados.length} />
        </div>

        <section className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold">Recompensas del desafío</h2>

              <p className="text-gray-400 mt-1">
                Estas recompensas se entregarán a los alumnos que sean marcados
                como ganadores.
              </p>
            </div>

            <button
              type="button"
              onClick={abrirCrearRecompensa}
              className="px-5 py-3 rounded-xl bg-[#4adea8] text-[#12201b] font-bold hover:opacity-90 flex items-center justify-center gap-2"
            >
              <AddOutlinedIcon sx={{ fontSize: 18 }} />
              Nueva recompensa
            </button>
          </div>

          {recompensas.length === 0 ? (
            <div className="bg-[#12201b] border border-yellow-500/30 rounded-2xl p-5">
              <p className="text-yellow-300 font-bold">
                Este desafío todavía no tiene recompensas
              </p>

              <p className="text-sm text-gray-300 mt-1">
                Antes de asignar ganadores, configurá al menos una recompensa.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {recompensas.map((recompensa) => {
                const visual = obtenerVisualRecompensa(recompensa);

                return (
                  <div
                    key={recompensa.id}
                    className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-5"
                  >
                    <span
                      className={`inline-block px-3 py-1 rounded-full border text-xs font-bold mb-3 ${visual.badge}`}
                    >
                      {visual.titulo}
                    </span>

                    <h3 className="text-lg font-bold">
                      {recompensa.descripcion}
                    </h3>

                    <p className="text-sm text-gray-400 mt-2">
                      {visual.detalle}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mt-5">
                      <button
                        type="button"
                        onClick={() => abrirEditarRecompensa(recompensa)}
                        className="py-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 font-semibold hover:border-blue-400 flex items-center justify-center gap-2"
                      >
                        <EditOutlinedIcon sx={{ fontSize: 17 }} />
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => setRecompensaAEliminar(recompensa)}
                        className="py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-semibold hover:border-red-400 flex items-center justify-center gap-2"
                      >
                        <DeleteOutlineOutlinedIcon sx={{ fontSize: 17 }} />
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-5 mb-8">
          <div className="grid xl:grid-cols-[1fr_auto] gap-4">
            <FormInput
              value={busqueda}
              onChange={setBusqueda}
              placeholder="Buscar por nombre, apellido o resultado..."
            />

            <div className="flex flex-wrap gap-3">
              <BotonFiltro
                texto="Todos"
                activo={filtro === "todos"}
                onClick={() => setFiltro("todos")}
              />

              <BotonFiltro
                texto="Ganadores"
                activo={filtro === "ganadores"}
                onClick={() => setFiltro("ganadores")}
              />

              <BotonFiltro
                texto="Pendientes"
                activo={filtro === "pendientes"}
                onClick={() => setFiltro("pendientes")}
              />
            </div>
          </div>
        </div>

        {participantes.length > 0 && (
          <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-5 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Selección rápida</h2>

                <p className="text-sm text-gray-400 mt-1">
                  Podés seleccionar todos los participantes visibles que aún no
                  fueron marcados como ganadores.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={seleccionarTodosVisibles}
                  className="px-4 py-3 rounded-xl bg-[#12201b] border border-[#2d463b] text-[#4adea8] font-semibold hover:border-[#4adea8]"
                >
                  Seleccionar visibles
                </button>

                <button
                  type="button"
                  onClick={limpiarSeleccion}
                  disabled={seleccionados.length === 0}
                  className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-semibold hover:border-red-400 disabled:opacity-50"
                >
                  Limpiar selección
                </button>
              </div>
            </div>
          </div>
        )}

        {participantesFiltrados.length === 0 ? (
          <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-10 text-center">
            <h2 className="text-2xl font-bold mb-2">No hay participantes</h2>

            <p className="text-gray-400">
              No se encontraron alumnos para el filtro seleccionado.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {participantesFiltrados.map((participante) => {
              const seleccionado = seleccionados.includes(
                participante.alumnoId
              );

              return (
                <button
                  key={participante.alumnoId}
                  type="button"
                  disabled={participante.ganador}
                  onClick={() => alternarSeleccion(participante.alumnoId)}
                  className={`text-left rounded-3xl border p-6 transition-all ${
                    participante.ganador
                      ? "bg-[#4adea8]/10 border-[#4adea8]/30 cursor-default"
                      : seleccionado
                      ? "bg-[#4adea8]/10 border-[#4adea8]"
                      : "bg-[#1a2b24] border-[#2d463b] hover:border-[#4adea8]/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-14 h-14 rounded-full border flex items-center justify-center font-bold text-lg ${
                          participante.ganador || seleccionado
                            ? "bg-[#4adea8] text-[#12201b] border-[#4adea8]"
                            : "bg-[#12201b] text-[#4adea8] border-[#2d463b]"
                        }`}
                      >
                        {participante.ganador || seleccionado
                          ? "✓"
                          : `${participante.nombre[0]}${participante.apellido[0]}`}
                      </div>

                      <div>
                        <h3 className="text-xl font-bold">
                          {participante.nombre} {participante.apellido}
                        </h3>

                        <p className="text-gray-400 text-sm">
                          Participante del desafío
                        </p>
                      </div>
                    </div>

                    {participante.ganador ? (
                      <span className="px-3 py-1 rounded-full bg-[#4adea8]/10 text-[#4adea8] border border-[#4adea8]/30 text-xs font-bold">
                        Ganador
                      </span>
                    ) : seleccionado ? (
                      <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 text-xs font-bold">
                        Seleccionado
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-300 border border-yellow-500/30 text-xs font-bold">
                        Pendiente
                      </span>
                    )}
                  </div>

                  <div className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-4">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">
                      Resultado
                    </p>

                    <p className="font-semibold mt-2">
                      {participante.resultado ?? "Sin resultado registrado"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>

      {modalRecompensa && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] px-4">
          <div className="w-full max-w-xl bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-2">
              {editandoRecompensa ? "Editar recompensa" : "Nueva recompensa"}
            </h2>

            <p className="text-gray-400 mb-6">
              Esta recompensa quedará asociada a este desafío.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Tipo de recompensa
                </label>

                <select
                  value={formRecompensa.tipo}
                  onChange={(e) =>
                    setFormRecompensa({
                      ...formRecompensa,
                      tipo: e.target.value as TipoRecompensa,
                      premioFisico: "",
                      descuentoId: "",
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
                  value={formRecompensa.descripcion}
                  onChange={(e) =>
                    setFormRecompensa({
                      ...formRecompensa,
                      descripcion: e.target.value,
                    })
                  }
                  placeholder="Ej: Premio para ganadores del desafío"
                  className="w-full p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8]"
                />
              </div>

              {formRecompensa.tipo === "PRODUCTO_REGALO" && (
                <FormInput
                  label="Premio físico"
                  value={formRecompensa.premioFisico}
                  onChange={(value) =>
                    setFormRecompensa({
                      ...formRecompensa,
                      premioFisico: value,
                    })
                  }
                  placeholder="Ej: Remera, botella, medalla"
                />
              )}

              {formRecompensa.tipo === "DESCUENTO_CUOTA" && (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Descuento
                  </label>

                  <select
                    value={formRecompensa.descuentoId}
                    onChange={(e) =>
                      setFormRecompensa({
                        ...formRecompensa,
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
                    onClick={() => setModalDescuentoRapido(true)}
                    className="mt-3 text-[#4adea8] text-sm font-semibold hover:underline"
                  >
                    ¿No existe el descuento que necesitás? Crear uno nuevo
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

                      <p className="text-sm text-gray-300">
                        {descuentoSeleccionado.nombre} —{" "}
                        {descuentoSeleccionado.porcentaje}% durante{" "}
                        {descuentoSeleccionado.mesesDuracion} mes
                        {descuentoSeleccionado.mesesDuracion > 1 ? "es" : ""}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <VistaPreviaRecompensa
                form={formRecompensa}
                descuentoSeleccionado={descuentoSeleccionado}
              />
            </div>

            <div className="flex justify-end gap-3 mt-7">
              <button
                onClick={() => setModalRecompensa(false)}
                className="px-5 py-3 rounded-xl bg-[#12201b] border border-[#2d463b] hover:border-[#4adea8]"
              >
                Cancelar
              </button>

              <button
                onClick={guardarRecompensa}
                className="px-5 py-3 rounded-xl bg-[#4adea8] text-[#12201b] font-bold hover:opacity-90"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {modalDescuentoRapido && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[10000] px-4">
          <div className="w-full max-w-lg bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-7 shadow-2xl">
            <h2 className="text-2xl font-bold mb-2">Crear descuento</h2>

            <p className="text-gray-400 mb-6">
              Creá un descuento para usarlo en esta recompensa.
            </p>

            <div className="space-y-4">
              <FormInput
                label="Nombre"
                value={formDescuento.nombre}
                onChange={(value) =>
                  setFormDescuento({
                    ...formDescuento,
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
                  value={formDescuento.descripcion}
                  onChange={(e) =>
                    setFormDescuento({
                      ...formDescuento,
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
                    value={formDescuento.porcentaje}
                    onChange={(e) =>
                      setFormDescuento({
                        ...formDescuento,
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
                    value={formDescuento.mesesDuracion}
                    onChange={(e) =>
                      setFormDescuento({
                        ...formDescuento,
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

              <div className="rounded-2xl border border-[#4adea8]/30 bg-[#4adea8]/10 p-4">
                <p className="text-[#4adea8] font-bold">Vista previa</p>

                <p className="text-sm text-gray-300 mt-2">
                  Los ganadores recibirán un descuento de{" "}
                  <strong>{formDescuento.porcentaje}%</strong> durante{" "}
                  <strong>
                    {formDescuento.mesesDuracion} mes
                    {formDescuento.mesesDuracion > 1 ? "es" : ""}
                  </strong>
                  .
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-7">
              <button
                disabled={guardandoDescuento}
                onClick={() => setModalDescuentoRapido(false)}
                className="px-5 py-3 rounded-xl bg-[#12201b] border border-[#2d463b] hover:border-[#4adea8] disabled:opacity-60"
              >
                Cancelar
              </button>

              <button
                disabled={guardandoDescuento}
                onClick={guardarDescuentoRapido}
                className="px-5 py-3 rounded-xl bg-[#4adea8] text-[#12201b] font-bold hover:opacity-90 disabled:opacity-60"
              >
                {guardandoDescuento ? "Guardando..." : "Guardar descuento"}
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
              Esta recompensa dejará de estar asociada al desafío.
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
                onClick={confirmarEliminarRecompensa}
                className="px-5 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmando && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] px-4">
          <div className="w-full max-w-lg bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-7 shadow-2xl">
            <h2 className="text-2xl font-bold mb-2">
              Confirmar asignación
            </h2>

            <p className="text-gray-400 mb-6">
              Se marcarán {seleccionados.length} alumno
              {seleccionados.length === 1 ? "" : "s"} como ganador
              {seleccionados.length === 1 ? "" : "es"}.
            </p>

            <div className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-5 mb-6">
              <p className="font-bold mb-3">Recibirán:</p>

              <div className="space-y-2 text-sm text-gray-300">
                {recompensas.map((recompensa) => {
                  const visual = obtenerVisualRecompensa(recompensa);

                  return (
                    <p key={recompensa.id}>
                      ✔ {visual.titulo}: {visual.detalle}
                    </p>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                disabled={guardando}
                onClick={() => setConfirmando(false)}
                className="px-5 py-3 rounded-xl bg-[#12201b] border border-[#2d463b] hover:border-[#4adea8] disabled:opacity-60"
              >
                Cancelar
              </button>

              <button
                disabled={guardando}
                onClick={confirmarGanadores}
                className="px-5 py-3 rounded-xl bg-[#4adea8] text-[#12201b] font-bold hover:opacity-90 disabled:opacity-60"
              >
                {guardando ? "Confirmando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}