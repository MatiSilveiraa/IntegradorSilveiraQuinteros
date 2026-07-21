import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import SportsScoreOutlinedIcon from "@mui/icons-material/SportsScoreOutlined";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

import AlumnoLayout from "../components/layout/DashboardLayout";
import FullScreenLoading from "../components/FullScreenSpinner";

import { obtenerMiPerfil } from "../services/Perfil.service";
import {
  obtenerDesafios,
  obtenerMisDesafios,
  participarDesafio,
} from "../services/Desafio.Service";

import type { Desafio, Perfil } from "../types";
import type { ReactNode } from "react";

type EstadoDesafio =
  | "ACTIVO"
  | "PROXIMO"
  | "FINALIZADO"
  | "CANCELADO";

type TabDesafios = "explorar" | "mis-desafios";

type DesafioDisponible = Desafio & {
  estado?: EstadoDesafio;
  puedeParticipar?: boolean;
  yaParticipa?: boolean;
  motivoEstado?: string | null;
};

export default function DesafiosPage() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);

  const [desafios, setDesafios] = useState<DesafioDisponible[]>([]);
  const [misDesafios, setMisDesafios] = useState<Desafio[]>([]);

  const [loading, setLoading] = useState(true);
  const [participandoId, setParticipandoId] = useState<number | null>(null);

  const [tabActiva, setTabActiva] =
    useState<TabDesafios>("explorar");

  useEffect(() => {
    void cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      const [perfilData, desafiosData, misDesafiosData] =
        await Promise.all([
          obtenerMiPerfil(),
          obtenerDesafios(),
          obtenerMisDesafios(),
        ]);

      setPerfil(perfilData);

      setDesafios(
        (desafiosData ?? []) as DesafioDisponible[],
      );

      setMisDesafios(
        (misDesafiosData ?? []) as Desafio[],
      );
    } catch (error) {
      console.error(error);
      toast.error("No fue posible cargar los desafíos");
    } finally {
      setLoading(false);
    }
  };

  const handleParticipar = async (
    desafio: DesafioDisponible,
  ) => {
    if (!desafio.id) {
      toast.error("No se pudo identificar el desafío");
      return;
    }

    if (!desafio.puedeParticipar) {
      toast.error(
        desafio.motivoEstado ??
          "Este desafío no está disponible para participar",
      );

      return;
    }

    try {
      setParticipandoId(desafio.id);

      await participarDesafio(desafio.id);

      toast.success("Te uniste al desafío correctamente");

      await cargarDatos();

      setTabActiva("mis-desafios");
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.mensaje ??
          "No fue posible participar en el desafío",
      );
    } finally {
      setParticipandoId(null);
    }
  };

  const desafiosOrdenados = useMemo(() => {
    const prioridad: Record<EstadoDesafio, number> = {
      ACTIVO: 0,
      PROXIMO: 1,
      FINALIZADO: 2,
      CANCELADO: 3,
    };

    return [...desafios].sort((a, b) => {
      const estadoA = a.estado ?? "FINALIZADO";
      const estadoB = b.estado ?? "FINALIZADO";

      const diferencia =
        prioridad[estadoA] - prioridad[estadoB];

      if (diferencia !== 0) {
        return diferencia;
      }

      return (
        crearFechaLocal(a.fechaInicio).getTime() -
        crearFechaLocal(b.fechaInicio).getTime()
      );
    });
  }, [desafios]);

  /*
   * En Explorar no mostramos desafíos en los que
   * el alumno ya está participando.
   */
  const desafiosParaExplorar = useMemo(() => {
    return desafiosOrdenados.filter(
      (desafio) => !desafio.yaParticipa,
    );
  }, [desafiosOrdenados]);

  const misDesafiosOrdenados = useMemo(() => {
    return [...misDesafios].sort(
      (a, b) =>
        crearFechaLocal(b.fechaInicio).getTime() -
        crearFechaLocal(a.fechaInicio).getTime(),
    );
  }, [misDesafios]);

  const resumen = useMemo(() => {
    const desafiosActivos = desafios.filter(
      (desafio) => desafio.estado === "ACTIVO",
    ).length;

    const participando = misDesafios.filter(
      (desafio) => !desafio.ganador,
    ).length;

    const ganados = misDesafios.filter(
      (desafio) => desafio.ganador,
    ).length;

    return {
      activos: desafiosActivos,
      participando,
      ganados,
    };
  }, [desafios, misDesafios]);

  if (loading) {
    return <FullScreenLoading />;
  }

  return (
    <AlumnoLayout nombre={perfil?.nombre}>
      <main className="mx-auto max-w-7xl">
        {/* ENCABEZADO */}

        <section className="mb-8 rounded-3xl border border-[#4adea8]/20 bg-gradient-to-r from-[#1a2b24] to-[#163129] p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#4adea8]/30 bg-[#4adea8]/10">
              <EmojiEventsOutlinedIcon
                sx={{
                  color: "#4adea8",
                  fontSize: 32,
                }}
              />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#4adea8]">
                Desafíos
              </p>

              <h1 className="mt-2 text-3xl font-bold md:text-4xl">
                Hola, {perfil?.nombre ?? "Alumno"}
              </h1>

              <p className="mt-2 text-gray-300">
                Participá en nuevos desafíos, seguí tus resultados y
                obtené beneficios exclusivos.
              </p>
            </div>
          </div>
        </section>

        {/* RESUMEN */}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ResumenCard
            titulo="Activos"
            valor={resumen.activos}
            descripcion="Desafíos activos actualmente"
            icono={<SportsScoreOutlinedIcon />}
          />

          <ResumenCard
            titulo="Participando"
            valor={resumen.participando}
            descripcion="Participaciones actuales"
            icono={<CheckCircleOutlineOutlinedIcon />}
          />

          <ResumenCard
            titulo="Ganados"
            valor={resumen.ganados}
            descripcion="Desafíos completados como ganador"
            icono={<WorkspacePremiumOutlinedIcon />}
          />
        </div>

        {/* PESTAÑAS */}

        <section className="mb-8 rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setTabActiva("explorar")}
              className={`
                flex
                items-center
                justify-center
                gap-3
                rounded-2xl
                px-5
                py-4
                font-bold
                transition-all
                ${
                  tabActiva === "explorar"
                    ? "bg-[#4adea8] text-[#12201b]"
                    : "border border-[#2d463b] bg-[#12201b] text-gray-300 hover:border-[#4adea8] hover:text-white"
                }
              `}
            >
              <ExploreOutlinedIcon />

              Explorar desafíos

              <span
                className={`
                  rounded-full
                  px-2.5
                  py-1
                  text-xs
                  ${
                    tabActiva === "explorar"
                      ? "bg-[#12201b]/15 text-[#12201b]"
                      : "bg-[#1a2b24] text-gray-400"
                  }
                `}
              >
                {desafiosParaExplorar.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setTabActiva("mis-desafios")}
              className={`
                flex
                items-center
                justify-center
                gap-3
                rounded-2xl
                px-5
                py-4
                font-bold
                transition-all
                ${
                  tabActiva === "mis-desafios"
                    ? "bg-[#4adea8] text-[#12201b]"
                    : "border border-[#2d463b] bg-[#12201b] text-gray-300 hover:border-[#4adea8] hover:text-white"
                }
              `}
            >
              <PersonOutlineOutlinedIcon />

              Mis desafíos

              <span
                className={`
                  rounded-full
                  px-2.5
                  py-1
                  text-xs
                  ${
                    tabActiva === "mis-desafios"
                      ? "bg-[#12201b]/15 text-[#12201b]"
                      : "bg-[#1a2b24] text-gray-400"
                  }
                `}
              >
                {misDesafios.length}
              </span>
            </button>
          </div>
        </section>

        {/* EXPLORAR */}

        {tabActiva === "explorar" && (
          <section>
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wide text-[#4adea8]">
                Disponibilidad
              </p>

              <h2 className="mt-2 text-2xl font-bold md:text-3xl">
                Explorar desafíos
              </h2>

              <p className="mt-2 text-gray-400">
                Acá aparecen únicamente los desafíos en los que todavía
                no participás.
              </p>
            </div>

            {desafiosParaExplorar.length === 0 ? (
              <EstadoVacio
                icono={
                  <CheckCircleOutlineOutlinedIcon
                    sx={{
                      color: "#4adea8",
                      fontSize: 36,
                    }}
                  />
                }
                titulo="Ya participás en todos los desafíos"
                descripcion="Cuando se publique un nuevo desafío disponible, aparecerá en esta sección."
                accionTexto={
                  misDesafios.length > 0
                    ? "Ver mis desafíos"
                    : undefined
                }
                onAccion={
                  misDesafios.length > 0
                    ? () => setTabActiva("mis-desafios")
                    : undefined
                }
              />
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {desafiosParaExplorar.map((desafio) => (
                  <TarjetaDesafioDisponible
                    key={desafio.id}
                    desafio={desafio}
                    cargando={participandoId === desafio.id}
                    onParticipar={() =>
                      void handleParticipar(desafio)
                    }
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* MIS DESAFÍOS */}

        {tabActiva === "mis-desafios" && (
          <section>
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-wide text-[#4adea8]">
                Mi actividad
              </p>

              <h2 className="mt-2 text-2xl font-bold md:text-3xl">
                Mis desafíos
              </h2>

              <p className="mt-2 text-gray-400">
                Consultá tus participaciones, estados y resultados.
              </p>
            </div>

            {misDesafiosOrdenados.length === 0 ? (
              <EstadoVacio
                icono={
                  <EmojiEventsOutlinedIcon
                    sx={{
                      color: "#4adea8",
                      fontSize: 36,
                    }}
                  />
                }
                titulo="Todavía no participás en desafíos"
                descripcion="Explorá los desafíos activos y unite al que más te interese."
                accionTexto="Explorar desafíos"
                onAccion={() => setTabActiva("explorar")}
              />
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {misDesafiosOrdenados.map(
                  (desafio, indice) => (
                    <TarjetaMiDesafio
                      key={
                        desafio.desafioId ??
                        desafio.id ??
                        `${desafio.titulo}-${indice}`
                      }
                      desafio={desafio}
                    />
                  ),
                )}
              </div>
            )}
          </section>
        )}
      </main>
    </AlumnoLayout>
  );
}

function TarjetaDesafioDisponible({
  desafio,
  cargando,
  onParticipar,
}: {
  desafio: DesafioDisponible;
  cargando: boolean;
  onParticipar: () => void;
}) {
  const estado = desafio.estado ?? "FINALIZADO";
  const visual = obtenerVisualEstado(estado);

  return (
    <article className="flex min-h-[360px] flex-col rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-6 transition-all hover:border-[#4adea8]/40">
      <div className="flex items-start justify-between gap-4">
        <span
          className={`
            inline-flex
            rounded-full
            border
            px-3
            py-1
            text-xs
            font-bold
            ${visual.clases}
          `}
        >
          {visual.texto}
        </span>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#2d463b] bg-[#12201b]">
          {visual.icono}
        </div>
      </div>

      <h3 className="mt-5 break-words text-2xl font-bold">
        {desafio.titulo}
      </h3>

      <p className="mt-3 leading-relaxed text-gray-400">
        {desafio.descripcion?.trim() ||
          "Sin descripción cargada."}
      </p>

      <div className="mt-6 rounded-2xl border border-[#2d463b] bg-[#12201b] p-4">
        <p className="text-xs uppercase tracking-wide text-gray-500">
          Duración
        </p>

        <p className="mt-2 font-bold">
          {formatearFecha(desafio.fechaInicio)} -{" "}
          {formatearFecha(desafio.fechaFin)}
        </p>
      </div>

      <div className="mt-auto pt-6">
        {desafio.puedeParticipar ? (
          <button
            type="button"
            onClick={onParticipar}
            disabled={cargando}
            className="
              w-full
              rounded-xl
              bg-[#4adea8]
              py-3
              font-bold
              text-[#12201b]
              transition-all
              hover:brightness-110
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {cargando ? "Uniéndote..." : "Participar"}
          </button>
        ) : (
          <div
            className={`
              rounded-2xl
              border
              p-4
              ${visual.panel}
            `}
          >
            <p className="font-bold">{visual.texto}</p>

            <p className="mt-1 text-sm text-gray-300">
              {desafio.motivoEstado ?? visual.descripcion}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}

function TarjetaMiDesafio({
  desafio,
}: {
  desafio: Desafio;
}) {
  const resultado = desafio.resultado?.trim();

  return (
    <article className="flex min-h-[360px] flex-col rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-6 transition-all hover:border-[#4adea8]/40">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#2d463b] bg-[#12201b]">
          {desafio.ganador ? (
            <WorkspacePremiumOutlinedIcon
              sx={{ color: "#facc15" }}
            />
          ) : (
            <EmojiEventsOutlinedIcon
              sx={{ color: "#4adea8" }}
            />
          )}
        </div>

        {desafio.ganador ? (
          <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-300">
            Ganador
          </span>
        ) : (
          <span className="rounded-full border border-[#4adea8]/30 bg-[#4adea8]/10 px-3 py-1 text-xs font-bold text-[#4adea8]">
            Participando
          </span>
        )}
      </div>

      <h3 className="mt-5 break-words text-2xl font-bold">
        {desafio.titulo}
      </h3>

      <p className="mt-3 leading-relaxed text-gray-400">
        {desafio.descripcion?.trim() ||
          "Sin descripción cargada."}
      </p>

      <div className="mt-5 rounded-2xl border border-[#2d463b] bg-[#12201b] p-4">
        <p className="text-xs uppercase tracking-wide text-gray-500">
          Duración
        </p>

        <p className="mt-2 font-bold">
          {formatearFecha(desafio.fechaInicio)} -{" "}
          {formatearFecha(desafio.fechaFin)}
        </p>
      </div>

      <div className="mt-auto pt-4">
        {resultado ? (
          <div
            className={`
              rounded-2xl
              border
              p-4
              ${
                desafio.ganador
                  ? "border-yellow-500/30 bg-yellow-500/10"
                  : "border-[#4adea8]/20 bg-[#4adea8]/10"
              }
            `}
          >
            <p
              className={`
                text-xs
                font-bold
                uppercase
                tracking-wide
                ${
                  desafio.ganador
                    ? "text-yellow-300"
                    : "text-[#4adea8]"
                }
              `}
            >
              Resultado
            </p>

            <p className="mt-2 font-semibold text-white">
              {resultado}
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-[#4adea8]/20 bg-[#4adea8]/10 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-[#4adea8]">
              Estado
            </p>

            <p className="mt-2 font-semibold text-white">
              Participando
            </p>
          </div>
        )}
      </div>
    </article>
  );
}

function ResumenCard({
  titulo,
  valor,
  descripcion,
  icono,
}: {
  titulo: string;
  valor: number;
  descripcion: string;
  icono: ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-400">{titulo}</p>

          <p className="mt-3 text-4xl font-bold">{valor}</p>

          <p className="mt-2 text-xs text-gray-500">
            {descripcion}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#2d463b] bg-[#12201b] text-[#4adea8]">
          {icono}
        </div>
      </div>
    </div>
  );
}

function EstadoVacio({
  icono,
  titulo,
  descripcion,
  accionTexto,
  onAccion,
}: {
  icono: ReactNode;
  titulo: string;
  descripcion: string;
  accionTexto?: string;
  onAccion?: () => void;
}) {
  return (
    <div className="rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-10 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#4adea8]/30 bg-[#4adea8]/10">
        {icono}
      </div>

      <h3 className="mt-5 text-2xl font-bold">{titulo}</h3>

      <p className="mx-auto mt-2 max-w-xl text-gray-400">
        {descripcion}
      </p>

      {accionTexto && onAccion && (
        <button
          type="button"
          onClick={onAccion}
          className="mt-6 rounded-xl bg-[#4adea8] px-5 py-3 font-bold text-[#12201b] transition-all hover:brightness-110"
        >
          {accionTexto}
        </button>
      )}
    </div>
  );
}

function obtenerVisualEstado(
  estado: EstadoDesafio,
) {
  switch (estado) {
    case "ACTIVO":
      return {
        texto: "Activo",
        descripcion:
          "El desafío está disponible para participar.",
        clases:
          "border-[#4adea8]/30 bg-[#4adea8]/10 text-[#4adea8]",
        panel:
          "border-[#4adea8]/30 bg-[#4adea8]/10 text-[#4adea8]",
        icono: (
          <SportsScoreOutlinedIcon
            sx={{ color: "#4adea8" }}
          />
        ),
      };

    case "PROXIMO":
      return {
        texto: "Próximamente",
        descripcion:
          "El desafío todavía no comenzó.",
        clases:
          "border-blue-500/30 bg-blue-500/10 text-blue-300",
        panel:
          "border-blue-500/30 bg-blue-500/10 text-blue-300",
        icono: (
          <ScheduleOutlinedIcon
            sx={{ color: "#93c5fd" }}
          />
        ),
      };

    case "CANCELADO":
      return {
        texto: "Cancelado",
        descripcion: "El desafío fue cancelado.",
        clases:
          "border-red-500/30 bg-red-500/10 text-red-400",
        panel:
          "border-red-500/30 bg-red-500/10 text-red-400",
        icono: (
          <CancelOutlinedIcon
            sx={{ color: "#f87171" }}
          />
        ),
      };

    default:
      return {
        texto: "Finalizado",
        descripcion: "El desafío ya terminó.",
        clases:
          "border-gray-500/30 bg-gray-500/10 text-gray-300",
        panel:
          "border-gray-500/30 bg-gray-500/10 text-gray-300",
        icono: (
          <CheckCircleOutlineOutlinedIcon
            sx={{ color: "#d1d5db" }}
          />
        ),
      };
  }
}

function crearFechaLocal(fecha: string) {
  const fechaSinHora = fecha.substring(0, 10);
  const [anio, mes, dia] = fechaSinHora.split("-").map(Number);

  return new Date(anio, mes - 1, dia);
}

function formatearFecha(fecha: string) {
  return crearFechaLocal(fecha).toLocaleDateString("es-UY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}