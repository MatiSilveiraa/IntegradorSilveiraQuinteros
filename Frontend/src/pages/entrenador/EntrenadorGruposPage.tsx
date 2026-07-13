import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";

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
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [grupos, setGrupos] = useState<GrupoEntrenador[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] =
    useState<FiltroEstado>("Todos");

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);

        const [perfilData, gruposData] = await Promise.all([
          obtenerMiPerfil(),
          obtenerMisGrupos(),
        ]);

        setPerfil(perfilData);
        setGrupos(gruposData ?? []);
      } catch (error: any) {
        if (!error?.response || error.response.status >= 500) {
          console.error("[Cargar grupos entrenador]", error);
        }

        toast.error(
          error?.response?.data?.mensaje ??
            "No fue posible cargar los grupos.",
        );
      } finally {
        setLoading(false);
      }
    };

    void cargar();
  }, []);

  const gruposFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return grupos.filter((grupo) => {
      const coincideBusqueda =
        !termino ||
        grupo.nombre.toLowerCase().includes(termino) ||
        grupo.nivel.toLowerCase().includes(termino) ||
        grupo.proximoDia?.toLowerCase().includes(termino);

      const coincideEstado =
        filtroEstado === "Todos" ||
        grupo.estado.toUpperCase() === filtroEstado;

      return coincideBusqueda && coincideEstado;
    });
  }, [grupos, busqueda, filtroEstado]);

  const resumen = useMemo(
    () => ({
      grupos: grupos.length,
      alumnos: grupos.reduce(
        (total, grupo) => total + grupo.cantidadAlumnos,
        0,
      ),
      clases: grupos.reduce(
        (total, grupo) => total + grupo.cantidadClases,
        0,
      ),
    }),
    [grupos],
  );

  if (loading) {
    return <FullScreenLoading />;
  }

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      <TopBar nombre={perfil?.nombre} />

      <main className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      
        <section className="rounded-3xl border border-[#4adea8]/20 bg-gradient-to-r from-[#1a2b24] to-[#163129] p-6 md:p-8 mb-8">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-7">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#4adea8]/10 border border-[#4adea8]/30 flex items-center justify-center">
                <GroupsOutlinedIcon
                  sx={{ fontSize: 32, color: "#4adea8" }}
                />
              </div>

              <div>
                <p className="text-[#4adea8] text-xs font-bold uppercase tracking-wide">
                  Gestión del entrenador
                </p>

                <h1 className="text-3xl md:text-4xl font-bold mt-2">
                  Mis grupos
                </h1>

                <p className="text-gray-300 mt-2 max-w-2xl">
                  Grupos asignados en los que tenés clases a cargo.
                  Consultá sus alumnos, horarios y próximas clases.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full xl:w-auto">
              <ResumenHero
                titulo="Grupos"
                valor={resumen.grupos}
                icono={<GroupsOutlinedIcon />}
              />

              <ResumenHero
                titulo="Alumnos"
                valor={resumen.alumnos}
                icono={<PeopleOutlineOutlinedIcon />}
              />

              <ResumenHero
                titulo="Clases"
                valor={resumen.clases}
                icono={<CalendarMonthOutlinedIcon />}
              />
            </div>
          </div>
        </section>

        <section className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-4 sm:p-5 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-lg">
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
                type="text"
                placeholder="Buscar por nombre, nivel o día..."
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                className="w-full h-12 rounded-2xl bg-[#12201b] border border-[#2d463b] pl-12 pr-12 outline-none focus:border-[#4adea8] focus:ring-2 focus:ring-[#4adea8]/10 transition-all"
              />

              {busqueda && (
                <button
                  type="button"
                  onClick={() => setBusqueda("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  aria-label="Limpiar búsqueda"
                >
                  <ClearOutlinedIcon fontSize="small" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 w-full lg:w-auto">
              {[
                { texto: "Todos", valor: "Todos" as const },
                { texto: "Activos", valor: "ACTIVO" as const },
                { texto: "Suspendidos", valor: "SUSPENDIDO" as const },
              ].map((estado) => (
                <button
                  key={estado.valor}
                  type="button"
                  onClick={() => setFiltroEstado(estado.valor)}
                  className={`h-11 px-4 rounded-xl border text-sm font-semibold transition-all ${
                    filtroEstado === estado.valor
                      ? "bg-[#4adea8] text-[#12201b] border-[#4adea8]"
                      : "bg-[#12201b] border-[#2d463b] text-gray-300 hover:border-[#4adea8]"
                  }`}
                >
                  {estado.texto}
                </button>
              ))}
            </div>
          </div>
        </section>

        {grupos.length === 0 ? (
          <GrupoEmpty tipo="sin-grupos" />
        ) : gruposFiltrados.length === 0 ? (
          <GrupoEmpty
            tipo="sin-resultados"
            onLimpiar={() => {
              setBusqueda("");
              setFiltroEstado("Todos");
            }}
          />
        ) : (
          <section>
            <div className="mb-5">
              <p className="text-[#4adea8] text-xs font-bold uppercase tracking-wide">
                Resultados
              </p>

              <h2 className="text-2xl font-bold mt-1">
                {gruposFiltrados.length}{" "}
                {gruposFiltrados.length === 1
                  ? "grupo encontrado"
                  : "grupos encontrados"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {gruposFiltrados.map((grupo) => (
                <GrupoCard key={grupo.id} grupo={grupo} />
              ))}
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
    <div className="min-w-0 rounded-2xl bg-[#12201b]/80 border border-[#2d463b] p-4">
      <div className="text-[#4adea8]">{icono}</div>
      <p className="text-2xl font-bold mt-3">{valor}</p>
      <p className="text-xs text-gray-400 mt-1">{titulo}</p>
    </div>
  );
}
