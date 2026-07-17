import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";

import TopBar from "../../components/navigation/DashboardTopBar";
import FullScreenLoading from "../../components/FullScreenSpinner";
import GrupoCard from "../../components/entrenador/grupos/GrupoCard";
import GrupoEmpty from "../../components/entrenador/grupos/GrupoEmpty";

import { obtenerMiPerfil } from "../../services/Perfil.service";
import { obtenerMisGrupos } from "../../services/Entrenador.Service";

import type { Perfil } from "../../types";
import type { GrupoEntrenador } from "../../types/grupoEntrenador";

type FiltroEstado = "Todos" | "ACTIVO" | "SUSPENDIDO";

export default function EntrenadorGruposPage() {
  const [loading, setLoading] = useState(true);
  const [actualizando, setActualizando] = useState(false);

  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [grupos, setGrupos] = useState<GrupoEntrenador[]>([]);

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] =
    useState<FiltroEstado>("Todos");

  const cargarDatos = async (
    mostrarCargaCompleta = true,
  ) => {
    try {
      if (mostrarCargaCompleta) {
        setLoading(true);
      } else {
        setActualizando(true);
      }

      const [perfilData, gruposData] =
        await Promise.all([
          obtenerMiPerfil(),
          obtenerMisGrupos(),
        ]);

      setPerfil(perfilData);
      setGrupos(gruposData ?? []);
    } catch (error: any) {
      if (
        !error?.response ||
        error.response.status >= 500
      ) {
        console.error(
          "[Cargar grupos entrenador]",
          error,
        );
      }

      toast.error(
        error?.response?.data?.mensaje ??
          "No fue posible cargar los grupos.",
      );
    } finally {
      setLoading(false);
      setActualizando(false);
    }
  };

  useEffect(() => {
    void cargarDatos();
  }, []);

  const gruposFiltrados = useMemo(() => {
    const termino =
      busqueda.trim().toLowerCase();

    return grupos.filter((grupo) => {
      const coincideBusqueda =
        !termino ||
        grupo.nombre
          .toLowerCase()
          .includes(termino) ||
        grupo.nivel
          .toLowerCase()
          .includes(termino) ||
        grupo.proximoDia
          ?.toLowerCase()
          .includes(termino);

      const coincideEstado =
        filtroEstado === "Todos" ||
        grupo.estado.toUpperCase() ===
          filtroEstado;

      return (
        coincideBusqueda &&
        coincideEstado
      );
    });
  }, [
    grupos,
    busqueda,
    filtroEstado,
  ]);

  const resumen = useMemo(() => {
    return {
      grupos: grupos.length,

      alumnos: grupos.reduce(
        (total, grupo) =>
          total +
          (grupo.cantidadAlumnos ?? 0),
        0,
      ),

      clases: grupos.reduce(
        (total, grupo) =>
          total +
          (grupo.cantidadClases ?? 0),
        0,
      ),

      activos: grupos.filter(
        (grupo) =>
          grupo.estado.toUpperCase() ===
          "ACTIVO",
      ).length,
    };
  }, [grupos]);

  const limpiarFiltros = () => {
    setBusqueda("");
    setFiltroEstado("Todos");
  };

  if (loading) {
    return <FullScreenLoading />;
  }

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      <TopBar nombre={perfil?.nombre} />

      <main className="mx-auto w-full max-w-[1500px] px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <button
            type="button"
            disabled={actualizando}
            onClick={() =>
              void cargarDatos(false)
            }
            className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-xl border border-[#2d463b] bg-[#1a2b24] px-4 text-sm font-semibold text-gray-300 transition-all hover:border-[#4adea8] hover:text-[#4adea8] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshOutlinedIcon
              fontSize="small"
              className={
                actualizando
                  ? "animate-spin"
                  : ""
              }
            />

            {actualizando
              ? "Actualizando..."
              : "Actualizar"}
          </button>
        </div>

        <section className="mb-8 rounded-3xl border border-[#4adea8]/20 bg-gradient-to-r from-[#1a2b24] to-[#163129] p-6 md:p-8">
          <div className="flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#4adea8]/30 bg-[#4adea8]/10">
                <GroupsOutlinedIcon
                  sx={{
                    fontSize: 32,
                    color: "#4adea8",
                  }}
                />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#4adea8]">
                  Gestión del entrenador
                </p>

                <h1 className="mt-2 text-3xl font-bold md:text-4xl">
                  Mis grupos
                </h1>

                <p className="mt-2 max-w-2xl leading-relaxed text-gray-300">
                  Grupos asignados en los que
                  tenés clases a cargo.
                  Consultá sus alumnos,
                  horarios y próximas clases.
                </p>
              </div>
            </div>

            <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4 xl:w-auto">
              <ResumenHero
                titulo="Grupos"
                valor={resumen.grupos}
                icono={
                  <GroupsOutlinedIcon />
                }
              />

              <ResumenHero
                titulo="Activos"
                valor={resumen.activos}
                icono={
                  <DashboardOutlinedIcon />
                }
              />

              <ResumenHero
                titulo="Alumnos"
                valor={resumen.alumnos}
                icono={
                  <PeopleOutlineOutlinedIcon />
                }
              />

              <ResumenHero
                titulo="Clases"
                valor={resumen.clases}
                icono={
                  <CalendarMonthOutlinedIcon />
                }
              />
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-lg">
              <SearchOutlinedIcon
                sx={{
                  color: "#9ca3af",
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform:
                    "translateY(-50%)",
                }}
              />

              <input
                type="text"
                placeholder="Buscar por nombre, nivel o día..."
                value={busqueda}
                onChange={(event) =>
                  setBusqueda(
                    event.target.value,
                  )
                }
                className="h-12 w-full rounded-2xl border border-[#2d463b] bg-[#12201b] pl-12 pr-12 outline-none transition-all focus:border-[#4adea8] focus:ring-2 focus:ring-[#4adea8]/10"
              />

              {busqueda && (
                <button
                  type="button"
                  onClick={() =>
                    setBusqueda("")
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-white"
                  aria-label="Limpiar búsqueda"
                >
                  <ClearOutlinedIcon fontSize="small" />
                </button>
              )}
            </div>

            <div className="grid w-full grid-cols-3 gap-2 lg:w-auto">
              {[
                {
                  texto: "Todos",
                  valor:
                    "Todos" as const,
                },
                {
                  texto: "Activos",
                  valor:
                    "ACTIVO" as const,
                },
                {
                  texto: "Suspendidos",
                  valor:
                    "SUSPENDIDO" as const,
                },
              ].map((estado) => (
                <button
                  key={estado.valor}
                  type="button"
                  onClick={() =>
                    setFiltroEstado(
                      estado.valor,
                    )
                  }
                  className={`h-11 rounded-xl border px-4 text-sm font-semibold transition-all ${
                    filtroEstado ===
                    estado.valor
                      ? "border-[#4adea8] bg-[#4adea8] text-[#12201b]"
                      : "border-[#2d463b] bg-[#12201b] text-gray-300 hover:border-[#4adea8]"
                  }`}
                >
                  {estado.texto}
                </button>
              ))}
            </div>
          </div>

          {(busqueda ||
            filtroEstado !==
              "Todos") && (
            <div className="mt-4 flex flex-col gap-3 border-t border-[#2d463b] pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-400">
                Mostrando{" "}
                <span className="font-semibold text-white">
                  {
                    gruposFiltrados.length
                  }
                </span>{" "}
                de{" "}
                <span className="font-semibold text-white">
                  {grupos.length}
                </span>{" "}
                grupos.
              </p>

              <button
                type="button"
                onClick={limpiarFiltros}
                className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#4adea8] hover:underline"
              >
                <ClearOutlinedIcon fontSize="small" />
                Limpiar filtros
              </button>
            </div>
          )}
        </section>

        {grupos.length === 0 ? (
          <GrupoEmpty tipo="sin-grupos" />
        ) : gruposFiltrados.length ===
          0 ? (
          <GrupoEmpty
            tipo="sin-resultados"
            onLimpiar={limpiarFiltros}
          />
        ) : (
          <section>
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-wide text-[#4adea8]">
                Resultados
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                {
                  gruposFiltrados.length
                }{" "}
                {gruposFiltrados.length ===
                1
                  ? "grupo encontrado"
                  : "grupos encontrados"}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {gruposFiltrados.map(
                (grupo) => (
                  <GrupoCard
                    key={grupo.id}
                    grupo={grupo}
                  />
                ),
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function ResumenHero({
  titulo,
  valor,
  icono,
}: {
  titulo: string;
  valor: number;
  icono: React.ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-[#2d463b] bg-[#12201b]/80 p-4">
      <div className="text-[#4adea8]">
        {icono}
      </div>

      <p className="mt-3 text-2xl font-bold">
        {valor}
      </p>

      <p className="mt-1 text-xs text-gray-400">
        {titulo}
      </p>
    </div>
  );
}