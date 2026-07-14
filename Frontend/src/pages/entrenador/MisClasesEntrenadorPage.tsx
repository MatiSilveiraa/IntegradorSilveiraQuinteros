import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";

import TopBar from "../../components/navigation/DashboardTopBar";
import FullScreenLoading from "../../components/FullScreenSpinner";
import MisClaseCard from "../../components/entrenador/clase/MisClaseCard";
import ConfirmacionEntrenadorModal from "../../components/entrenador/clase/ConfirmacionEntrenadorModal";

import {
  obtenerMisClasesEntrenador,
  salirDeClase,
} from "../../services/Entrenador.Service";

import type {
  ClaseAsignadaEntrenador,
} from "../../types/entrenadorClases";

export default function MisClasesEntrenadorPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [clases, setClases] = useState<
    ClaseAsignadaEntrenador[]
  >([]);
  const [busqueda, setBusqueda] = useState("");
  const [claseAbandonar, setClaseAbandonar] =
    useState<ClaseAsignadaEntrenador | null>(null);
  const [abandonandoId, setAbandonandoId] =
    useState<number | null>(null);

  const cargar = async () => {
    try {
      setLoading(true);
      const data = await obtenerMisClasesEntrenador();
      setClases(data ?? []);
    } catch (error: any) {
      if (!error?.response || error.response.status >= 500) {
        console.error("[Mis clases entrenador]", error);
      }

      toast.error(
        error?.response?.data?.mensaje ??
          "No fue posible cargar tus clases.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void cargar();
  }, []);

  const clasesFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return clases.filter((clase) =>
      `${clase.grupo} ${clase.diaSemana} ${clase.estado}`
        .toLowerCase()
        .includes(termino),
    );
  }, [clases, busqueda]);

  const confirmarAbandono = async () => {
    if (!claseAbandonar) return;

    try {
      setAbandonandoId(claseAbandonar.claseId);

      const respuesta = await salirDeClase(
        claseAbandonar.claseId,
      );

      toast.success(
        respuesta?.mensaje ??
          "Dejaste de estar asociado a la clase.",
      );

      setClaseAbandonar(null);
      await cargar();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.mensaje ??
          "No fue posible abandonar la clase.",
      );
    } finally {
      setAbandonandoId(null);
    }
  };

  if (loading) {
    return <FullScreenLoading />;
  }

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      <TopBar />

      <main className="mx-auto w-full max-w-[1500px] px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate("/entrenador")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-400 transition-colors hover:text-[#4adea8]"
        >
          <ArrowBackOutlinedIcon fontSize="small" />
          Volver al panel del entrenador
        </button>

        <section className="mb-8 rounded-3xl border border-[#4adea8]/20 bg-gradient-to-r from-[#1a2b24] to-[#163129] p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#4adea8]">
                Autogestión
              </p>

              <h1 className="mt-2 text-3xl font-bold md:text-4xl">
                Mis clases
              </h1>

              <p className="mt-2 max-w-2xl text-gray-300">
                Consultá las clases en las que participás, registrá
                asistencias o administrá tus asignaciones.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/entrenador/clases-disponibles",
                )
              }
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#4adea8] px-5 font-bold text-[#12201b] transition-all hover:brightness-110"
            >
              <AddCircleOutlineOutlinedIcon fontSize="small" />
              Ver clases disponibles
            </button>
          </div>
        </section>

        <section className="mb-8 rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-4 sm:p-5">
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
        </section>

        {clases.length === 0 ? (
          <EstadoVacio
            titulo="Todavía no tenés clases asignadas"
            descripcion="Podés consultar las clases disponibles y unirte a una."
            onAccion={() =>
              navigate(
                "/entrenador/clases-disponibles",
              )
            }
          />
        ) : clasesFiltradas.length === 0 ? (
          <EstadoVacio
            titulo="No encontramos clases"
            descripcion="Probá cambiar la búsqueda."
          />
        ) : (
          <section>
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-wide text-[#4adea8]">
                Asignaciones
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                {clasesFiltradas.length}{" "}
                {clasesFiltradas.length === 1
                  ? "clase"
                  : "clases"}
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {clasesFiltradas.map((clase) => (
                <MisClaseCard
                  key={clase.claseId}
                  clase={clase}
                  abandonando={
                    abandonandoId === clase.claseId
                  }
                  onAbandonar={setClaseAbandonar}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <ConfirmacionEntrenadorModal
        abierto={claseAbandonar !== null}
        titulo="Abandonar clase"
        descripcion={
          claseAbandonar
            ? `¿Seguro que querés dejar de estar asociado a ${claseAbandonar.grupo}, ${claseAbandonar.diaSemana} de ${claseAbandonar.horaInicio.substring(
                0,
                5,
              )} a ${claseAbandonar.horaFin.substring(
                0,
                5,
              )}?`
            : ""
        }
        textoConfirmar="Abandonar clase"
        peligro
        procesando={abandonandoId !== null}
        onCancelar={() => setClaseAbandonar(null)}
        onConfirmar={confirmarAbandono}
      />
    </div>
  );
}

function EstadoVacio({
  titulo,
  descripcion,
  onAccion,
}: {
  titulo: string;
  descripcion: string;
  onAccion?: () => void;
}) {
  return (
    <section className="rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-10 text-center">
      <CalendarMonthOutlinedIcon
        sx={{ color: "#4adea8", fontSize: 42 }}
      />

      <h2 className="mt-4 text-2xl font-bold">
        {titulo}
      </h2>

      <p className="mt-2 text-gray-400">
        {descripcion}
      </p>

      {onAccion && (
        <button
          type="button"
          onClick={onAccion}
          className="mt-6 rounded-xl bg-[#4adea8] px-5 py-3 font-bold text-[#12201b]"
        >
          Ver clases disponibles
        </button>
      )}
    </section>
  );
}
