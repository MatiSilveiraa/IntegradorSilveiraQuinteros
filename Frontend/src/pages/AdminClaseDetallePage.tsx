import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import TopBar from "../components/navigation/DashboardTopBar";
import FullScreenLoading from "../components/FullScreenSpinner";
import ResumenCard from "../components/ui/ResumenCard";
import ClassLocationMap from "../components/maps/ClassLocationMap";
import AlumnoDetalleModal from "../components/admin/Alumnos/AlumnoDetalleModal";

import {
  obtenerClasePorId,
  cambiarEstadoClase,
  obtenerInscriptosClase,
} from "../services/Clase.Service";
import { obtenerAlumno } from "../services/AdminAlumno.Service";

import type { Alumno, Clase, EstadoClaseValor, InscriptoClase } from "../types";

type TabClase =
  | "informacion"
  | "inscriptos"
  | "espera"
  | "asistencias"
  | "auditoria";

const estados = [
  { value: 0, label: "Programada" },
  { value: 1, label: "Realizada" },
  { value: 2, label: "Cancelada" },
  { value: 3, label: "Suspendida" },
];


export default function AdminClaseDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [clase, setClase] = useState<Clase | null>(null);

  const [inscriptos, setInscriptos] = useState<InscriptoClase[]>([]);
const [busquedaInscriptos, setBusquedaInscriptos] = useState("");
  const [detalleAlumno, setDetalleAlumno] = useState<Alumno | null>(null);
  const [cargandoDetalleAlumno, setCargandoDetalleAlumno] = useState(false);


  const [modalEstado, setModalEstado] = useState(false);
  const [estado, setEstado] = useState<EstadoClaseValor>(0);
  const [motivo, setMotivo] = useState("");

  const [tabActiva, setTabActiva] =
    useState<TabClase>("informacion");

  const cargarClase = async () => {
    try {
      setLoading(true);

      const data = await obtenerClasePorId(Number(id));

      setClase(data);

const inscriptosData = await obtenerInscriptosClase(Number(id));
setInscriptos(inscriptosData);

      const actual = estados.find(
        (x) =>
          x.label.toUpperCase() ===
          data.estado?.toUpperCase(),
      );

      setEstado((actual?.value ?? 0) as EstadoClaseValor);
    } catch (error) {
      console.error(error);
      toast.error("No fue posible cargar la clase.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClase();
  }, []);

  const inscriptosFiltrados = inscriptos.filter((alumno) => {
  const texto = `${alumno.nombre} ${alumno.apellido} ${alumno.email}`.toLowerCase();

  return texto.includes(busquedaInscriptos.toLowerCase());
});

  const resumen = useMemo(() => {
    return {
      cupos: clase?.cupoMaximo ?? 0,
      ocupados: clase?.cantidadInscriptos ?? 0,
      disponibles:
        (clase?.cupoMaximo ?? 0) - (clase?.cantidadInscriptos ?? 0),
    };
  }, [clase]);

  const abrirDetalleAlumno = async (alumnoId: number) => {
    try {
      setCargandoDetalleAlumno(true);

      const data = await obtenerAlumno(alumnoId);

      setDetalleAlumno(data);
    } catch (error: any) {
      if (!error?.response || error.response.status >= 500) {
        console.error("[Detalle alumno desde clase]", error);
      }

      toast.error(
        error?.response?.data?.mensaje ??
          "No fue posible obtener el detalle del alumno.",
      );
    } finally {
      setCargandoDetalleAlumno(false);
    }
  };

  const guardarEstado = async () => {
    try {
      await cambiarEstadoClase(Number(id), {
        estado,
        motivo: motivo || undefined,
      });

      toast.success("Estado actualizado correctamente.");

      setModalEstado(false);
      cargarClase();
    } catch (error) {
      console.error(error);
      toast.error("No fue posible actualizar el estado.");
    }
  };

  const formatearFecha = (fecha?: string | null) => {
    if (!fecha) return "-";

    return new Date(fecha).toLocaleDateString("es-UY", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatearHora = (hora?: string | null) => {
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

  const obtenerColorEstado = (estadoClase?: string) => {
    const normalizado = estadoClase?.toUpperCase();

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

  const tabs = [
    { id: "informacion", label: "Información" },
    { id: "inscriptos", label: "Inscriptos" },
    { id: "espera", label: "Lista de espera" },
    { id: "asistencias", label: "Asistencias" },
    { id: "auditoria", label: "Auditoría" },
  ] as const;

  if (loading) {
    return <FullScreenLoading />;
  }

  if (!clase) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      <TopBar />

      <main className="max-w-7xl mx-auto pt-24 px-6 pb-10">

        <section className="mb-8 rounded-3xl border border-[#2d463b] bg-gradient-to-r from-[#1a2b24] to-[#163129] p-6 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${obtenerColorEstado(
                  clase.estado,
                )}`}
              >
                {clase.estado}
              </span>

              <p className="mt-5 text-xs font-bold uppercase tracking-wide text-[#4adea8]">
                Clase
              </p>

              <h1 className="mt-1 break-words text-3xl font-bold sm:text-4xl">
                {clase.grupoNombre ?? "Clase sin grupo"}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-gray-300">
                <span className="font-semibold">
                  {clase.diaSemana}
                </span>

                <span className="text-gray-600">•</span>

                <span>
                  {formatearHora(clase.horaInicio)} -{" "}
                  {formatearHora(clase.horaFin)}
                </span>
              </div>
            </div>

            <div className="grid min-w-[220px] grid-cols-2 gap-3">
              <div className="rounded-2xl border border-[#2d463b] bg-[#12201b] p-4">
                <p className="text-xs text-gray-500">
                  Tipo
                </p>

                <p className="mt-1 font-semibold">
                  {clase.esFija ? "Clase fija" : "Clase puntual"}
                </p>
              </div>

              <div className="rounded-2xl border border-[#2d463b] bg-[#12201b] p-4">
                <p className="text-xs text-gray-500">
                  Cupo
                </p>

                <p className="mt-1 font-semibold">
                  {clase.cantidadInscriptos ?? 0}/{clase.cupoMaximo}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid md:grid-cols-3 gap-5 mb-8">
          <ResumenCard titulo="Cupos" valor={resumen.cupos} />

          <ResumenCard titulo="Ocupados" valor={resumen.ocupados} />

          <ResumenCard titulo="Disponibles" valor={resumen.disponibles} />
        </div>

        <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTabActiva(tab.id)}
                className={`px-5 py-3 rounded-xl font-semibold transition-all ${
                  tabActiva === tab.id
                    ? "bg-[#4adea8] text-[#12201b]"
                    : "bg-[#12201b] border border-[#2d463b] text-gray-300 hover:border-[#4adea8]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {tabActiva === "informacion" && (
          <div className="space-y-6">
            <div className="grid xl:grid-cols-2 gap-6">
              <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6">
                <h2 className="text-xl font-bold mb-6">Información</h2>

                <div className="space-y-3">
                  <Info
                    titulo="Grupo"
                    valor={clase.grupoNombre ?? "-"}
                  />

                  <Info
                    titulo="Horario"
                    valor={`${formatearHora(
                      clase.horaInicio,
                    )} - ${formatearHora(
                      clase.horaFin,
                    )}`}
                  />

                  <Info
                    titulo="Tipo"
                    valor={clase.esFija ? "Clase fija" : "Clase puntual"}
                  />

                  <Info
                    titulo="Fecha inicio"
                    valor={formatearFecha(clase.fechaInicio)}
                  />

                  <Info
                    titulo="Fecha fin"
                    valor={
                      clase.fechaFin
                        ? formatearFecha(clase.fechaFin)
                        : "Sin fecha de finalización"
                    }
                  />
                </div>
              </div>

              <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6">
                <h2 className="text-xl font-bold mb-6">Acciones</h2>

                <div className="space-y-4">
                  <button
                    onClick={() => navigate(`/admin/clases/editar/${id}`)}
                    className="w-full py-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 font-bold"
                  >
                    Editar clase
                  </button>

                  <button
                    onClick={() => setModalEstado(true)}
                    className="w-full py-3 rounded-xl bg-[#4adea8] text-[#12201b] font-bold"
                  >
                    Cambiar estado
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6">
              <h2 className="text-xl font-bold mb-5">Ubicación</h2>

              <ClassLocationMap
                latitud={clase.latitud}
                longitud={clase.longitud}
                radio={clase.radioGeolocalizacion}
                editable={false}
              />

              <div className="mt-6 bg-[#12201b] border border-[#2d463b] rounded-2xl p-5">
                <Info
                  titulo="Radio permitido"
                  valor={`${clase.radioGeolocalizacion} metros`}
                />
              </div>
            </div>
          </div>
        )}

        {tabActiva === "inscriptos" && (
  <div className="space-y-6">
    <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-bold">Inscriptos</h2>

          <p className="text-gray-400 mt-1">
            Alumnos actualmente inscriptos a esta clase.
          </p>
        </div>

        <div className="bg-[#12201b] border border-[#2d463b] rounded-2xl px-5 py-3">
          <p className="text-sm text-gray-400">Total</p>
          <p className="text-2xl font-bold text-[#4adea8]">
            {inscriptos.length}
          </p>
        </div>
      </div>

      <input
        value={busquedaInscriptos}
        onChange={(e) => setBusquedaInscriptos(e.target.value)}
        placeholder="Buscar por nombre, apellido o email..."
        className="w-full p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8]"
      />
    </div>

    {inscriptosFiltrados.length === 0 ? (
      <EstadoVacio
        titulo="Sin alumnos inscriptos"
        descripcion="No hay alumnos para mostrar en esta clase."
      />
    ) : (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {inscriptosFiltrados.map((alumno) => (
          <div
            key={alumno.alumnoId}
            className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-[#4adea8]/10 text-[#4adea8] border border-[#4adea8]/30 text-xs font-bold mb-4">
              {alumno.estadoAlumno}
            </span>

            <h3 className="text-xl font-bold">
              {alumno.nombre} {alumno.apellido}
            </h3>

            <div className="mt-5 space-y-3">
              <Info titulo="Email" valor={alumno.email ?? "-"} />

              <Info titulo="Celular" valor={alumno.celular ?? "-"} />

              <Info
                titulo="Inscripción"
                valor={formatearFecha(alumno.fechaInscripcion)}
              />
            </div>

            <button
              onClick={() => void abrirDetalleAlumno(alumno.alumnoId)}
              className="w-full mt-5 py-3 rounded-xl bg-[#12201b] border border-[#2d463b] hover:border-[#4adea8] font-semibold"
            >
              Ver alumno
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
)}

        {tabActiva === "espera" && (
          <EstadoVacio
            titulo="Lista de espera"
            descripcion="Próximamente se mostrará la lista de alumnos esperando cupo."
          />
        )}

        {tabActiva === "asistencias" && (
          <EstadoVacio
            titulo="Asistencias"
            descripcion="Próximamente se mostrará el historial de asistencias de esta clase."
          />
        )}

        {tabActiva === "auditoria" && (
          <EstadoVacio
            titulo="Auditoría"
            descripcion="Próximamente se mostrará el historial de cambios realizados sobre esta clase."
          />
        )}
      </main>

      {cargandoDetalleAlumno && <FullScreenLoading />}

      <AlumnoDetalleModal
        alumno={detalleAlumno}
        onCerrar={() => setDetalleAlumno(null)}
      />

      {modalEstado && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] px-4">
          <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-8 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-2">Cambiar estado</h2>

            <p className="text-gray-400 mb-6">
              Si suspendés o cancelás una clase, los alumnos inscriptos serán
              notificados.
            </p>

            <select
              value={estado}
              onChange={(e) =>
                setEstado(Number(e.target.value) as EstadoClaseValor)
              }
              className="w-full p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8]"
            >
              {estados.map((x) => (
                <option key={x.value} value={x.value}>
                  {x.label}
                </option>
              ))}
            </select>

            <textarea
              rows={4}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Motivo opcional"
              className="w-full mt-5 p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8]"
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setModalEstado(false)}
                className="px-5 py-3 rounded-xl bg-[#12201b] border border-[#2d463b] hover:border-[#4adea8]"
              >
                Cancelar
              </button>

              <button
                onClick={guardarEstado}
                className="bg-[#4adea8] px-5 py-3 rounded-xl text-[#12201b] font-bold"
              >
                Guardar cambio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Info({
  titulo,
  valor,
}: {
  titulo: string;
  valor: string;
}) {
  return (
    <div className="flex justify-between border-b border-[#2d463b] py-3 gap-4">
      <span className="text-gray-400">{titulo}</span>

      <span className="font-semibold text-right">{valor}</span>
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
      <h2 className="text-2xl font-bold mb-3">{titulo}</h2>

      <p className="text-gray-400">{descripcion}</p>
    </div>
  );
}