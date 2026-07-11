import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import MyLocationOutlinedIcon from "@mui/icons-material/MyLocationOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";

import AlumnoLayout from "../../components/layout/DashboardLayout";
import FullScreenLoading from "../../components/FullScreenSpinner";
import LocationMap from "../../components/maps/LocationMap";
import ClassLocationMap from "../../components/maps/ClassLocationMap";

import { obtenerMisClases } from "../../services/Inscripciones.Service";
import { registrarAsistenciaGeolocalizacion } from "../../services/Asistencia.Service";
import { obtenerMiHistorial } from "../../services/Historial.service";

import obtenerDiaActual from "../../utils/dayUtils";
import { calcularDistancia } from "../../utils/geolocationUtils";
import { configurarLeaflet } from "../../utils/leafletUtils";

import type { Clase, Historial } from "../../types";

configurarLeaflet();

type EstadoPantalla =
  | "cargando"
  | "sin-clases"
  | "sin-clase-hoy"
  | "ubicacion-pendiente"
  | "listo"
  | "registrando"
  | "registrada"
  | "error-ubicacion";

type TabActiva = "registrar" | "historial";

type Coordenadas = {
  latitud: number;
  longitud: number;
};

type AsistenciaHistorial = {
  id: number;
  claseId: number;
  fecha: string;
  presente: boolean;
  estado: string;
};

export default function AsistenciasPage() {
  const [loading, setLoading] = useState(true);
  const [misClases, setMisClases] = useState<Clase[]>([]);
  const [historial, setHistorial] = useState<Historial | null>(null);

  const [ubicacion, setUbicacion] = useState<Coordenadas | null>(null);
  const [ultimaActualizacion, setUltimaActualizacion] = useState("");

  const [estadoPantalla, setEstadoPantalla] =
    useState<EstadoPantalla>("cargando");

  const [tabActiva, setTabActiva] =
    useState<TabActiva>("registrar");

  const [mensajeResultado, setMensajeResultado] = useState("");
  const [horaRegistro, setHoraRegistro] = useState("");
  const [obteniendoUbicacion, setObteniendoUbicacion] = useState(false);

  useEffect(() => {
    cargarPantalla();
  }, []);

  const cargarPantalla = async () => {
    try {
      setLoading(true);
      setEstadoPantalla("cargando");

      const [clasesData, historialData] = await Promise.all([
        obtenerMisClases(),
        obtenerMiHistorial(),
      ]);

      const clases = clasesData ?? [];

      setMisClases(clases);
      setHistorial(historialData);

      if (!clases.length) {
        setEstadoPantalla("sin-clases");
        return;
      }

      const diaActual = obtenerDiaActual();

      const hayClaseHoy = clases.some(
        (clase: Clase) =>
          normalizarTexto(clase.diaSemana) ===
          normalizarTexto(diaActual)
      );

      if (!hayClaseHoy) {
        setEstadoPantalla("sin-clase-hoy");
        return;
      }

      setEstadoPantalla("ubicacion-pendiente");

      await solicitarUbicacion();
    } catch (error) {
      console.error(error);

      toast.error("No fue posible cargar las asistencias");
      setEstadoPantalla("sin-clases");
    } finally {
      setLoading(false);
    }
  };

  const clasesDeHoy = useMemo(() => {
    const diaActual = obtenerDiaActual();

    return misClases
      .filter(
        (clase) =>
          normalizarTexto(clase.diaSemana) ===
          normalizarTexto(diaActual)
      )
      .sort((a, b) =>
        formatearHora(a.horaInicio).localeCompare(
          formatearHora(b.horaInicio)
        )
      );
  }, [misClases]);

  const claseActual = useMemo(() => {
    if (!clasesDeHoy.length) {
      return undefined;
    }

    const ahora = new Date();
    const minutosActuales =
      ahora.getHours() * 60 + ahora.getMinutes();

    const claseEnCurso = clasesDeHoy.find((clase) => {
      const inicioPermitido =
        horaAMinutos(clase.horaInicio) - 5;

      const finPermitido =
        horaAMinutos(clase.horaFin);

      return (
        minutosActuales >= inicioPermitido &&
        minutosActuales <= finPermitido
      );
    });

    if (claseEnCurso) {
      return claseEnCurso;
    }

    const proximaClase = clasesDeHoy.find(
      (clase) =>
        horaAMinutos(clase.horaInicio) >
        minutosActuales
    );

    return (
      proximaClase ??
      clasesDeHoy[clasesDeHoy.length - 1]
    );
  }, [clasesDeHoy]);

  const asistenciasHistorial =
    (historial?.asistencias ?? []) as AsistenciaHistorial[];

  const asistenciaRegistradaHoy = useMemo(() => {
    if (!claseActual) {
      return undefined;
    }

    const fechaHoy = obtenerFechaLocalISO();

    return asistenciasHistorial.find(
      (asistencia) =>
        asistencia.claseId === claseActual.id &&
        obtenerFechaISO(asistencia.fecha) === fechaHoy &&
        asistencia.presente
    );
  }, [asistenciasHistorial, claseActual]);

  useEffect(() => {
    if (!asistenciaRegistradaHoy) {
      return;
    }

    setEstadoPantalla("registrada");
    setMensajeResultado("La asistencia ya fue registrada para esta clase.");

    setHoraRegistro(
      asistenciaRegistradaHoy.fecha.includes("T")
        ? formatearHoraDesdeFecha(asistenciaRegistradaHoy.fecha)
        : ""
    );
  }, [asistenciaRegistradaHoy]);

  const distancia = useMemo(() => {
    if (
      !claseActual ||
      !ubicacion ||
      claseActual.latitud === undefined ||
      claseActual.longitud === undefined
    ) {
      return null;
    }

    return calcularDistancia(
      ubicacion.latitud,
      ubicacion.longitud,
      claseActual.latitud,
      claseActual.longitud
    );
  }, [claseActual, ubicacion]);

  const dentroDelRadio =
    distancia !== null &&
    claseActual !== undefined &&
    distancia <= claseActual.radioGeolocalizacion;

  const horarioDisponible = useMemo(() => {
    if (!claseActual) {
      return false;
    }

    const ahora = new Date();
    const minutosActuales =
      ahora.getHours() * 60 + ahora.getMinutes();

    const inicioPermitido =
      horaAMinutos(claseActual.horaInicio) - 5;

    const finPermitido =
      horaAMinutos(claseActual.horaFin);

    return (
      minutosActuales >= inicioPermitido &&
      minutosActuales <= finPermitido
    );
  }, [claseActual]);

  const asistenciaYaRegistrada =
    Boolean(asistenciaRegistradaHoy) ||
    estadoPantalla === "registrada";

  const puedeConfirmar =
    Boolean(claseActual) &&
    Boolean(ubicacion) &&
    dentroDelRadio &&
    horarioDisponible &&
    !asistenciaYaRegistrada &&
    estadoPantalla !== "registrando";

  const solicitarUbicacion = async () => {
    if (!navigator.geolocation) {
      setEstadoPantalla("error-ubicacion");

      toast.error(
        "Tu navegador no permite obtener la ubicación."
      );

      return;
    }

    try {
      setObteniendoUbicacion(true);

      if (!asistenciaYaRegistrada) {
        setEstadoPantalla("ubicacion-pendiente");
      }

      const posicion = await obtenerPosicionActual();

      setUbicacion({
        latitud: posicion.coords.latitude,
        longitud: posicion.coords.longitude,
      });

      setUltimaActualizacion(
        new Date().toLocaleTimeString("es-UY", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );

      if (!asistenciaYaRegistrada) {
        setEstadoPantalla("listo");
      }

      toast.success("Ubicación actualizada");
    } catch (error: any) {
      console.error(error);

      if (!asistenciaYaRegistrada) {
        setEstadoPantalla("error-ubicacion");
      }

      if (error?.code === 1) {
        toast.error(
          "El permiso de ubicación está bloqueado. Habilitalo desde la configuración del sitio."
        );
      } else if (error?.code === 2) {
        toast.error(
          "No fue posible determinar tu ubicación actual."
        );
      } else if (error?.code === 3) {
        toast.error(
          "La ubicación demoró demasiado. Intentá nuevamente."
        );
      } else {
        toast.error(
          "No fue posible obtener tu ubicación."
        );
      }
    } finally {
      setObteniendoUbicacion(false);
    }
  };

  const confirmarAsistencia = async () => {
    if (asistenciaYaRegistrada) {
      toast("La asistencia ya fue registrada.");
      return;
    }

    if (!claseActual) {
      toast.error(
        "No hay una clase disponible para registrar"
      );
      return;
    }

    if (!ubicacion) {
      toast.error(
        "Primero debemos obtener tu ubicación"
      );
      return;
    }

    if (!dentroDelRadio) {
      toast.error(
        "Todavía estás fuera del área permitida"
      );
      return;
    }

    if (!horarioDisponible) {
      toast.error(
        "La clase está fuera del horario permitido"
      );
      return;
    }

    try {
      setEstadoPantalla("registrando");

      const resultado =
        await registrarAsistenciaGeolocalizacion(
          claseActual.id,
          ubicacion.latitud,
          ubicacion.longitud
        );

      const ahora = new Date();

      const horaActual = ahora.toLocaleTimeString(
        "es-UY",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );

      setHoraRegistro(horaActual);

      setMensajeResultado(
        resultado?.mensaje ??
          "Asistencia registrada correctamente"
      );

      setHistorial((actual) => ({
        ...(actual ?? {}),
        asistencias: [
          {
            id: Date.now(),
            claseId: claseActual.id,
            fecha: ahora.toISOString(),
            presente: true,
            estado: "Registrada",
          },
          ...((actual?.asistencias ?? []) as AsistenciaHistorial[]),
        ],
      }));

      setEstadoPantalla("registrada");

      toast.success(
        resultado?.mensaje ??
          "Asistencia registrada correctamente"
      );
    } catch (error: any) {
      console.error(error);
      console.log(
        "ERROR BACKEND:",
        error?.response?.data
      );

      const mensaje =
        error?.response?.data?.mensaje ??
        "No fue posible registrar la asistencia";

      setMensajeResultado(mensaje);
      setEstadoPantalla("listo");

      toast.error(mensaje);
    }
  };

  const textoEstado = obtenerTextoEstado({
    estadoPantalla,
    claseActual,
    dentroDelRadio,
    horarioDisponible,
    asistenciaYaRegistrada,
  });

  if (loading) {
    return <FullScreenLoading />;
  }

  return (
    <AlumnoLayout>
      <main className="max-w-7xl mx-auto">
        <header className="mb-8">
          <p className="text-[#4adea8] text-sm font-bold uppercase tracking-wide">
            Control de asistencias
          </p>

          <h1 className="text-3xl lg:text-4xl font-bold mt-2">
            Asistencias
          </h1>

          <p className="text-gray-400 mt-2">
            Registrá tu asistencia y consultá tu historial.
          </p>
        </header>

        <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-3 mb-8">
          <div className="grid sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTabActiva("registrar")}
              className={`
                flex
                items-center
                justify-center
                gap-3
                px-5
                py-4
                rounded-2xl
                font-bold
                transition-all
                ${
                  tabActiva === "registrar"
                    ? "bg-[#4adea8] text-[#12201b]"
                    : "bg-[#12201b] border border-[#2d463b] text-gray-300 hover:border-[#4adea8]"
                }
              `}
            >
              <HowToRegOutlinedIcon />
              Registrar asistencia
            </button>

            <button
              type="button"
              onClick={() => setTabActiva("historial")}
              className={`
                flex
                items-center
                justify-center
                gap-3
                px-5
                py-4
                rounded-2xl
                font-bold
                transition-all
                ${
                  tabActiva === "historial"
                    ? "bg-[#4adea8] text-[#12201b]"
                    : "bg-[#12201b] border border-[#2d463b] text-gray-300 hover:border-[#4adea8]"
                }
              `}
            >
              <HistoryOutlinedIcon />
              Mi historial
            </button>
          </div>
        </div>

        {tabActiva === "registrar" && (
          <>
            <section
              className={`
                rounded-3xl
                border
                p-6
                md:p-8
                mb-8
                ${
                  asistenciaYaRegistrada
                    ? "bg-[#4adea8]/10 border-[#4adea8]/40"
                    : estadoPantalla === "error-ubicacion"
                    ? "bg-red-500/5 border-red-500/30"
                    : "bg-[#1a2b24] border-[#2d463b]"
                }
              `}
            >
              {asistenciaYaRegistrada ? (
                <div className="flex flex-col md:flex-row md:items-center gap-5">
                  <div className="w-16 h-16 shrink-0 rounded-2xl bg-[#4adea8] text-[#12201b] flex items-center justify-center">
                    <CheckCircleOutlineOutlinedIcon
                      sx={{ fontSize: 38 }}
                    />
                  </div>

                  <div>
                    <p className="text-[#4adea8] text-sm font-bold uppercase">
                      Registro confirmado
                    </p>

                    <h2 className="text-2xl md:text-3xl font-bold mt-2">
                      Asistencia ya registrada
                    </h2>

                    <p className="text-gray-300 mt-2">
                      {mensajeResultado ||
                        "Ya confirmaste tu asistencia para esta clase."}
                    </p>

                    {claseActual && (
                      <p className="text-gray-400 mt-2">
                        {claseActual.grupoNombre ??
                          "Clase programada"}
                        {" · "}
                        {formatearHora(
                          claseActual.horaInicio
                        )}
                        {" a "}
                        {formatearHora(
                          claseActual.horaFin
                        )}

                        {horaRegistro
                          ? ` · Registrada a las ${horaRegistro}`
                          : ""}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
                  <div>
                    <p className="text-gray-400 text-sm">
                      Estado de asistencia
                    </p>

                    <h2 className="text-2xl md:text-3xl font-bold mt-2">
                      {textoEstado.titulo}
                    </h2>

                    <p className="text-gray-400 mt-2">
                      {textoEstado.descripcion}
                    </p>
                  </div>

                  <EstadoBadge
                    dentroDelRadio={dentroDelRadio}
                    horarioDisponible={horarioDisponible}
                    ubicacionDisponible={Boolean(ubicacion)}
                  />
                </div>
              )}
            </section>

            {estadoPantalla === "sin-clases" && (
              <EstadoVacio
                titulo="No tenés clases registradas"
                descripcion="Cuando te inscribas a una clase, podrás registrar tu asistencia desde esta pantalla."
              />
            )}

            {estadoPantalla === "sin-clase-hoy" && (
              <EstadoVacio
                titulo="No tenés clases programadas para hoy"
                descripcion={`Hoy es ${obtenerDiaActual()}. Revisá tus próximos horarios en la lista inferior.`}
              />
            )}

            {estadoPantalla !== "sin-clases" &&
              estadoPantalla !== "sin-clase-hoy" && (
                <>
                  <div className="grid gap-6 lg:grid-cols-2 mb-8">
                    <section className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6">
                      <div className="flex items-center justify-between gap-4 mb-5">
                        <h2 className="flex items-center gap-3 text-xl font-bold">
                          <LocationOnOutlinedIcon className="text-[#4adea8]" />
                          Mi ubicación
                        </h2>

                        <button
                          type="button"
                          onClick={solicitarUbicacion}
                          disabled={obteniendoUbicacion}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#12201b] border border-[#2d463b] text-sm font-semibold hover:border-[#4adea8] disabled:opacity-50 transition-all"
                        >
                          <RefreshOutlinedIcon fontSize="small" />

                          {obteniendoUbicacion
                            ? "Actualizando..."
                            : "Actualizar ubicación"}
                        </button>
                      </div>

                      {ubicacion ? (
                        <>
                          <div className="overflow-hidden rounded-2xl border border-[#2d463b]">
                            <LocationMap
                              latitud={ubicacion.latitud}
                              longitud={ubicacion.longitud}
                            />
                          </div>

                          <div className="mt-4 rounded-2xl bg-[#12201b] border border-[#2d463b] p-4">
                            <div className="flex items-center gap-3">
                              <MyLocationOutlinedIcon className="text-[#4adea8]" />

                              <div>
                                <p className="font-semibold">
                                  Ubicación obtenida
                                </p>

                                <p className="text-sm text-gray-400 mt-1">
                                  Se usa únicamente para validar tu asistencia.
                                </p>

                                {ultimaActualizacion && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Última actualización:{" "}
                                    {ultimaActualizacion}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="min-h-64 rounded-2xl bg-[#12201b] border border-dashed border-[#2d463b] flex flex-col items-center justify-center text-center p-6">
                          <LocationOnOutlinedIcon
                            sx={{
                              fontSize: 42,
                              color: "#4adea8",
                            }}
                          />

                          <h3 className="text-lg font-bold mt-4">
                            Ubicación no disponible
                          </h3>

                          <p className="text-sm text-gray-400 mt-2 max-w-sm">
                            Permití el acceso a la ubicación para comprobar
                            si estás dentro del área de la clase.
                          </p>

                          <button
                            type="button"
                            onClick={solicitarUbicacion}
                            disabled={obteniendoUbicacion}
                            className="mt-5 px-5 py-3 rounded-xl bg-[#4adea8] text-[#12201b] font-bold disabled:opacity-50"
                          >
                            {obteniendoUbicacion
                              ? "Obteniendo ubicación..."
                              : "Permitir ubicación"}
                          </button>
                        </div>
                      )}
                    </section>

                    <section className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6">
                      <h2 className="flex items-center gap-3 text-xl font-bold mb-5">
                        <ScheduleOutlinedIcon className="text-[#4adea8]" />
                        Clase de hoy
                      </h2>

                      {claseActual ? (
                        <>
                          <p className="text-[#4adea8] text-sm font-bold uppercase tracking-wide">
                            {claseActual.grupoNombre ??
                              "Clase programada"}
                          </p>

                          <h3 className="text-3xl font-bold mt-3">
                            {claseActual.diaSemana}
                          </h3>

                          <p className="text-lg text-gray-300 mt-2">
                            {formatearHora(
                              claseActual.horaInicio
                            )}{" "}
                            -{" "}
                            {formatearHora(
                              claseActual.horaFin
                            )}
                          </p>

                          {claseActual.entrenadorNombre && (
                            <p className="text-gray-400 mt-3">
                              Entrenador:{" "}
                              <span className="text-white font-semibold">
                                {claseActual.entrenadorNombre}
                              </span>
                            </p>
                          )}

                          {esUbicacionLegible(
                            claseActual.ubicacionNombre
                          ) && (
                            <p className="text-gray-400 mt-2">
                              Ubicación:{" "}
                              <span className="text-white font-semibold">
                                {claseActual.ubicacionNombre}
                              </span>
                            </p>
                          )}

                          <div className="grid sm:grid-cols-2 gap-3 mt-5">
                            <InfoEstado
                              titulo="Distancia actual"
                              valor={
                                distancia !== null
                                  ? `${Math.round(
                                      distancia
                                    )} metros`
                                  : "Sin calcular"
                              }
                              correcto={dentroDelRadio}
                            />

                            <InfoEstado
                              titulo="Horario"
                              valor={
                                horarioDisponible
                                  ? "Disponible ahora"
                                  : "Fuera del horario"
                              }
                              correcto={horarioDisponible}
                            />
                          </div>

                          <div className="mt-5 overflow-hidden rounded-2xl border border-[#2d463b]">
                            <ClassLocationMap
                              latitud={claseActual.latitud}
                              longitud={claseActual.longitud}
                              radio={
                                claseActual.radioGeolocalizacion
                              }
                            />
                          </div>
                        </>
                      ) : (
                        <p className="text-gray-400">
                          No hay una clase disponible para hoy.
                        </p>
                      )}
                    </section>
                  </div>

                  <section className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      <div>
                        <p className="text-[#4adea8] text-sm font-bold uppercase tracking-wide">
                          Confirmación
                        </p>

                        <h2 className="text-2xl font-bold mt-2">
                          {asistenciaYaRegistrada
                            ? "Asistencia confirmada"
                            : "Confirmar asistencia"}
                        </h2>

                        <p className="text-gray-400 mt-2">
                          {asistenciaYaRegistrada
                            ? "Ya registraste tu asistencia para esta clase."
                            : "El registro se enviará únicamente cuando presiones el botón."}
                        </p>

                        {!asistenciaYaRegistrada &&
                          !ubicacion && (
                            <p className="text-red-400 text-sm mt-3">
                              Debés habilitar la ubicación antes de confirmar.
                            </p>
                          )}

                        {!asistenciaYaRegistrada &&
                          ubicacion &&
                          !dentroDelRadio && (
                            <p className="text-amber-300 text-sm mt-3">
                              Estás fuera del radio permitido para esta clase.
                            </p>
                          )}

                        {!asistenciaYaRegistrada &&
                          ubicacion &&
                          dentroDelRadio &&
                          !horarioDisponible && (
                            <p className="text-amber-300 text-sm mt-3">
                              Podés registrar desde 5 minutos antes del inicio
                              y hasta la hora de finalización.
                            </p>
                          )}

                        {puedeConfirmar && (
                          <p className="text-[#4adea8] text-sm mt-3">
                            Todo está listo para registrar tu asistencia.
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={confirmarAsistencia}
                        disabled={!puedeConfirmar}
                        className={`
                          w-full
                          lg:w-auto
                          min-w-64
                          h-14
                          rounded-2xl
                          font-bold
                          flex
                          items-center
                          justify-center
                          gap-3
                          transition-all
                          ${
                            puedeConfirmar
                              ? "bg-[#4adea8] text-[#12201b] hover:brightness-110 active:scale-95"
                              : asistenciaYaRegistrada
                              ? "bg-[#4adea8]/10 border border-[#4adea8]/30 text-[#4adea8] cursor-not-allowed"
                              : "bg-[#12201b] border border-[#2d463b] text-gray-500 cursor-not-allowed"
                          }
                        `}
                      >
                        {estadoPantalla === "registrando" ? (
                          <>
                            <span className="w-5 h-5 rounded-full border-2 border-[#12201b]/30 border-t-[#12201b] animate-spin" />
                            Registrando...
                          </>
                        ) : asistenciaYaRegistrada ? (
                          <>
                            <CheckCircleOutlineOutlinedIcon />
                            Asistencia confirmada
                          </>
                        ) : (
                          <>
                            <CheckCircleOutlineOutlinedIcon />
                            Confirmar asistencia
                          </>
                        )}
                      </button>
                    </div>
                  </section>
                </>
              )}

            <MisClases clases={misClases} />
          </>
        )}

        {tabActiva === "historial" && (
          <HistorialAsistencias
            asistencias={asistenciasHistorial}
            clases={misClases}
          />
        )}
      </main>
    </AlumnoLayout>
  );
}

function HistorialAsistencias({
  asistencias,
  clases,
}: {
  asistencias: AsistenciaHistorial[];
  clases: Clase[];
}) {
  const asistenciasOrdenadas = [...asistencias].sort(
    (a, b) =>
      new Date(b.fecha).getTime() -
      new Date(a.fecha).getTime()
  );

  const totalPresentes = asistencias.filter(
    (asistencia) => asistencia.presente
  ).length;

  const asistenciasEsteMes = asistencias.filter(
    (asistencia) => {
      const fecha = new Date(asistencia.fecha);
      const ahora = new Date();

      return (
        fecha.getMonth() === ahora.getMonth() &&
        fecha.getFullYear() === ahora.getFullYear() &&
        asistencia.presente
      );
    }
  ).length;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <ResumenHistorial
          titulo="Total de asistencias"
          valor={totalPresentes}
          descripcion="Registros acumulados"
        />

        <ResumenHistorial
          titulo="Este mes"
          valor={asistenciasEsteMes}
          descripcion="Asistencias registradas"
        />
      </div>

      <section className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6">
        <div className="mb-6">
          <p className="text-[#4adea8] text-sm font-bold uppercase tracking-wide">
            Actividad
          </p>

          <h2 className="text-2xl font-bold mt-2">
            Historial de asistencias
          </h2>

          <p className="text-gray-400 mt-2">
            Consultá tus registros anteriores.
          </p>
        </div>

        {!asistenciasOrdenadas.length ? (
          <div className="rounded-2xl bg-[#12201b] border border-[#2d463b] p-10 text-center">
            <HistoryOutlinedIcon
              sx={{
                color: "#4adea8",
                fontSize: 42,
              }}
            />

            <h3 className="text-xl font-bold mt-4">
              Todavía no hay asistencias
            </h3>

            <p className="text-gray-400 mt-2">
              Tus próximos registros aparecerán en esta sección.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {asistenciasOrdenadas.map((asistencia) => {
              const clase = clases.find(
                (item) => item.id === asistencia.claseId
              );

              return (
                <article
                  key={asistencia.id}
                  className="rounded-2xl bg-[#12201b] border border-[#2d463b] p-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`
                          w-12
                          h-12
                          shrink-0
                          rounded-2xl
                          flex
                          items-center
                          justify-center
                          ${
                            asistencia.presente
                              ? "bg-[#4adea8]/10 text-[#4adea8]"
                              : "bg-red-500/10 text-red-400"
                          }
                        `}
                      >
                        {asistencia.presente ? (
                          <EventAvailableOutlinedIcon />
                        ) : (
                          <ErrorOutlineOutlinedIcon />
                        )}
                      </div>

                      <div>
                        <p className="text-sm text-gray-400 capitalize">
                          {formatearFechaCompleta(
                            asistencia.fecha
                          )}
                        </p>

                        <h3 className="text-xl font-bold mt-1">
                          {clase?.grupoNombre ??
                            "Clase anterior"}
                        </h3>

                        {clase && (
                          <p className="text-gray-400 mt-2">
                            {clase.diaSemana} ·{" "}
                            {formatearHora(
                              clase.horaInicio
                            )}{" "}
                            -{" "}
                            {formatearHora(
                              clase.horaFin
                            )}
                          </p>
                        )}
                      </div>
                    </div>

                    <span
                      className={`
                        self-start
                        sm:self-auto
                        inline-flex
                        items-center
                        gap-2
                        px-4
                        py-2
                        rounded-full
                        border
                        text-sm
                        font-bold
                        ${
                          asistencia.presente
                            ? "bg-[#4adea8]/10 border-[#4adea8]/30 text-[#4adea8]"
                            : "bg-red-500/10 border-red-500/30 text-red-400"
                        }
                      `}
                    >
                      {asistencia.presente
                        ? "Asistencia registrada"
                        : "Ausente"}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#2d463b]">
                    <p className="text-sm text-gray-400">
                      Estado:{" "}
                      <span className="text-white font-semibold">
                        {asistencia.estado}
                      </span>
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function ResumenHistorial({
  titulo,
  valor,
  descripcion,
}: {
  titulo: string;
  valor: number;
  descripcion: string;
}) {
  return (
    <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6">
      <p className="text-sm text-gray-400">
        {titulo}
      </p>

      <p className="text-4xl font-bold text-[#4adea8] mt-3">
        {valor}
      </p>

      <p className="text-xs text-gray-500 mt-2">
        {descripcion}
      </p>
    </div>
  );
}

function MisClases({
  clases,
}: {
  clases: Clase[];
}) {
  return (
    <section className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          Mis clases
        </h2>

        <p className="text-gray-400 mt-1">
          Horarios en los que estás inscripto.
        </p>
      </div>

      {!clases.length ? (
        <p className="text-gray-400">
          No tenés clases registradas.
        </p>
      ) : (
        <div className="space-y-3">
          {clases.map((clase) => (
            <div
              key={clase.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-[#2d463b] rounded-2xl p-4"
            >
              <div>
                <p className="font-bold text-lg">
                  {clase.grupoNombre ??
                    clase.diaSemana}
                </p>

                <p className="text-gray-400 mt-1">
                  {clase.diaSemana} ·{" "}
                  {formatearHora(
                    clase.horaInicio
                  )}{" "}
                  -{" "}
                  {formatearHora(
                    clase.horaFin
                  )}
                </p>
              </div>

              <span className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-full bg-[#4adea8]/10 border border-[#4adea8]/20 text-[#4adea8] text-sm font-semibold">
                <CheckCircleOutlineOutlinedIcon fontSize="small" />
                Activa
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function EstadoBadge({
  dentroDelRadio,
  horarioDisponible,
  ubicacionDisponible,
}: {
  dentroDelRadio: boolean;
  horarioDisponible: boolean;
  ubicacionDisponible: boolean;
}) {
  if (!ubicacionDisponible) {
    return (
      <span className="self-start px-4 py-2 rounded-full bg-gray-500/10 border border-gray-500/30 text-gray-300 text-sm font-bold">
        Ubicación pendiente
      </span>
    );
  }

  if (!dentroDelRadio) {
    return (
      <span className="self-start px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm font-bold">
        Fuera del área
      </span>
    );
  }

  if (!horarioDisponible) {
    return (
      <span className="self-start px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-sm font-bold">
        Esperando horario
      </span>
    );
  }

  return (
    <span className="self-start px-4 py-2 rounded-full bg-[#4adea8]/10 border border-[#4adea8]/30 text-[#4adea8] text-sm font-bold">
      Disponible
    </span>
  );
}

function InfoEstado({
  titulo,
  valor,
  correcto,
}: {
  titulo: string;
  valor: string;
  correcto: boolean;
}) {
  return (
    <div className="rounded-2xl bg-[#12201b] border border-[#2d463b] p-4">
      <p className="text-xs text-gray-500">
        {titulo}
      </p>

      <p
        className={`font-bold mt-2 ${
          correcto
            ? "text-[#4adea8]"
            : "text-amber-300"
        }`}
      >
        {valor}
      </p>
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
    <section className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-10 text-center mb-8">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-[#12201b] border border-[#2d463b] flex items-center justify-center">
        <ErrorOutlineOutlinedIcon
          sx={{
            color: "#4adea8",
            fontSize: 34,
          }}
        />
      </div>

      <h2 className="text-2xl font-bold mt-5">
        {titulo}
      </h2>

      <p className="text-gray-400 mt-2 max-w-xl mx-auto">
        {descripcion}
      </p>
    </section>
  );
}

function obtenerTextoEstado({
  estadoPantalla,
  claseActual,
  dentroDelRadio,
  horarioDisponible,
  asistenciaYaRegistrada,
}: {
  estadoPantalla: EstadoPantalla;
  claseActual?: Clase;
  dentroDelRadio: boolean;
  horarioDisponible: boolean;
  asistenciaYaRegistrada: boolean;
}) {
  if (asistenciaYaRegistrada) {
    return {
      titulo: "Asistencia confirmada",
      descripcion:
        "Ya registraste tu asistencia para esta clase.",
    };
  }

  if (estadoPantalla === "error-ubicacion") {
    return {
      titulo: "Necesitamos tu ubicación",
      descripcion:
        "Habilitá el permiso de ubicación para continuar.",
    };
  }

  if (estadoPantalla === "ubicacion-pendiente") {
    return {
      titulo: "Obteniendo ubicación...",
      descripcion:
        "Estamos comprobando tu posición actual.",
    };
  }

  if (!claseActual) {
    return {
      titulo: "Sin clase disponible",
      descripcion:
        "No encontramos una clase para registrar en este momento.",
    };
  }

  if (!dentroDelRadio) {
    return {
      titulo: "Acercate a la ubicación",
      descripcion:
        "Todavía estás fuera del radio permitido.",
    };
  }

  if (!horarioDisponible) {
    return {
      titulo: "Fuera del horario permitido",
      descripcion:
        "Podrás registrar desde 5 minutos antes del inicio y hasta el final de la clase.",
    };
  }

  return {
    titulo: "Listo para confirmar",
    descripcion:
      "Estás dentro del área y en el horario permitido.",
  };
}

function obtenerPosicionActual(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      resolve,
      reject,
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  });
}

function formatearHora(hora?: string) {
  if (!hora) {
    return "--:--";
  }

  return hora.substring(0, 5);
}

function horaAMinutos(hora?: string) {
  if (!hora) {
    return 0;
  }

  const [horas, minutos] = hora
    .substring(0, 5)
    .split(":")
    .map(Number);

  return horas * 60 + minutos;
}

function normalizarTexto(texto?: string) {
  return (texto ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function esUbicacionLegible(ubicacion?: string) {
  if (!ubicacion?.trim()) {
    return false;
  }

  return !/^\d+$/.test(
    ubicacion.trim()
  );
}

function obtenerFechaLocalISO() {
  const ahora = new Date();

  const anio = ahora.getFullYear();
  const mes = String(
    ahora.getMonth() + 1
  ).padStart(2, "0");

  const dia = String(
    ahora.getDate()
  ).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
}

function obtenerFechaISO(fecha: string) {
  return fecha.substring(0, 10);
}

function formatearFechaCompleta(fecha: string) {
  const fechaSinHora =
    obtenerFechaISO(fecha);

  const [anio, mes, dia] =
    fechaSinHora.split("-").map(Number);

  return new Date(
    anio,
    mes - 1,
    dia
  ).toLocaleDateString("es-UY", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatearHoraDesdeFecha(fecha: string) {
  const hora = fecha.split("T")[1];

  if (!hora) {
    return "";
  }

  return hora.substring(0, 5);
}