import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";

import {
  obtenerSolicitudesPendientes,
  resolverSolicitud,
} from "../services/AdminReactivacion.Service";

import type { SolicitudReactivacion } from "../types";

import FullScreenLoading from "../components/FullScreenSpinner";
import TopBar from "../components/navigation/DashboardTopBar";

export default function AdminReactivacionesPage() {

  const [solicitudes, setSolicitudes] = useState<SolicitudReactivacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolviendo, setResolviendo] = useState(false);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] =
    useState<SolicitudReactivacion | null>(null);

  const [aprobar, setAprobar] = useState(true);
  const [respuestaAdmin, setRespuestaAdmin] = useState("");

  const cargarDatos = async () => {
    try {
      setLoading(true);

      const data = await obtenerSolicitudesPendientes();

      setSolicitudes(data ?? []);
    } catch (error) {
      console.error(error);

      toast.error("No fue posible cargar las solicitudes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void cargarDatos();
  }, []);

  const solicitudesOrdenadas = useMemo(() => {
    return [...solicitudes].sort(
      (a, b) =>
        new Date(a.fechaSolicitud).getTime() -
        new Date(b.fechaSolicitud).getTime(),
    );
  }, [solicitudes]);

  const abrirResolver = (
    solicitud: SolicitudReactivacion,
    aprobarSolicitud: boolean,
  ) => {
    setSolicitudSeleccionada(solicitud);
    setAprobar(aprobarSolicitud);
    setRespuestaAdmin("");
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    if (resolviendo) return;

    setModalAbierto(false);
    setSolicitudSeleccionada(null);
    setRespuestaAdmin("");
  };

  const confirmarResolver = async () => {
    if (!solicitudSeleccionada) {
      return;
    }

    if (!aprobar && !respuestaAdmin.trim()) {
      toast.error("Ingresá el motivo del rechazo");
      return;
    }

    try {
      setResolviendo(true);

      await resolverSolicitud(
        solicitudSeleccionada.id,
        aprobar,
        respuestaAdmin.trim(),
      );

      toast.success(
        aprobar
          ? "Solicitud aprobada correctamente"
          : "Solicitud rechazada correctamente",
      );

      cerrarModal();

      await cargarDatos();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.mensaje ??
          "No fue posible resolver la solicitud",
      );
    } finally {
      setResolviendo(false);
    }
  };

  const obtenerIniciales = (nombre?: string) => {
    if (!nombre?.trim()) return "A";

    return nombre
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((parte) => parte.charAt(0))
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return <FullScreenLoading />;
  }

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      <TopBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-10">

        <section className="rounded-3xl border border-[#4adea8]/20 bg-gradient-to-r from-[#1a2b24] to-[#163129] p-6 md:p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#4adea8]/10 border border-[#4adea8]/30 flex items-center justify-center">
                  <AutorenewOutlinedIcon className="text-[#4adea8]" />
                </div>

                <div>
                  <p className="text-[#4adea8] text-xs font-bold uppercase tracking-wide">
                    Administración
                  </p>

                  <h1 className="text-3xl md:text-4xl font-bold mt-1">
                    Reactivaciones
                  </h1>
                </div>
              </div>

              <p className="text-gray-300 mt-5 max-w-2xl">
                Revisá y resolvé las solicitudes de alumnos bloqueados que
                quieren volver a inscribirse.
              </p>
            </div>

            <div className="w-full lg:w-auto min-w-48 rounded-2xl bg-[#12201b] border border-[#2d463b] p-5">
              <p className="text-sm text-gray-400">
                Solicitudes pendientes
              </p>

              <p className="text-4xl font-bold text-[#4adea8] mt-2">
                {solicitudes.length}
              </p>
            </div>
          </div>
        </section>

        {solicitudesOrdenadas.length === 0 ? (
          <section className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-10 md:p-14 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#4adea8]/10 border border-[#4adea8]/30 flex items-center justify-center">
              <InboxOutlinedIcon
                sx={{
                  fontSize: 36,
                  color: "#4adea8",
                }}
              />
            </div>

            <h2 className="text-2xl font-bold mt-5">
              No hay solicitudes pendientes
            </h2>

            <p className="text-gray-400 mt-2 max-w-xl mx-auto">
              Cuando un alumno solicite reactivar su cuenta, aparecerá en esta
              sección para que puedas revisarla.
            </p>
          </section>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {solicitudesOrdenadas.map((solicitud) => (
              <article
                key={solicitud.id}
                className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6 hover:border-[#4adea8]/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 shrink-0 rounded-full bg-[#4adea8] text-[#12201b] font-bold flex items-center justify-center">
                    {obtenerIniciales(solicitud.nombreAlumno)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="inline-flex px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase">
                      Pendiente
                    </span>

                    <h2 className="text-2xl font-bold mt-3 break-words">
                      {solicitud.nombreAlumno}
                    </h2>

                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                      <EventOutlinedIcon fontSize="small" />

                      <span>
                        Solicitada el{" "}
                        {formatearFecha(solicitud.fechaSolicitud)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-[#12201b] border border-[#2d463b] rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <MessageOutlinedIcon
                      className="text-[#4adea8] mt-0.5"
                      fontSize="small"
                    />

                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Motivo del alumno
                      </p>

                      <p className="text-gray-200 mt-2 leading-relaxed">
                        {solicitud.motivoAlumno?.trim() ||
                          "El alumno no agregó un motivo."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => abrirResolver(solicitud, true)}
                    className="py-3 rounded-xl bg-[#4adea8] text-[#12201b] font-bold flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all"
                  >
                    <CheckCircleOutlineOutlinedIcon fontSize="small" />
                    Aprobar reactivación
                  </button>

                  <button
                    type="button"
                    onClick={() => abrirResolver(solicitud, false)}
                    className="py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold flex items-center justify-center gap-2 hover:border-red-400 transition-all"
                  >
                    <CloseOutlinedIcon fontSize="small" />
                    Rechazar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {modalAbierto && solicitudSeleccionada && (
        <div className="fixed inset-0 z-[9999] bg-black/70 px-4 flex items-center justify-center">
          <div
            className={`w-full max-w-lg bg-[#1a2b24] rounded-3xl p-7 shadow-2xl border ${
              aprobar
                ? "border-[#4adea8]/30"
                : "border-red-500/30"
            }`}
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 border ${
                aprobar
                  ? "bg-[#4adea8]/10 border-[#4adea8]/30 text-[#4adea8]"
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              }`}
            >
              {aprobar ? (
                <CheckCircleOutlineOutlinedIcon
                  sx={{ fontSize: 30 }}
                />
              ) : (
                <CloseOutlinedIcon sx={{ fontSize: 30 }} />
              )}
            </div>

            <p
              className={`text-xs font-bold uppercase tracking-wide ${
                aprobar ? "text-[#4adea8]" : "text-red-400"
              }`}
            >
              {aprobar ? "Aprobar solicitud" : "Rechazar solicitud"}
            </p>

            <h2 className="text-2xl font-bold mt-2">
              {aprobar
                ? "¿Reactivar al alumno?"
                : "¿Rechazar la solicitud?"}
            </h2>

            <p className="text-gray-400 mt-3">
              {aprobar
                ? "El alumno volverá a quedar habilitado para inscribirse."
                : "La solicitud será rechazada y el alumno recibirá la respuesta ingresada."}
            </p>

            <div className="mt-6 bg-[#12201b] border border-[#2d463b] rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <PersonOutlineOutlinedIcon
                  className="text-[#4adea8]"
                  fontSize="small"
                />

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Alumno
                  </p>

                  <p className="font-bold mt-1">
                    {solicitudSeleccionada.nombreAlumno}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <label className="block text-sm text-gray-400 mb-2">
                {aprobar
                  ? "Mensaje para el alumno (opcional)"
                  : "Motivo del rechazo"}
              </label>

              <textarea
                value={respuestaAdmin}
                onChange={(e) =>
                  setRespuestaAdmin(e.target.value)
                }
                placeholder={
                  aprobar
                    ? "Ej: Tu cuenta fue reactivada correctamente."
                    : "Explicá por qué no se aprueba la reactivación."
                }
                rows={5}
                className="w-full p-4 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8] resize-none"
              />

              {!aprobar && (
                <p className="text-xs text-gray-500 mt-2">
                  Este campo es obligatorio para rechazar la solicitud.
                </p>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-7">
              <button
                type="button"
                onClick={cerrarModal}
                disabled={resolviendo}
                className="px-5 py-3 rounded-xl bg-[#12201b] border border-[#2d463b] text-gray-200 font-semibold hover:border-[#4adea8] disabled:opacity-50 transition-all"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmarResolver}
                disabled={resolviendo}
                className={`px-5 py-3 rounded-xl font-bold disabled:opacity-50 transition-all ${
                  aprobar
                    ? "bg-[#4adea8] text-[#12201b] hover:brightness-110"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                {resolviendo
                  ? "Procesando..."
                  : aprobar
                  ? "Sí, reactivar"
                  : "Confirmar rechazo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatearFecha(fecha: string) {
  const fechaSinHora = fecha.substring(0, 10);
  const [anio, mes, dia] =
    fechaSinHora.split("-").map(Number);

  return new Date(anio, mes - 1, dia).toLocaleDateString(
    "es-UY",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  );
}