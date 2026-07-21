import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ViewAgendaOutlinedIcon from "@mui/icons-material/ViewAgendaOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";


import TopBar from "../../components/navigation/DashboardTopBar";
import FullScreenLoading from "../../components/FullScreenSpinner";

import {
  obtenerMisClasesEntrenador,
} from "../../services/Entrenador.Service";

import type {
  ClaseAsignadaEntrenador,
} from "../../types/entrenadorClases";

type VistaAgenda = "semana" | "lista";

const DIAS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
] as const;

export default function AgendaSemanalEntrenadorPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [vista, setVista] = useState<VistaAgenda>("semana");
  const [clases, setClases] = useState<ClaseAsignadaEntrenador[]>([]);

  const cargar = async (cargaCompleta = true) => {
    try {
      if (cargaCompleta) {
        setLoading(true);
      } else {
        setActualizando(true);
      }

      const data = await obtenerMisClasesEntrenador();
      setClases(data ?? []);
    } catch (error: any) {
      if (!error?.response || error.response.status >= 500) {
        console.error("[Agenda semanal entrenador]", error);
      }

      toast.error(
        error?.response?.data?.mensaje ??
          "No fue posible cargar tu agenda semanal.",
      );
    } finally {
      setLoading(false);
      setActualizando(false);
    }
  };

  useEffect(() => {
    void cargar();
  }, []);

  const clasesOrdenadas = useMemo(() => {
    return [...clases].sort((a, b) => {
      const diaA = DIAS.indexOf(normalizarDia(a.diaSemana) as any);
      const diaB = DIAS.indexOf(normalizarDia(b.diaSemana) as any);

      if (diaA !== diaB) return diaA - diaB;

      return a.horaInicio.localeCompare(b.horaInicio);
    });
  }, [clases]);

  const clasesPorDia = useMemo(() => {
    const resultado = new Map<string, ClaseAsignadaEntrenador[]>();

    DIAS.forEach((dia) => resultado.set(dia, []));

    clasesOrdenadas.forEach((clase) => {
      const dia = normalizarDia(clase.diaSemana);
      const actuales = resultado.get(dia) ?? [];
      actuales.push(clase);
      resultado.set(dia, actuales);
    });

    return resultado;
  }, [clasesOrdenadas]);

  const resumen = useMemo(() => {
    const diasConClase = DIAS.filter(
      (dia) => (clasesPorDia.get(dia)?.length ?? 0) > 0,
    ).length;

    return {
      clases: clases.length,
      diasConClase,
      principales: clases.filter((clase) => clase.esPrincipal).length,
      alumnos: clases.reduce(
        (total, clase) => total + clase.cantidadAlumnos,
        0,
      ),
    };
  }, [clases, clasesPorDia]);

  if (loading) {
    return <FullScreenLoading />;
  }

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      <TopBar />

      <main className="mx-auto w-full max-w-[1600px] px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
         

          <button
            type="button"
            disabled={actualizando}
            onClick={() => void cargar(false)}
            className="inline-flex h-10 w-fit items-center gap-2 rounded-xl border border-[#2d463b] bg-[#1a2b24] px-4 text-sm font-semibold text-gray-300 transition-all hover:border-[#4adea8] hover:text-[#4adea8] disabled:opacity-50"
          >
            <RefreshOutlinedIcon
              fontSize="small"
              className={actualizando ? "animate-spin" : ""}
            />
            {actualizando ? "Actualizando..." : "Actualizar"}
          </button>
        </div>

        <section className="mb-8 rounded-3xl border border-[#4adea8]/20 bg-gradient-to-r from-[#1a2b24] to-[#163129] p-6 md:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#4adea8]">
                Organización semanal
              </p>

              <h1 className="mt-2 text-3xl font-bold md:text-4xl">
                Mi agenda
              </h1>

              <p className="mt-2 max-w-3xl leading-relaxed text-gray-300">
                Visualizá todas tus clases de la semana, horarios,
                ocupación y responsabilidades en un solo lugar.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Resumen titulo="Clases" valor={resumen.clases} />
              <Resumen titulo="Días activos" valor={resumen.diasConClase} />
              <Resumen titulo="Como principal" valor={resumen.principales} />
              <Resumen titulo="Alumnos" valor={resumen.alumnos} />
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-4">
          <div className="grid grid-cols-2 gap-2 sm:w-fit">
            <button
              type="button"
              onClick={() => setVista("semana")}
              className={`flex h-11 items-center justify-center gap-2 rounded-xl px-4 font-semibold transition-all ${
                vista === "semana"
                  ? "bg-[#4adea8] text-[#12201b]"
                  : "border border-[#2d463b] bg-[#12201b] text-gray-300"
              }`}
            >
              <CalendarMonthOutlinedIcon fontSize="small" />
              Semana
            </button>

            <button
              type="button"
              onClick={() => setVista("lista")}
              className={`flex h-11 items-center justify-center gap-2 rounded-xl px-4 font-semibold transition-all ${
                vista === "lista"
                  ? "bg-[#4adea8] text-[#12201b]"
                  : "border border-[#2d463b] bg-[#12201b] text-gray-300"
              }`}
            >
              <ViewAgendaOutlinedIcon fontSize="small" />
              Lista
            </button>
          </div>
        </section>

        {clases.length === 0 ? (
          <section className="rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-10 text-center">
            <CalendarMonthOutlinedIcon
              sx={{ color: "#4adea8", fontSize: 42 }}
            />

            <h2 className="mt-4 text-2xl font-bold">
              No tenés clases asignadas
            </h2>

            <p className="mt-2 text-gray-400">
              Cuando te asignes a una clase aparecerá en esta agenda.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/entrenador/clases-disponibles")
              }
              className="mt-6 rounded-xl bg-[#4adea8] px-5 py-3 font-bold text-[#12201b]"
            >
              Ver clases disponibles
            </button>
          </section>
        ) : vista === "semana" ? (
          <VistaSemanal
            clasesPorDia={clasesPorDia}
            onVer={(id) =>
              navigate(`/entrenador/clases/${id}`)
            }
            onAsistencia={(id) =>
              navigate(`/entrenador/clases/${id}/asistencia`)
            }
          />
        ) : (
          <VistaLista
            clases={clasesOrdenadas}
            onVer={(id) =>
              navigate(`/entrenador/clases/${id}`)
            }
            onAsistencia={(id) =>
              navigate(`/entrenador/clases/${id}/asistencia`)
            }
          />
        )}
      </main>
    </div>
  );
}

function VistaSemanal({
  clasesPorDia,
  onVer,
  onAsistencia,
}: {
  clasesPorDia: Map<string, ClaseAsignadaEntrenador[]>;
  onVer: (id: number) => void;
  onAsistencia: (id: number) => void;
}) {
  const [diasExpandidos, setDiasExpandidos] = useState<string[]>([]);

  const alternarDia = (dia: string) => {
    setDiasExpandidos((actuales) =>
      actuales.includes(dia)
        ? actuales.filter((item) => item !== dia)
        : [...actuales, dia],
    );
  };

  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {DIAS.map((dia) => {
        const clasesDia = clasesPorDia.get(dia) ?? [];
        const estaExpandido = diasExpandidos.includes(dia);

        const clasesVisibles = estaExpandido
          ? clasesDia
          : clasesDia.slice(0, 4);

        const cantidadOcultas = Math.max(
          clasesDia.length - clasesVisibles.length,
          0,
        );

        return (
          <article
            key={dia}
            className="self-start rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#4adea8]">
                  Día
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  {dia}
                </h2>
              </div>

              <span className="rounded-full border border-[#4adea8]/30 bg-[#4adea8]/10 px-3 py-1 text-xs font-bold text-[#4adea8]">
                {clasesDia.length}
              </span>
            </div>

            {clasesDia.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-[#2d463b] bg-[#12201b] p-6 text-center text-sm text-gray-500">
                Sin clases
              </div>
            ) : (
              <>
                <div className="mt-4 space-y-2">
                  {clasesVisibles.map((clase) => (
                    <ClaseAgendaCard
                      key={clase.claseId}
                      clase={clase}
                      onVer={onVer}
                      onAsistencia={onAsistencia}
                    />
                  ))}
                </div>

                {clasesDia.length > 4 && (
                  <button
                    type="button"
                    onClick={() => alternarDia(dia)}
                    className="
                      mt-3
                      flex
                      w-full
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-[#2d463b]
                      bg-[#12201b]
                      px-4
                      py-2.5
                      text-sm
                      font-semibold
                      text-[#4adea8]
                      transition-all
                      hover:border-[#4adea8]
                    "
                  >
                    {estaExpandido
                      ? "Ver menos"
                      : `Ver ${cantidadOcultas} más`}
                  </button>
                )}
              </>
            )}
          </article>
        );
      })}
    </section>
  );
}

function ClaseAgendaCard({
  clase,
  onVer,
  onAsistencia,
}: {
  clase: ClaseAsignadaEntrenador;
  onVer: (id: number) => void;
  onAsistencia: (id: number) => void;
}) {
  return (
    <article
      className="
        rounded-xl
        border
        border-[#2d463b]
        bg-[#12201b]
        p-3
        transition-all
        hover:border-[#4adea8]/40
      "
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold">
            {clase.grupo}
          </h3>

          <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
            <AccessTimeOutlinedIcon
              sx={{
                color: "#4adea8",
                fontSize: 15,
              }}
            />

            {hora(clase.horaInicio)} - {hora(clase.horaFin)}
          </p>
        </div>

        {clase.esPrincipal && (
          <span
            title="Entrenador principal"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10"
          >
            <StarOutlineOutlinedIcon
              sx={{
                color: "#fbbf24",
                fontSize: 16,
              }}
            />
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
        <PeopleOutlineOutlinedIcon
          sx={{
            color: "#4adea8",
            fontSize: 15,
          }}
        />

        <span>
          {clase.cantidadAlumnos}/{clase.cupoMaximo} alumnos
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onVer(clase.claseId)}
          className="
            flex
            h-8
            items-center
            justify-center
            gap-1.5
            rounded-lg
            border
            border-[#2d463b]
            text-[11px]
            font-semibold
            transition-all
            hover:border-[#4adea8]
            hover:text-[#4adea8]
          "
        >
          <VisibilityOutlinedIcon sx={{ fontSize: 15 }} />
          Ver
        </button>

        <button
          type="button"
          onClick={() => onAsistencia(clase.claseId)}
          className="
            flex
            h-8
            items-center
            justify-center
            gap-1.5
            rounded-lg
            bg-[#4adea8]
            px-2
            text-[11px]
            font-bold
            text-[#12201b]
            transition-all
            hover:brightness-110
          "
        >
          <FactCheckOutlinedIcon sx={{ fontSize: 15 }} />
          Asistencia
        </button>
      </div>
    </article>
  );
}

function VistaLista({
  clases,
  onVer,
  onAsistencia,
}: {
  clases: ClaseAsignadaEntrenador[];
  onVer: (id: number) => void;
  onAsistencia: (id: number) => void;
}) {
  return (
    <section className="space-y-4">
      {clases.map((clase) => (
        <article
          key={clase.claseId}
          className="flex flex-col gap-5 rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-5 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[#4adea8]/30 bg-[#4adea8]/10 px-3 py-1 text-[11px] font-bold text-[#4adea8]">
                {clase.diaSemana}
              </span>

              {clase.esPrincipal && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-bold text-amber-300">
                  <StarOutlineOutlinedIcon sx={{ fontSize: 15 }} />
                  Principal
                </span>
              )}
            </div>

            <h2 className="mt-3 text-2xl font-bold">
              {clase.grupo}
            </h2>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-300">
              <span className="inline-flex items-center gap-2">
                <AccessTimeOutlinedIcon
                  sx={{ color: "#4adea8", fontSize: 18 }}
                />
                {hora(clase.horaInicio)} - {hora(clase.horaFin)}
              </span>

              <span className="inline-flex items-center gap-2">
                <PeopleOutlineOutlinedIcon
                  sx={{ color: "#4adea8", fontSize: 18 }}
                />
                {clase.cantidadAlumnos}/{clase.cupoMaximo} alumnos
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:w-auto">
            <button
              type="button"
              onClick={() => onVer(clase.claseId)}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#2d463b] bg-[#12201b] px-4 font-semibold hover:border-[#4adea8]"
            >
              <VisibilityOutlinedIcon fontSize="small" />
              Ver clase
            </button>

            <button
              type="button"
              onClick={() => onAsistencia(clase.claseId)}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#4adea8] px-4 font-bold text-[#12201b]"
            >
              <FactCheckOutlinedIcon fontSize="small" />
              Asistencia
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}


function Resumen({
  titulo,
  valor,
}: {
  titulo: string;
  valor: number;
}) {
  return (
    <div className="rounded-2xl border border-[#2d463b] bg-[#12201b]/80 p-4">
      <p className="text-2xl font-bold">
        {valor}
      </p>

      <p className="mt-1 text-xs text-gray-400">
        {titulo}
      </p>
    </div>
  );
}

function normalizarDia(dia: string) {
  const mapa: Record<string, string> = {
    Lunes: "Lunes",
    Martes: "Martes",
    Miércoles: "Miércoles",
    Miercoles: "Miércoles",
    Jueves: "Jueves",
    Viernes: "Viernes",
    Sábado: "Sábado",
    Sabado: "Sábado",
    Domingo: "Domingo",
  };

  return mapa[dia] ?? dia;
}

function hora(value: string) {
  return value?.substring(0, 5) ?? "--:--";
}
