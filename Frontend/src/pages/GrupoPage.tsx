import { useEffect, useState } from "react";
import BuscadorGrupos from "../components/grupos/BuscadorGrupos";
import GrupoCard from "../components/grupos/GrupoCard";
import { obtenerMiPerfil } from "../services/Perfil.service";
import { obtenerGrupos } from "../../src/services/Grupo.Service";
import { obtenerDias, obtenerHora } from "../utils/grupoUtils";
import AlumnoLayout from "../components/layout/DashboardLayout";
import { obtenerMisClases } from "../services/Inscripciones.Service";
import { obtenerImagenGrupo } from "../utils/grupoImageUtils";
import { desinscribirseClase } from "../services/Inscripciones.Service";
import { obtenerProximaClase } from "../utils/proximaClaseUtils";
import toast from "react-hot-toast";
import FullScreenLoading from "../components/FullScreenSpinner";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import type { Perfil } from "../types";
import { useNavigate } from "react-router-dom";

export default function GruposPage() {
  const [perfil, setPerfil] = useState<Perfil | any>(null);
  const [loading, setLoading] = useState(true);
  const [grupos, setGrupos] = useState<any[]>([]);
  const [misClases, setMisClases] = useState<any[]>([]);
  const navigate = useNavigate();
  useState<any[]>([]);

  const [busqueda, setBusqueda] = useState("");

  const proximaClase = obtenerProximaClase(misClases);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [perfilData, gruposData, clasesData] = await Promise.all([
          obtenerMiPerfil(),
          obtenerGrupos(),
          obtenerMisClases(),
        ]);

        console.log("MIS CLASES", JSON.stringify(clasesData, null, 2));

        setPerfil(perfilData);
        setGrupos(gruposData);
        setMisClases(clasesData);
      } catch (error) {
        console.error(error);

        toast.error("No fue posible cargar la información");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const handleDesinscribirse = async (claseId: number) => {
    try {
      await desinscribirseClase(claseId);

      setMisClases((prev) => prev.filter((c) => c.id !== claseId));

      toast.success("Te desinscribiste correctamente");
    } catch (error) {
      console.error(error);

      toast.error("No fue posible desinscribirse");
    }
  };
  const gruposFiltrados = grupos.filter((grupo) =>
    grupo.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  );

  const obtenerNombreGrupo = (grupoId: number) => {
    return grupos.find((g) => g.id === grupoId)?.nombre || "Grupo";
  };
  if (loading) {
    return <FullScreenLoading />;
  }
  return (
    <AlumnoLayout nombre={perfil?.nombre}>
      <main className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Grupos</h1>

          <p className="text-gray-400 mt-2">
            Encuentra e inscríbete a los grupos disponibles.
          </p>
        </div>

        {/* RESUMEN */}
        <div className="grid gap-4 md:grid-cols-3 mt-6 mb-8">
          {/* CLASES ACTIVAS */}
          <button
            type="button"
            onClick={() =>
              document.getElementById("mis-clases")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
            className="
            text-left
            bg-[#1a2b24]
            border
            border-[#2d463b]
            rounded-2xl
            p-5
            cursor-pointer
            hover:border-[#4adea8]/60
            active:scale-[0.98]
            transition-all
          "
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Clases activas</p>

                <h2 className="text-3xl font-bold mt-2">{misClases.length}</h2>
              </div>

              <CalendarMonthRoundedIcon
                sx={{
                  color: "#4adea8",
                  fontSize: 34,
                }}
              />
            </div>
          </button>

          {/* RACHA ACTUAL */}
          <button
            type="button"
            onClick={() => navigate("/alumno/asistencias?tab=historial")}
            className="
            text-left
            bg-[#1a2b24]
            border
            border-[#2d463b]
            rounded-2xl
            p-5
            cursor-pointer
            hover:border-[#4adea8]/60
            active:scale-[0.98]
            transition-all
          "
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Racha actual</p>

                <h2 className="text-3xl font-bold mt-2">
                  {perfil?.rachaAsistenciaMensual ?? 0}
                </h2>
              </div>

              <LocalFireDepartmentRoundedIcon
                sx={{
                  color: "#fb923c",
                  fontSize: 34,
                }}
              />
            </div>
          </button>

          {/* GRUPOS DISPONIBLES */}
          <button
            type="button"
            onClick={() =>
              document.getElementById("grupos-disponibles")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
            className="
            text-left
            bg-[#1a2b24]
            border
            border-[#2d463b]
            rounded-2xl
            p-5
            cursor-pointer
            hover:border-[#4adea8]/60
            active:scale-[0.98]
            transition-all
          "
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm">Grupos disponibles</p>

                <h2 className="text-3xl font-bold mt-2">{grupos.length}</h2>
              </div>

              <GroupsRoundedIcon
                sx={{
                  color: "#4adea8",
                  fontSize: 34,
                }}
              />
            </div>
          </button>
        </div>

        {/* BLOQUEO POR INASISTENCIAS */}
        {perfil?.bloqueadoPorInasistencias && (
          <div
            className="
            mt-6
            bg-red-500/10
            border
            border-red-500/30
            rounded-2xl
            p-5
          "
          >
            <h3 className="text-red-400 font-bold">Cuenta bloqueada</h3>

            <p className="text-gray-300 mt-2">
              Tu cuenta se encuentra bloqueada por inasistencias. No podrás
              inscribirte a nuevas clases hasta que tu solicitud de reactivación
              sea aprobada.
            </p>
          </div>
        )}

        {/* PRÓXIMA CLASE */}
        <div
          className="
          mt-8
          rounded-3xl
          border
          border-[#4adea8]/20
          bg-gradient-to-r
          from-[#1a2b24]
          to-[#163129]
          p-6
          shadow-lg
        "
        >
          <span
            className="
            inline-block
            px-3
            py-1
            rounded-full
            bg-[#4adea8]
            text-[#12201b]
            text-xs
            font-bold
          "
          >
            PRÓXIMA CLASE
          </span>

          <h3 className="text-3xl font-bold mt-4">
            {proximaClase ? proximaClase.diaSemana : "Sin clases programadas"}
          </h3>

          <p className="text-gray-300 mt-2 text-lg">
            {proximaClase
              ? `${proximaClase.horaInicio.substring(
                  0,
                  5,
                )} - ${proximaClase.horaFin.substring(0, 5)}`
              : "No tienes clases registradas"}
          </p>

          {proximaClase && (
            <p className="text-gray-300 mt-3">
              Grupo: {obtenerNombreGrupo(proximaClase.grupoId)}
            </p>
          )}
        </div>

        {/* MIS CLASES */}
        <section id="mis-clases" className="mt-10 scroll-mt-6">
          <div className="flex items-center justify-between gap-4 mb-5">
            <h2 className="text-3xl font-bold">Mis clases</h2>

            <span className="text-gray-400 text-sm shrink-0">
              {misClases.length} clases
            </span>
          </div>

          {misClases.length === 0 ? (
            <div
              className="
              bg-[#1a2b24]
              border
              border-[#2d463b]
              rounded-2xl
              p-8
              text-center
            "
            >
              <p className="text-gray-400">
                No estás inscripto a ninguna clase.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {misClases.map((clase) => (
                <div
                  key={clase.id}
                  className="
                  bg-[#1a2b24]
                  border
                  border-[#2d463b]
                  rounded-2xl
                  overflow-hidden
                  hover:border-[#4adea8]/40
                  transition-all
                "
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* IMAGEN */}
                    <div
                      className="
                      w-full
                      h-40
                      sm:w-36
                      sm:h-auto
                      sm:min-h-[160px]
                      flex-shrink-0
                    "
                    >
                      <img
                        src={obtenerImagenGrupo(
                          obtenerNombreGrupo(clase.grupoId),
                        )}
                        alt={obtenerNombreGrupo(clase.grupoId)}
                        className="
                        w-full
                        h-full
                        object-cover
                      "
                      />
                    </div>

                    {/* CONTENIDO */}
                    <div className="flex-1 min-w-0 p-5">
                      <div
                        className="
                        flex
                        flex-col
                        gap-5
                        md:flex-row
                        md:items-center
                        md:justify-between
                      "
                      >
                        {/* INFORMACIÓN */}
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="font-bold text-xl">
                              {clase.diaSemana}
                            </h3>

                            <span
                              className="
                              inline-flex
                              items-center
                              gap-1
                              px-3
                              py-1
                              rounded-full
                              bg-[#4adea8]/10
                              text-[#4adea8]
                              text-xs
                              font-semibold
                              whitespace-nowrap
                            "
                            >
                              <CalendarMonthRoundedIcon
                                sx={{
                                  fontSize: 15,
                                }}
                              />
                              Activa
                            </span>
                          </div>

                          <p className="text-gray-300 mt-3 text-lg">
                            {clase.horaInicio.substring(0, 5)}
                            {" - "}
                            {clase.horaFin.substring(0, 5)}
                          </p>

                          <p className="text-gray-500 mt-2">
                            {obtenerNombreGrupo(clase.grupoId)}
                          </p>
                        </div>

                        {/* ACCIONES */}
                        <div
                          className="
                          flex
                          flex-col
                          gap-2
                          w-full
                          md:w-auto
                          md:items-end
                          shrink-0
                        "
                        >
                          <button
                            type="button"
                            onClick={() => handleDesinscribirse(clase.id)}
                            className="
                            w-full
                            md:w-auto
                            px-5
                            py-3
                            rounded-xl
                            bg-red-500/10
                            border
                            border-red-500/30
                            text-red-400
                            hover:bg-red-500/20
                            transition-all
                            text-sm
                            font-semibold
                            whitespace-nowrap
                          "
                          >
                            Desinscribirme
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* GRUPOS DISPONIBLES */}
        <section id="grupos-disponibles" className="mt-8 scroll-mt-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold">Grupos Disponibles</h2>

            <span className="text-gray-400 text-sm">
              {gruposFiltrados.length} grupos encontrados
            </span>
          </div>

          <div className="mb-10">
            {/* BUSCADOR */}
            <BuscadorGrupos
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {gruposFiltrados.length === 0 ? (
            <div
              className="
              bg-[#1a2b24]
              border
              border-[#2d463b]
              rounded-2xl
              p-8
              text-center
            "
            >
              <p className="text-gray-400">No se encontraron grupos.</p>
            </div>
          ) : (
            <div
              className="
              grid
              gap-6
              md:grid-cols-2
              xl:grid-cols-3
            "
            >
              {gruposFiltrados.map((grupo) => (
                <GrupoCard
                  key={grupo.id}
                  id={grupo.id}
                  nombre={grupo.nombre}
                  horario={`${obtenerDias(
                    grupo.clases,
                  )} — ${obtenerHora(grupo.clases)}`}
                  nivel={grupo.nivel}
                  cantidadClases={grupo.clases?.length ?? 0}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </AlumnoLayout>
  );
}
