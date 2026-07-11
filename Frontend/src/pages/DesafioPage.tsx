import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import SportsScoreOutlinedIcon from "@mui/icons-material/SportsScoreOutlined";

import AlumnoLayout from "../components/layout/DashboardLayout";
import FullScreenLoading from "../components/FullScreenSpinner";

import { obtenerMiPerfil } from "../services/Perfil.service";
import {
  obtenerDesafios,
  obtenerMisDesafios,
  participarDesafio,
} from "../services/Desafio.Service";

import type { Perfil, Desafio } from "../types";

type EstadoDesafio =
  | "ACTIVO"
  | "PROXIMO"
  | "FINALIZADO"
  | "CANCELADO";

type DesafioDisponible = Desafio & {
  estado?: EstadoDesafio;
  puedeParticipar?: boolean;
  yaParticipa?: boolean;
  motivoEstado?: string | null;
};

export default function DesafiosPage() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [loading, setLoading] = useState(true);
  const [participandoId, setParticipandoId] = useState<number | null>(null);
  const [desafios, setDesafios] = useState<DesafioDisponible[]>([]);
  const [misDesafios, setMisDesafios] = useState<Desafio[]>([]);

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
      setDesafios((desafiosData ?? []) as DesafioDisponible[]);
      setMisDesafios(misDesafiosData ?? []);
    } catch (error) {
      console.error(error);
      toast.error("No fue posible cargar los desafíos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void cargarDatos();
  }, []);

  const handleParticipar = async (desafio: DesafioDisponible) => {
    if (!desafio.id || !desafio.puedeParticipar) {
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

  const resumen = useMemo(() => {
    return {
      activos: desafios.filter((d) => d.estado === "ACTIVO").length,
      participando: desafios.filter((d) => d.yaParticipa).length,
      ganados: misDesafios.filter((d) => d.ganador).length,
    };
  }, [desafios, misDesafios]);

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
      const diferencia = prioridad[estadoA] - prioridad[estadoB];

      if (diferencia !== 0) return diferencia;

      return (
        new Date(a.fechaInicio).getTime() -
        new Date(b.fechaInicio).getTime()
      );
    });
  }, [desafios]);

  if (loading) return <FullScreenLoading />;

  return (
    <AlumnoLayout nombre={perfil?.nombre}>
      <main className="max-w-7xl mx-auto">
        <section className="rounded-3xl border border-[#4adea8]/20 bg-gradient-to-r from-[#1a2b24] to-[#163129] p-6 md:p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#4adea8]/10 border border-[#4adea8]/30 flex items-center justify-center">
              <EmojiEventsOutlinedIcon sx={{ color: "#4adea8", fontSize: 32 }} />
            </div>

            <div>
              <p className="text-[#4adea8] text-xs font-bold uppercase tracking-wide">
                Desafíos
              </p>
              <h1 className="text-3xl md:text-4xl font-bold mt-2">
                Hola, {perfil?.nombre}
              </h1>
              <p className="text-gray-300 mt-2">
                Participá en desafíos y obtené beneficios exclusivos.
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
          <ResumenCard titulo="Activos" valor={resumen.activos} descripcion="Desafíos disponibles" icono={<SportsScoreOutlinedIcon />} />
          <ResumenCard titulo="Participando" valor={resumen.participando} descripcion="Desafíos actuales" icono={<CheckCircleOutlineOutlinedIcon />} />
          <ResumenCard titulo="Ganados" valor={resumen.ganados} descripcion="Desafíos completados" icono={<WorkspacePremiumOutlinedIcon />} />
        </div>

        <section>
          <div className="mb-6">
            <p className="text-[#4adea8] text-xs font-bold uppercase tracking-wide">
              Disponibilidad
            </p>
            <h2 className="text-2xl md:text-3xl font-bold mt-2">
              Desafíos disponibles
            </h2>
            <p className="text-gray-400 mt-2">
              El estado y la disponibilidad se actualizan automáticamente.
            </p>
          </div>

          {desafiosOrdenados.length === 0 ? (
            <EstadoVacio titulo="No hay desafíos publicados" descripcion="Cuando haya un nuevo desafío, aparecerá en esta sección." />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {desafiosOrdenados.map((desafio) => (
                <TarjetaDesafio
                  key={desafio.id}
                  desafio={desafio}
                  cargando={participandoId === desafio.id}
                  onParticipar={() => handleParticipar(desafio)}
                />
              ))}
            </div>
          )}
        </section>

        <section className="mt-12">
          <div className="mb-6">
            <p className="text-[#4adea8] text-xs font-bold uppercase tracking-wide">Mi actividad</p>
            <h2 className="text-2xl md:text-3xl font-bold mt-2">Mis desafíos</h2>
            <p className="text-gray-400 mt-2">Consultá tus participaciones y resultados.</p>
          </div>

          {misDesafios.length === 0 ? (
            <EstadoVacio titulo="Todavía no participás en desafíos" descripcion="Unite a un desafío activo para verlo en esta sección." />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {misDesafios.map((desafio) => (
                <article key={desafio.desafioId} className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#12201b] border border-[#2d463b] flex items-center justify-center">
                      <EmojiEventsOutlinedIcon sx={{ color: "#4adea8" }} />
                    </div>
                    {desafio.ganador ? (
                      <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-300 border border-yellow-500/30 text-xs font-bold">Ganador</span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-[#4adea8]/10 text-[#4adea8] border border-[#4adea8]/30 text-xs font-bold">Participando</span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold mt-5">{desafio.titulo}</h3>
                  <p className="text-gray-400 mt-3 leading-relaxed">{desafio.descripcion}</p>

                  <div className="mt-5 rounded-2xl bg-[#12201b] border border-[#2d463b] p-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Duración</p>
                    <p className="font-bold mt-2">
                      {formatearFecha(desafio.fechaInicio)} - {formatearFecha(desafio.fechaFin)}
                    </p>
                  </div>

                  {desafio.resultado?.trim() && (
                    <div className="mt-4 rounded-2xl bg-[#4adea8]/10 border border-[#4adea8]/20 p-4">
                      <p className="text-xs text-[#4adea8] font-bold uppercase tracking-wide">Resultado</p>
                      <p className="mt-2">{desafio.resultado}</p>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </AlumnoLayout>
  );
}

function TarjetaDesafio({ desafio, cargando, onParticipar }: { desafio: DesafioDisponible; cargando: boolean; onParticipar: () => void }) {
  const estado = desafio.estado ?? "FINALIZADO";
  const visual = obtenerVisualEstado(estado);

  return (
    <article className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6 flex flex-col min-h-[360px] hover:border-[#4adea8]/40 transition-all">
      <div className="flex items-start justify-between gap-4">
        <span className={`inline-flex px-3 py-1 rounded-full border text-xs font-bold ${visual.clases}`}>{visual.texto}</span>
        <div className="w-11 h-11 rounded-2xl bg-[#12201b] border border-[#2d463b] flex items-center justify-center">{visual.icono}</div>
      </div>

      <h3 className="text-2xl font-bold mt-5">{desafio.titulo}</h3>
      <p className="text-gray-400 mt-3 leading-relaxed">{desafio.descripcion || "Sin descripción cargada."}</p>

      <div className="mt-6 rounded-2xl bg-[#12201b] border border-[#2d463b] p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide">Duración</p>
        <p className="font-bold mt-2">{formatearFecha(desafio.fechaInicio)} - {formatearFecha(desafio.fechaFin)}</p>
      </div>

      <div className="mt-auto pt-6">
        {desafio.puedeParticipar ? (
          <button type="button" onClick={onParticipar} disabled={cargando} className="w-full py-3 rounded-xl bg-[#4adea8] text-[#12201b] font-bold hover:brightness-110 disabled:opacity-50 transition-all">
            {cargando ? "Uniéndote..." : "Participar"}
          </button>
        ) : (
          <div className={`rounded-2xl border p-4 ${visual.panel}`}>
            <p className="font-bold">{desafio.yaParticipa ? "Ya participás" : visual.texto}</p>
            <p className="text-sm text-gray-300 mt-1">{desafio.motivoEstado ?? visual.descripcion}</p>
          </div>
        )}
      </div>
    </article>
  );
}

function ResumenCard({ titulo, valor, descripcion, icono }: { titulo: string; valor: number; descripcion: string; icono: React.ReactNode }) {
  return (
    <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-400">{titulo}</p>
          <p className="text-4xl font-bold mt-3">{valor}</p>
          <p className="text-xs text-gray-500 mt-2">{descripcion}</p>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-[#12201b] border border-[#2d463b] text-[#4adea8] flex items-center justify-center">{icono}</div>
      </div>
    </div>
  );
}

function EstadoVacio({ titulo, descripcion }: { titulo: string; descripcion: string }) {
  return (
    <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-10 text-center">
      <div className="w-16 h-16 mx-auto rounded-2xl bg-[#4adea8]/10 border border-[#4adea8]/30 flex items-center justify-center">
        <EmojiEventsOutlinedIcon sx={{ color: "#4adea8", fontSize: 34 }} />
      </div>
      <h3 className="text-2xl font-bold mt-5">{titulo}</h3>
      <p className="text-gray-400 mt-2">{descripcion}</p>
    </div>
  );
}

function obtenerVisualEstado(estado: EstadoDesafio) {
  switch (estado) {
    case "ACTIVO":
      return {
        texto: "Activo",
        descripcion: "El desafío está disponible.",
        clases: "bg-[#4adea8]/10 text-[#4adea8] border-[#4adea8]/30",
        panel: "bg-[#4adea8]/10 border-[#4adea8]/30 text-[#4adea8]",
        icono: <SportsScoreOutlinedIcon sx={{ color: "#4adea8" }} />,
      };
    case "PROXIMO":
      return {
        texto: "Próximamente",
        descripcion: "El desafío todavía no comenzó.",
        clases: "bg-blue-500/10 text-blue-300 border-blue-500/30",
        panel: "bg-blue-500/10 border-blue-500/30 text-blue-300",
        icono: <ScheduleOutlinedIcon sx={{ color: "#93c5fd" }} />,
      };
    case "CANCELADO":
      return {
        texto: "Cancelado",
        descripcion: "El desafío fue cancelado.",
        clases: "bg-red-500/10 text-red-400 border-red-500/30",
        panel: "bg-red-500/10 border-red-500/30 text-red-400",
        icono: <CancelOutlinedIcon sx={{ color: "#f87171" }} />,
      };
    default:
      return {
        texto: "Finalizado",
        descripcion: "El desafío ya terminó.",
        clases: "bg-gray-500/10 text-gray-300 border-gray-500/30",
        panel: "bg-gray-500/10 border-gray-500/30 text-gray-300",
        icono: <CheckCircleOutlineOutlinedIcon sx={{ color: "#d1d5db" }} />,
      };
  }
}

function formatearFecha(fecha: string) {
  const fechaSinHora = fecha.substring(0, 10);
  const [anio, mes, dia] = fechaSinHora.split("-").map(Number);

  return new Date(anio, mes - 1, dia).toLocaleDateString("es-UY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}