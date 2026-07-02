import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

import TopBar from "../../components/navigation/DashboardTopBar";
import FullScreenLoading from "../../components/FullScreenSpinner";

import { obtenerMiPerfil } from "../../services/Perfil.service";
import { obtenerMisGrupos } from "../../services/Entrenador.Service";

import GrupoCard from "../../components/entrenador/grupos/GrupoCard";
import GrupoEmpty from "../../components/entrenador/grupos/GrupoEmpty";

import type { Perfil } from "../../types";
import type { GrupoEntrenador } from "../../types/grupoEntrenador";

export default function EntrenadorGruposPage() {
  const [loading, setLoading] = useState(true);

  const [perfil, setPerfil] = useState<Perfil | null>(null);

  const [grupos, setGrupos] = useState<GrupoEntrenador[]>([]);

  const [busqueda, setBusqueda] = useState("");

  const [filtroEstado, setFiltroEstado] = useState("Todos");

  useEffect(() => {
    const cargar = async () => {
      try {
        const [perfilData, gruposData] = await Promise.all([
          obtenerMiPerfil(),
          obtenerMisGrupos(),
        ]);

        setPerfil(perfilData);
        setGrupos(gruposData);
      } catch (error) {
        console.error(error);

        toast.error("No fue posible cargar los grupos.");
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  if (loading) {
    return <FullScreenLoading />;
  }

  const gruposFiltrados = grupos.filter((grupo) => {
    const coincideBusqueda = grupo.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    const coincideEstado =
      filtroEstado === "Todos" ||
      grupo.estado.toUpperCase() === filtroEstado.toUpperCase();

    return coincideBusqueda && coincideEstado;
  });

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      <TopBar nombre={perfil?.nombre} />

      <main
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          pt-24
          pb-10
        "
      >
        {/* HEADER */}

        <div
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-6
            mb-8
          "
        >
          <div
            className="
              flex
              items-center
              gap-4
            "
          >
            <div
              className="
                w-16
                h-16
                rounded-2xl
                bg-[#1c2c26]
                border
                border-[#2d463b]
                flex
                items-center
                justify-center
                shrink-0
              "
            >
              <GroupsOutlinedIcon
                sx={{
                  fontSize: 36,
                  color: "#4adea8",
                }}
              />
            </div>

            <div>
              <h1
                className="
                  text-3xl
                  sm:text-4xl
                  font-bold
                "
              >
                Mis grupos
              </h1>

              <p className="text-gray-400 mt-1">
                Gestiona todos los grupos asignados.
              </p>
            </div>
          </div>

          <div
            className="
              w-full
              sm:w-auto
              bg-[#1c2c26]
              border
              border-[#2d463b]
              rounded-2xl
              px-8
              py-5
              text-center
            "
          >
            <p className="text-sm text-gray-400">Total de grupos</p>

            <p
              className="
                text-4xl
                font-bold
                text-[#4adea8]
              "
            >
              {gruposFiltrados.length}
            </p>
          </div>
        </div>

        {/* BUSCADOR + FILTROS */}

        <div
          className="
            bg-[#1c2c26]
            border
            border-[#2d463b]
            rounded-3xl
            p-5
            mb-8
          "
        >
          <div
            className="
              flex
              flex-col
              lg:flex-row
              gap-5
              lg:items-center
              lg:justify-between
            "
          >
            {/* BUSCADOR */}

            <div
              className="
                relative
                w-full
                lg:max-w-md
              "
            >
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
                placeholder="Buscar grupo..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="
                  w-full
                  rounded-2xl
                  bg-[#12201b]
                  border
                  border-[#2d463b]
                  py-3
                  pl-12
                  pr-12
                  outline-none
                  transition
                  focus:border-[#4adea8]
                "
              />

              {busqueda && (
                <button
                  onClick={() => setBusqueda("")}
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                  "
                >
                  <ClearOutlinedIcon
                    sx={{
                      color: "#9ca3af",
                    }}
                  />
                </button>
              )}
            </div>

            {/* FILTROS */}

            <div
              className="
                flex
                flex-wrap
                gap-3
              "
            >
              {[
                {
                  texto: "Todos",
                  valor: "Todos",
                },
                {
                  texto: "Activos",
                  valor: "ACTIVO",
                },
                {
                  texto: "Suspendidos",
                  valor: "SUSPENDIDO",
                },
              ].map((estado) => (
                <button
                  key={estado.valor}
                  onClick={() => setFiltroEstado(estado.valor)}
                  className={`
      px-5
      py-2
      rounded-full
      border
      transition-all

      ${
        filtroEstado === estado.valor
          ? "bg-[#4adea8] text-[#12201b] border-[#4adea8]"
          : "bg-[#12201b] border-[#2d463b] hover:border-[#4adea8]"
      }
    `}
                >
                  {estado.texto}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* LISTADO */}

        {gruposFiltrados.length === 0 ? (
          <GrupoEmpty />
        ) : (
          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3
              2xl:grid-cols-4
              gap-6
            "
          >
            {gruposFiltrados.map((grupo) => (
              <GrupoCard key={grupo.id} grupo={grupo} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
