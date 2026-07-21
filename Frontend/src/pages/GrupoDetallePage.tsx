import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import AlumnoLayout from "../components/layout/DashboardLayout";
import LoadingSpinner from "../components/FullScreenSpinner";
import BlockedAccountAlert from "../components/BlockedAccountAlert";

import { obtenerGrupos } from "../services/Grupo.Service";
import { inscribirseClase } from "../services/Clase.Service";
import {
  desinscribirseClase,
  obtenerMisClases,
} from "../services/Inscripciones.Service";
import { obtenerMiPerfil } from "../services/Perfil.service";

import {
  cuentaBloqueada,
  obtenerMotivoBloqueo,
} from "../utils/accountUtils";
import { validarCuentaActiva } from "../utils/bloqueoUtils";

import type { Clase, Grupo, Perfil } from "../types";

const CANTIDAD_INICIAL_CLASES = 4;

const ORDEN_DIAS = [
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
  "domingo",
];

export default function GrupoDetallePage() {
  const navigate = useNavigate();
  const { grupoId } = useParams();

  const idGrupo = Number(grupoId);

  const [grupo, setGrupo] = useState<Grupo | null>(null);
  const [perfil, setPerfil] = useState<Perfil | null>(null);

  const [clasesInscritas, setClasesInscritas] = useState<number[]>([]);
  const [clasesEnEspera, setClasesEnEspera] = useState<number[]>([]);

  const [loading, setLoading] = useState(true);
  const [mostrarTodas, setMostrarTodas] = useState(false);

  const [procesandoClaseId, setProcesandoClaseId] =
    useState<number | null>(null);

  const [claseParaDesinscribir, setClaseParaDesinscribir] =
    useState<Clase | null>(null);

  const cargarGrupo = async () => {
    const grupos: Grupo[] = await obtenerGrupos();

    const grupoEncontrado = grupos.find(
      (item) => item.id === idGrupo,
    );

    setGrupo(grupoEncontrado ?? null);
  };

  const cargarPantalla = async () => {
    if (!Number.isFinite(idGrupo) || idGrupo <= 0) {
      toast.error("El grupo seleccionado no es válido");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const [gruposData, clasesData, perfilData] =
        await Promise.all([
          obtenerGrupos(),
          obtenerMisClases(),
          obtenerMiPerfil(),
        ]);

      const grupos = (gruposData ?? []) as Grupo[];

      const grupoEncontrado = grupos.find(
        (item) => item.id === idGrupo,
      );

      setGrupo(grupoEncontrado ?? null);
      setPerfil(perfilData);

      const idsClases = (clasesData ?? []).map(
        (clase: Clase) => clase.id,
      );

      setClasesInscritas(idsClases);
    } catch (error) {
      console.error(error);
      toast.error("No fue posible cargar el grupo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void cargarPantalla();
  }, [idGrupo]);

  const clasesOrdenadas = useMemo(() => {
    return [...(grupo?.clases ?? [])].sort((a, b) => {
      const indiceDiaA = obtenerIndiceDia(a.diaSemana);
      const indiceDiaB = obtenerIndiceDia(b.diaSemana);

      if (indiceDiaA !== indiceDiaB) {
        return indiceDiaA - indiceDiaB;
      }

      return a.horaInicio.localeCompare(b.horaInicio);
    });
  }, [grupo?.clases]);

  const clasesVisibles = useMemo(() => {
    if (mostrarTodas) {
      return clasesOrdenadas;
    }

    return clasesOrdenadas.slice(0, CANTIDAD_INICIAL_CLASES);
  }, [clasesOrdenadas, mostrarTodas]);

  const cantidadOcultas = Math.max(
    clasesOrdenadas.length - CANTIDAD_INICIAL_CLASES,
    0,
  );

  const bloqueado = cuentaBloqueada(perfil);

  const handleInscribirse = async (claseId: number) => {
    if (!validarCuentaActiva(perfil)) {
      return;
    }

    try {
      setProcesandoClaseId(claseId);

      const response = await inscribirseClase(claseId);

      if (response.estado === "INSCRIPTO") {
        setClasesInscritas((actuales) =>
          actuales.includes(claseId)
            ? actuales
            : [...actuales, claseId],
        );

        setClasesEnEspera((actuales) =>
          actuales.filter((id) => id !== claseId),
        );

        toast.success("Inscripción realizada correctamente");
      } else if (response.estado === "LISTA_ESPERA") {
        setClasesEnEspera((actuales) =>
          actuales.includes(claseId)
            ? actuales
            : [...actuales, claseId],
        );

        toast.success(
          "La clase está completa. Fuiste agregado a la lista de espera.",
        );
      } else {
        toast.success(
          response.mensaje ??
            "La solicitud fue procesada correctamente",
        );
      }

      await cargarGrupo();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.mensaje ??
          "No fue posible realizar la inscripción",
      );
    } finally {
      setProcesandoClaseId(null);
    }
  };

  const confirmarDesinscripcion = async () => {
    if (!claseParaDesinscribir) {
      return;
    }

    try {
      setProcesandoClaseId(claseParaDesinscribir.id);

      await desinscribirseClase(claseParaDesinscribir.id);

      setClasesInscritas((actuales) =>
        actuales.filter(
          (id) => id !== claseParaDesinscribir.id,
        ),
      );

      setClaseParaDesinscribir(null);

      await cargarGrupo();

      toast.success("Te desinscribiste correctamente");
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.mensaje ??
          "No fue posible desinscribirse",
      );
    } finally {
      setProcesandoClaseId(null);
    }
  };

  const abrirGoogleMaps = (clase: Clase) => {
    const latitud = Number(clase.latitud);
    const longitud = Number(clase.longitud);

    if (
      !Number.isFinite(latitud) ||
      !Number.isFinite(longitud)
    ) {
      toast.error(
        "Esta clase no tiene una ubicación disponible",
      );
      return;
    }

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${latitud},${longitud}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!grupo) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#12201b] px-4 text-center text-white">
        <FitnessCenterRoundedIcon
          sx={{
            color: "#4adea8",
            fontSize: 52,
          }}
        />

        <div>
          <h1 className="text-2xl font-bold">
            Grupo no encontrado
          </h1>

          <p className="mt-2 text-gray-400">
            El grupo puede haber sido eliminado o no estar
            disponible.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/alumno/explorar")}
          className="rounded-xl bg-[#4adea8] px-5 py-3 font-bold text-[#12201b]"
        >
          Volver a explorar
        </button>
      </div>
    );
  }

  return (
    <AlumnoLayout nombre={perfil?.nombre}>
      <main className="mx-auto w-full max-w-6xl">
        {/* VOLVER */}

        <button
          type="button"
          onClick={() => navigate("/alumno/explorar")}
          className="
            mb-5
            inline-flex
            items-center
            gap-2
            rounded-xl
            border
            border-[#2d463b]
            bg-[#1a2b24]
            px-4
            py-2.5
            text-sm
            font-semibold
            text-gray-300
            transition-all
            hover:border-[#4adea8]
            hover:text-[#4adea8]
          "
        >
          <ArrowBackRoundedIcon fontSize="small" />
          Volver a explorar
        </button>

        {/* ENCABEZADO */}

        <section className="mb-6 rounded-3xl border border-[#4adea8]/20 bg-gradient-to-r from-[#1a2b24] to-[#163129] p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#4adea8]/30 bg-[#4adea8]/10">
              <FitnessCenterRoundedIcon
                sx={{
                  color: "#4adea8",
                  fontSize: 30,
                }}
              />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-[#4adea8]">
                Grupo de entrenamiento
              </p>

              <h1 className="mt-2 break-words text-3xl font-bold md:text-4xl">
                {grupo.nombre}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[#4adea8]/30 bg-[#4adea8]/10 px-3 py-1 text-xs font-bold text-[#4adea8]">
                  Nivel {grupo.nivel}
                </span>

                <span className="rounded-full border border-[#2d463b] bg-[#12201b] px-3 py-1 text-xs font-semibold text-gray-300">
                  {clasesOrdenadas.length}{" "}
                  {clasesOrdenadas.length === 1
                    ? "clase"
                    : "clases"}
                </span>
              </div>
            </div>
          </div>
        </section>

        <BlockedAccountAlert
          motivo={obtenerMotivoBloqueo(perfil)}
        />

        {/* ENCABEZADO CLASES */}

        <section className="mb-5 mt-7">
          <p className="text-xs font-bold uppercase tracking-wide text-[#4adea8]">
            Horarios disponibles
          </p>

          <h2 className="mt-2 text-2xl font-bold md:text-3xl">
            Clases del grupo
          </h2>

          <p className="mt-2 text-gray-400">
            Elegí el horario que mejor se adapte a tu semana.
          </p>
        </section>

        {/* CLASES */}

        {clasesOrdenadas.length === 0 ? (
          <section className="rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-10 text-center">
            <CalendarTodayOutlinedIcon
              sx={{
                color: "#4adea8",
                fontSize: 44,
              }}
            />

            <h3 className="mt-4 text-xl font-bold">
              No hay clases configuradas
            </h3>

            <p className="mt-2 text-gray-400">
              Este grupo todavía no tiene horarios disponibles.
            </p>
          </section>
        ) : (
          <>
            <div className="grid gap-4 lg:grid-cols-2">
              {clasesVisibles.map((clase) => {
                const estaInscripto =
                  clasesInscritas.includes(clase.id);

                const estaEnListaEspera =
                  clasesEnEspera.includes(clase.id);

                const procesando =
                  procesandoClaseId === clase.id;

                const cantidadInscriptos =
                  clase.cantidadInscriptos ?? 0;

                const cupoMaximo =
                  clase.cupoMaximo ?? 0;

                const porcentajeOcupacion =
                  cupoMaximo > 0
                    ? Math.min(
                        (cantidadInscriptos * 100) /
                          cupoMaximo,
                        100,
                      )
                    : 0;

                const claseCompleta =
                  cupoMaximo > 0 &&
                  cantidadInscriptos >= cupoMaximo;

                return (
                  <article
                    key={clase.id}
                    className="
                      rounded-3xl
                      border
                      border-[#2d463b]
                      bg-[#1a2b24]
                      p-5
                      transition-all
                      hover:border-[#4adea8]/40
                    "
                  >
                    {/* TÍTULO */}

                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <CalendarTodayOutlinedIcon
                            sx={{
                              color: "#4adea8",
                              fontSize: 19,
                            }}
                          />

                          <h3 className="text-xl font-bold">
                            {clase.diaSemana}
                          </h3>

                          {clase.esFija && (
                            <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold text-blue-300">
                              Semanal
                            </span>
                          )}
                        </div>

                        <p className="mt-2 inline-flex items-center gap-2 text-sm text-gray-300">
                          <AccessTimeRoundedIcon
                            sx={{
                              color: "#4adea8",
                              fontSize: 17,
                            }}
                          />

                          {formatearHora(clase.horaInicio)} -{" "}
                          {formatearHora(clase.horaFin)}
                        </p>
                      </div>

                      {estaInscripto && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#4adea8]/30 bg-[#4adea8]/10 px-3 py-1.5 text-xs font-bold text-[#4adea8]">
                          <CheckCircleOutlineRoundedIcon
                            sx={{ fontSize: 16 }}
                          />
                          Inscripto
                        </span>
                      )}

                      {estaEnListaEspera && !estaInscripto && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-300">
                          <HourglassTopRoundedIcon
                            sx={{ fontSize: 16 }}
                          />
                          En espera
                        </span>
                      )}
                    </div>

                    {/* DATOS */}

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <DatoClase
                        icono={<PeopleOutlineRoundedIcon />}
                        titulo="Cupos"
                        valor={`${cantidadInscriptos}/${cupoMaximo}`}
                      />

                      <DatoClase
                        icono={<PersonOutlineRoundedIcon />}
                        titulo="Tipo"
                        valor={
                          clase.esFija
                            ? "Clase semanal"
                            : "Clase por período"
                        }
                      />
                    </div>

                    {/* OCUPACIÓN */}

                    <div className="mt-4">
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="text-gray-400">
                          Ocupación
                        </span>

                        <span
                          className={
                            claseCompleta
                              ? "font-bold text-red-400"
                              : "font-bold text-[#4adea8]"
                          }
                        >
                          {Math.round(porcentajeOcupacion)}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-[#12201b]">
                        <div
                          className={`h-full rounded-full transition-all ${
                            claseCompleta
                              ? "bg-red-400"
                              : "bg-[#4adea8]"
                          }`}
                          style={{
                            width: `${porcentajeOcupacion}%`,
                          }}
                        />
                      </div>

                     {claseCompleta && !estaInscripto && !estaEnListaEspera && (
  <p className="mt-2 text-xs font-semibold text-amber-300">
    Clase completa. Podés ingresar a la lista de espera.
  </p>
)}

{claseCompleta && estaInscripto && (
  <p className="mt-2 text-xs font-semibold text-[#4adea8]">
    Tenés tu lugar confirmado en esta clase.
  </p>
)}

{claseCompleta && estaEnListaEspera && !estaInscripto && (
  <p className="mt-2 text-xs font-semibold text-amber-300">
    Ya estás en la lista de espera.
  </p>
)}
                    </div>

                    {/* ACCIONES */}

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        disabled={
                          !tieneUbicacionValida(clase)
                        }
                        onClick={() => abrirGoogleMaps(clase)}
                        className="
                          inline-flex
                          min-h-11
                          items-center
                          justify-center
                          gap-2
                          rounded-xl
                          border
                          border-[#4adea8]/40
                          bg-[#4adea8]/10
                          px-4
                          py-3
                          font-bold
                          text-[#4adea8]
                          transition-all
                          hover:border-[#4adea8]
                          hover:bg-[#4adea8]/20
                          disabled:cursor-not-allowed
                          disabled:border-gray-700
                          disabled:bg-gray-800
                          disabled:text-gray-500
                        "
                      >
                        <LocationOnOutlinedIcon fontSize="small" />
                        Ver ubicación
                      </button>

                      {estaInscripto ? (
                        <button
                          type="button"
                          disabled={procesando}
                          onClick={() =>
                            setClaseParaDesinscribir(clase)
                          }
                          className="
                            inline-flex
                            min-h-11
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-red-500/30
                            bg-red-500/10
                            px-4
                            py-3
                            font-bold
                            text-red-400
                            transition-all
                            hover:bg-red-500/20
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                          "
                        >
                          <LogoutRoundedIcon fontSize="small" />
                          Desinscribirme
                        </button>
                      ) : estaEnListaEspera ? (
                        <button
                          type="button"
                          disabled
                          className="
                            inline-flex
                            min-h-11
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-amber-500/30
                            bg-amber-500/10
                            px-4
                            py-3
                            font-bold
                            text-amber-300
                            cursor-not-allowed
                          "
                        >
                          <HourglassTopRoundedIcon fontSize="small" />
                          En lista de espera
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={bloqueado || procesando}
                          onClick={() =>
                            void handleInscribirse(clase.id)
                          }
                          className={`
                            inline-flex
                            min-h-11
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            px-4
                            py-3
                            font-bold
                            transition-all
                            ${
                              bloqueado
                                ? "cursor-not-allowed bg-gray-700 text-gray-400"
                                : "bg-[#4adea8] text-[#12201b] hover:brightness-110"
                            }
                            disabled:opacity-60
                          `}
                        >
                          {procesando
                            ? "Procesando..."
                            : bloqueado
                              ? "Cuenta bloqueada"
                              : claseCompleta
                                ? "Unirme a la espera"
                                : "Inscribirme"}
                        </button>
                      )}
                    </div>

                    {clase.fechaFin && (
                      <p className="mt-4 text-xs text-gray-500">
                        Vigente hasta{" "}
                        {formatearFecha(clase.fechaFin)}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>

            {/* VER MÁS */}

            {clasesOrdenadas.length >
              CANTIDAD_INICIAL_CLASES && (
              <button
                type="button"
                onClick={() =>
                  setMostrarTodas((valor) => !valor)
                }
                className="
                  mx-auto
                  mt-6
                  flex
                  min-h-12
                  w-full
                  max-w-md
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-[#4adea8]/30
                  bg-[#1a2b24]
                  px-5
                  py-3
                  font-bold
                  text-[#4adea8]
                  transition-all
                  hover:border-[#4adea8]
                  hover:bg-[#4adea8]/10
                "
              >
                {mostrarTodas ? (
                  <>
                    <ExpandLessRoundedIcon />
                    Ver menos clases
                  </>
                ) : (
                  <>
                    <ExpandMoreRoundedIcon />
                    Ver {cantidadOcultas}{" "}
                    {cantidadOcultas === 1
                      ? "clase más"
                      : "clases más"}
                  </>
                )}
              </button>
            )}
          </>
        )}
      </main>

      {/* MODAL DESINSCRIPCIÓN */}

      {claseParaDesinscribir && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 px-4">
          <section className="w-full max-w-md rounded-3xl border border-red-500/30 bg-[#1a2b24] p-7 shadow-2xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400">
              <LogoutRoundedIcon fontSize="large" />
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              ¿Querés desinscribirte?
            </h2>

            <p className="mt-3 leading-relaxed text-gray-300">
              Vas a perder tu lugar en la clase del{" "}
              <strong className="text-white">
                {claseParaDesinscribir.diaSemana}
              </strong>
              , de{" "}
              {formatearHora(
                claseParaDesinscribir.horaInicio,
              )}{" "}
              a{" "}
              {formatearHora(
                claseParaDesinscribir.horaFin,
              )}.
            </p>

            <p className="mt-3 text-sm text-gray-500">
              Si la clase se completa, puede que luego debas
              ingresar a la lista de espera.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={procesandoClaseId !== null}
                onClick={() =>
                  setClaseParaDesinscribir(null)
                }
                className="rounded-xl border border-[#2d463b] bg-[#12201b] px-5 py-3 font-semibold hover:border-[#4adea8] disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={procesandoClaseId !== null}
                onClick={() =>
                  void confirmarDesinscripcion()
                }
                className="rounded-xl bg-red-500 px-5 py-3 font-bold text-white transition-all hover:brightness-110 disabled:opacity-50"
              >
                {procesandoClaseId !== null
                  ? "Desinscribiendo..."
                  : "Sí, desinscribirme"}
              </button>
            </div>
          </section>
        </div>
      )}
    </AlumnoLayout>
  );
}

function DatoClase({
  icono,
  titulo,
  valor,
}: {
  icono: React.ReactNode;
  titulo: string;
  valor: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#2d463b] bg-[#12201b] p-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#4adea8]/10 text-[#4adea8]">
        {icono}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
          {titulo}
        </p>

        <p className="mt-1 truncate text-sm font-semibold text-gray-200">
          {valor}
        </p>
      </div>
    </div>
  );
}

function tieneUbicacionValida(clase: Clase) {
  const latitud = Number(clase.latitud);
  const longitud = Number(clase.longitud);

  return (
    Number.isFinite(latitud) &&
    Number.isFinite(longitud)
  );
}

function obtenerIndiceDia(dia?: string) {
  const normalizado = normalizarTexto(dia);
  const indice = ORDEN_DIAS.indexOf(normalizado);

  return indice === -1 ? 99 : indice;
}

function normalizarTexto(texto?: string) {
  return (texto ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function formatearHora(hora?: string) {
  if (!hora) return "--:--";
  return hora.substring(0, 5);
}

function formatearFecha(fecha: string) {
  const fechaNormalizada = fecha.substring(0, 10);
  const [anio, mes, dia] = fechaNormalizada
    .split("-")
    .map(Number);

  return new Date(
    anio,
    mes - 1,
    dia,
  ).toLocaleDateString("es-UY");
}