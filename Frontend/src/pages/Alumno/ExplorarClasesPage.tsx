import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import AlumnoLayout from "../../components/layout/DashboardLayout";
import FullScreenLoading from "../../components/FullScreenSpinner";
import GrupoCard from "../../components/grupos/GrupoCard";

import { obtenerMiPerfil } from "../../services/Perfil.service";
import { obtenerGrupos } from "../../services/Grupo.Service";

import { obtenerDias, obtenerHora } from "../../utils/grupoUtils";

import type { Grupo, Perfil } from "../../types";

const GRUPOS_POR_PAGINA = 6;

export default function ExplorarClasesPage() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [grupos, setGrupos] = useState<Grupo[]>([]);

  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      const [perfilData, gruposData] = await Promise.all([
        obtenerMiPerfil(),
        obtenerGrupos(),
      ]);

      setPerfil(perfilData);
      setGrupos((gruposData ?? []) as Grupo[]);
    } catch (error) {
      console.error(error);
      toast.error("No fue posible cargar las clases disponibles");
    } finally {
      setLoading(false);
    }
  };

  const gruposFiltrados = useMemo(() => {
    const termino = normalizarTexto(busqueda);

    if (!termino) {
      return grupos;
    }

    return grupos.filter((grupo) => {
      const nombre = normalizarTexto(grupo.nombre);
      const nivel = normalizarTexto(grupo.nivel);

      const informacionClases = (grupo.clases ?? [])
        .map((clase) =>
          [
            clase.diaSemana,
            clase.horaInicio,
            clase.horaFin,
            clase.estado,
          ]
            .filter(Boolean)
            .join(" "),
        )
        .join(" ");

      return (
        nombre.includes(termino) ||
        nivel.includes(termino) ||
        normalizarTexto(informacionClases).includes(termino)
      );
    });
  }, [grupos, busqueda]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(gruposFiltrados.length / GRUPOS_POR_PAGINA),
  );

  const gruposPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * GRUPOS_POR_PAGINA;
    const fin = inicio + GRUPOS_POR_PAGINA;

    return gruposFiltrados.slice(inicio, fin);
  }, [gruposFiltrados, paginaActual]);

  useEffect(() => {
    if (paginaActual > totalPaginas) {
      setPaginaActual(totalPaginas);
    }
  }, [paginaActual, totalPaginas]);

  const handleBusquedaChange = (
    evento: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setBusqueda(evento.target.value);
    setPaginaActual(1);
  };

  if (loading) {
    return <FullScreenLoading />;
  }

  return (
    <AlumnoLayout nombre={perfil?.nombre}>
      <main className="mx-auto max-w-7xl">
        <section className="mb-8 rounded-3xl border border-[#4adea8]/20 bg-gradient-to-r from-[#1a2b24] to-[#163129] p-6 md:p-8">
          <span className="inline-flex rounded-full bg-[#4adea8] px-3 py-1 text-xs font-bold text-[#12201b]">
            EXPLORAR
          </span>

          <h1 className="mt-4 text-3xl font-bold md:text-4xl">
            Explorar clases
          </h1>

          <p className="mt-2 max-w-2xl text-gray-300">
            Encontrá grupos, revisá sus horarios y elegí el entrenamiento que
            mejor se adapte a tu semana.
          </p>
        </section>

        {perfil?.bloqueadoPorInasistencias && (
          <section className="mb-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
            <h2 className="font-bold text-red-400">
              No podés realizar nuevas inscripciones
            </h2>

            <p className="mt-2 text-gray-300">
              Tu cuenta está bloqueada por inasistencias. Podés consultar los
              grupos, pero no inscribirte hasta que tu solicitud de reactivación
              sea aprobada.
            </p>
          </section>
        )}

        <section className="mb-8 rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-5 md:p-6">
          <label
            htmlFor="buscar-grupos"
            className="mb-2 block text-sm font-semibold text-gray-300"
          >
            Buscar entrenamientos
          </label>

          <div className="relative">
            <SearchRoundedIcon
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              id="buscar-grupos"
              type="text"
              value={busqueda}
              onChange={handleBusquedaChange}
              placeholder="Buscar por nombre, nivel, día u horario"
              className="
                w-full
                rounded-2xl
                border
                border-[#2d463b]
                bg-[#12201b]
                py-4
                pl-12
                pr-4
                text-white
                outline-none
                transition-all
                placeholder:text-gray-600
                focus:border-[#4adea8]
              "
            />
          </div>
        </section>

        <section id="grupos-disponibles" className="scroll-mt-6">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-[#4adea8]">
                Entrenamientos disponibles
              </p>

              <h2 className="mt-2 text-3xl font-bold">Grupos</h2>

              <p className="mt-1 text-gray-400">
                Ingresá a un grupo para ver sus clases y cupos.
              </p>
            </div>

            <span className="text-sm text-gray-400">
              {gruposFiltrados.length}{" "}
              {gruposFiltrados.length === 1
                ? "grupo encontrado"
                : "grupos encontrados"}
            </span>
          </div>

          {gruposFiltrados.length === 0 ? (
            <div className="rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-10 text-center">
              <GroupsRoundedIcon
                sx={{ color: "#4adea8", fontSize: 48 }}
              />

              <h3 className="mt-4 text-xl font-bold">
                No encontramos resultados
              </h3>

              <p className="mt-2 text-gray-400">
                Probá con otro nombre, nivel, día u horario.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {gruposPaginados.map((grupo) => (
                  <GrupoCard
                    key={grupo.id}
                    id={grupo.id}
                    nombre={grupo.nombre}
                   horario={`${obtenerDias(
  grupo.clases ?? [],
)} — ${obtenerHora(grupo.clases ?? [])}`}
                    nivel={grupo.nivel}
                    cantidadClases={grupo.clases?.length || 0}
                  />
                ))}
              </div>

              <Paginacion
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                onCambiarPagina={(pagina) => {
                  setPaginaActual(pagina);

                  document
                    .getElementById("grupos-disponibles")
                    ?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                }}
              />
            </>
          )}
        </section>
      </main>
    </AlumnoLayout>
  );
}

function Paginacion({
  paginaActual,
  totalPaginas,
  onCambiarPagina,
}: {
  paginaActual: number;
  totalPaginas: number;
  onCambiarPagina: (pagina: number) => void;
}) {
  if (totalPaginas <= 1) {
    return null;
  }

  return (
    <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        disabled={paginaActual === 1}
        onClick={() => onCambiarPagina(paginaActual - 1)}
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#2d463b] bg-[#1a2b24] transition-all hover:border-[#4adea8] hover:text-[#4adea8] disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Página anterior"
      >
        <ChevronLeftRoundedIcon />
      </button>

      {Array.from({ length: totalPaginas }, (_, index) => index + 1).map(
        (pagina) => (
          <button
            key={pagina}
            type="button"
            onClick={() => onCambiarPagina(pagina)}
            className={`
              flex
              h-11
              min-w-11
              items-center
              justify-center
              rounded-xl
              border
              px-3
              font-bold
              transition-all
              ${
                paginaActual === pagina
                  ? "border-[#4adea8] bg-[#4adea8] text-[#12201b]"
                  : "border-[#2d463b] bg-[#1a2b24] text-gray-300 hover:border-[#4adea8] hover:text-[#4adea8]"
              }
            `}
          >
            {pagina}
          </button>
        ),
      )}

      <button
        type="button"
        disabled={paginaActual === totalPaginas}
        onClick={() => onCambiarPagina(paginaActual + 1)}
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#2d463b] bg-[#1a2b24] transition-all hover:border-[#4adea8] hover:text-[#4adea8] disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Página siguiente"
      >
        <ChevronRightRoundedIcon />
      </button>
    </div>
  );
}

function normalizarTexto(texto?: string) {
  return (texto ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}