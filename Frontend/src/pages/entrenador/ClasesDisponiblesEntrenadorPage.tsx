import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import TopBar from "../../components/navigation/DashboardTopBar";
import FullScreenLoading from "../../components/FullScreenSpinner";
import ClaseDisponibleCard from "../../components/entrenador/clase/ClaseDisponibleCard";
import ClaseDisponibleDetalleModal from "../../components/entrenador/clase/ClaseDisponibleDetalleModal";
import ConflictoHorarioModal from "../../components/entrenador/clase/ConflictoHorarioModal";

import {
  obtenerClasesDisponiblesEntrenador,
  unirmeAClase,
} from "../../services/Entrenador.Service";

import type {
  ClaseDisponibleEntrenador,
  ConflictoUnirseClaseResponse,
} from "../../types/entrenadorClases";

type ConflictoPendiente = {
  clase: ClaseDisponibleEntrenador;
  respuesta: ConflictoUnirseClaseResponse;
};

export default function ClasesDisponiblesEntrenadorPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [clases, setClases] = useState<
    ClaseDisponibleEntrenador[]
  >([]);
  const [busqueda, setBusqueda] = useState("");
  const [soloSinConflicto, setSoloSinConflicto] =
    useState(false);
  const [uniendoseId, setUniendoseId] =
    useState<number | null>(null);
  const [claseDetalle, setClaseDetalle] =
    useState<ClaseDisponibleEntrenador | null>(null);
  const [conflictoPendiente, setConflictoPendiente] =
    useState<ConflictoPendiente | null>(null);

  const cargar = async (cargaCompleta = true) => {
    try {
      if (cargaCompleta) {
        setLoading(true);
      } else {
        setActualizando(true);
      }

      const data =
        await obtenerClasesDisponiblesEntrenador();

      setClases(data ?? []);

      if (claseDetalle) {
        const actualizada = (data ?? []).find(
          (clase) =>
            clase.claseId === claseDetalle.claseId,
        );

        setClaseDetalle(actualizada ?? null);
      }
    } catch (error: any) {
      if (!error?.response || error.response.status >= 500) {
        console.error(
          "[Clases disponibles entrenador]",
          error,
        );
      }

      toast.error(
        error?.response?.data?.mensaje ??
          "No fue posible cargar las clases disponibles.",
      );
    } finally {
      setLoading(false);
      setActualizando(false);
    }
  };

  useEffect(() => {
    void cargar();
  }, []);

  const clasesFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return clases.filter((clase) => {
      const coincideTexto =
        `${clase.grupo} ${clase.diaSemana} ${clase.estado}`
          .toLowerCase()
          .includes(termino);

      const coincideConflicto =
        !soloSinConflicto ||
        !clase.tieneConflictoHorario;

      return coincideTexto && coincideConflicto;
    });
  }, [clases, busqueda, soloSinConflicto]);

  const esConflicto = (
    error: any,
  ): error is {
    response: {
      status: number;
      data: ConflictoUnirseClaseResponse;
    };
  } =>
    error?.response?.status === 409 &&
    error?.response?.data?.requiereConfirmacion === true;

  const unirme = async (
    clase: ClaseDisponibleEntrenador,
  ) => {
    try {
      setUniendoseId(clase.claseId);

      await unirmeAClase(clase.claseId);

      toast.success(
        `Ahora participás en ${clase.grupo}.`,
      );

      setClaseDetalle(null);
      await cargar(false);
    } catch (error: any) {
      if (esConflicto(error)) {
        setClaseDetalle(null);
        setConflictoPendiente({
          clase,
          respuesta: error.response.data,
        });
        return;
      }

      toast.error(
        error?.response?.data?.mensaje ??
          "No fue posible unirte a la clase.",
      );
    } finally {
      setUniendoseId(null);
    }
  };

  const confirmarConConflicto = async () => {
    if (!conflictoPendiente) return;

    try {
      setUniendoseId(
        conflictoPendiente.clase.claseId,
      );

      await unirmeAClase(
        conflictoPendiente.clase.claseId,
        true,
      );

      toast.success(
        `Ahora participás en ${conflictoPendiente.clase.grupo}.`,
      );

      setConflictoPendiente(null);
      await cargar(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.mensaje ??
          "No fue posible unirte a la clase.",
      );
    } finally {
      setUniendoseId(null);
    }
  };

  if (loading) {
    return <FullScreenLoading />;
  }

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      <TopBar />

      <main className="mx-auto w-full max-w-[1500px] px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() =>
              navigate("/entrenador/mis-clases")
            }
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-gray-400 transition-colors hover:text-[#4adea8]"
          >
            <ArrowBackOutlinedIcon fontSize="small" />
            Volver a mis clases
          </button>

          <button
            type="button"
            disabled={actualizando}
            onClick={() => void cargar(false)}
            className="inline-flex h-10 w-fit items-center gap-2 rounded-xl border border-[#2d463b] bg-[#1a2b24] px-4 text-sm font-semibold text-gray-300 transition-all hover:border-[#4adea8] hover:text-[#4adea8] disabled:opacity-50"
          >
            <RefreshOutlinedIcon
              fontSize="small"
              className={
                actualizando ? "animate-spin" : ""
              }
            />
            {actualizando
              ? "Actualizando..."
              : "Actualizar"}
          </button>
        </div>

        <section className="mb-8 rounded-3xl border border-[#4adea8]/20 bg-gradient-to-r from-[#1a2b24] to-[#163129] p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-wide text-[#4adea8]">
            Autogestión
          </p>

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            Clases disponibles
          </h1>

          <p className="mt-2 max-w-3xl leading-relaxed text-gray-300">
            Revisá horarios, vigencia, ocupación y ubicación antes
            de decidir si querés unirte como entrenador.
          </p>
        </section>

        <section className="mb-8 rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-4 sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="relative">
              <SearchOutlinedIcon
                sx={{
                  color: "#9ca3af",
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />

              <input
                value={busqueda}
                onChange={(event) =>
                  setBusqueda(event.target.value)
                }
                placeholder="Buscar por grupo, día o estado..."
                className="h-12 w-full rounded-2xl border border-[#2d463b] bg-[#12201b] pl-12 pr-4 outline-none transition-all focus:border-[#4adea8]"
              />
            </div>

            <label className="flex h-12 cursor-pointer items-center gap-3 rounded-xl border border-[#2d463b] bg-[#12201b] px-4">
              <input
                type="checkbox"
                checked={soloSinConflicto}
                onChange={(event) =>
                  setSoloSinConflicto(
                    event.target.checked,
                  )
                }
                className="h-4 w-4 accent-[#4adea8]"
              />

              <span className="text-sm font-semibold">
                Solo sin conflicto
              </span>
            </label>
          </div>
        </section>

        {clases.length === 0 ? (
          <EstadoVacio
            titulo="No hay clases disponibles"
            descripcion="Actualmente ya participás en todas las clases o no existen clases disponibles."
          />
        ) : clasesFiltradas.length === 0 ? (
          <EstadoVacio
            titulo="No encontramos resultados"
            descripcion="Probá cambiar la búsqueda o desactivar el filtro."
          />
        ) : (
          <section>
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-wide text-[#4adea8]">
                Disponibilidad
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                {clasesFiltradas.length}{" "}
                {clasesFiltradas.length === 1
                  ? "clase disponible"
                  : "clases disponibles"}
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {clasesFiltradas.map((clase) => (
                <ClaseDisponibleCard
                  key={clase.claseId}
                  clase={clase}
                  uniendose={
                    uniendoseId === clase.claseId
                  }
                  onVerDetalle={setClaseDetalle}
                  onUnirme={unirme}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <ClaseDisponibleDetalleModal
        clase={claseDetalle}
        uniendose={
          claseDetalle !== null &&
          uniendoseId === claseDetalle.claseId
        }
        onCerrar={() => setClaseDetalle(null)}
        onUnirme={unirme}
      />

      <ConflictoHorarioModal
        abierto={conflictoPendiente !== null}
        mensaje={
          conflictoPendiente?.respuesta.mensaje ??
          "Ya tenés otra clase en ese horario."
        }
        conflictos={
          conflictoPendiente?.respuesta.conflictos ?? []
        }
        procesando={uniendoseId !== null}
        onCancelar={() =>
          setConflictoPendiente(null)
        }
        onConfirmar={confirmarConConflicto}
      />
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
    <section className="rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-10 text-center">
      <EventAvailableOutlinedIcon
        sx={{ color: "#4adea8", fontSize: 42 }}
      />

      <h2 className="mt-4 text-2xl font-bold">
        {titulo}
      </h2>

      <p className="mt-2 text-gray-400">
        {descripcion}
      </p>
    </section>
  );
}
