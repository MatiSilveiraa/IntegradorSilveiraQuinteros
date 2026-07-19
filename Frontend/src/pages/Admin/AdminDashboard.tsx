import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

import { obtenerDashboardAdmin } from "../../services/Admin.Service";
import { obtenerMiPerfil } from "../../services/Perfil.service";
import { obtenerResumenCuotasAdmin } from "../../services/AdminCuota.Service";

import TopBar from "../../components/navigation/DashboardTopBar";
import FullScreenLoading from "../../components/FullScreenSpinner";

import DashboardHero from "../../components/admin/DashboardHero";
import DashboardStats from "../../components/admin/DashboardStats";
import DashboardSystemStatus from "../../components/admin/DashboardSystemStatus";
import DashboardQuickActions from "../../components/admin/DashboardQuickActions";

import type { Perfil } from "../../types";

export default function AdminDashboard() {
  /*
   * ESTADOS
   */

  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] = useState<any>(null);

  const [perfil, setPerfil] = useState<Perfil | null>(null);

  const [mostrarTareas, setMostrarTareas] = useState(false);

  const [recaudadoMes, setRecaudadoMes] = useState(0);

  /*
   * CARGAR DATOS
   */

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);

        const hoy = new Date();

        const [dashboardData, perfilData, resumenCuotasData] =
          await Promise.all([
            obtenerDashboardAdmin(),

            obtenerMiPerfil(),

            obtenerResumenCuotasAdmin({
              mes: hoy.getMonth() + 1,
              anio: hoy.getFullYear(),
            }),
          ]);

        setDashboard(dashboardData);

        setPerfil(perfilData);

        /*
         * Usamos exactamente el mismo "Recaudado"
         * que se muestra en Finanzas y Cuotas.
         */

        setRecaudadoMes(
          resumenCuotasData.recaudado ?? 0,
        );
      } catch (error) {
        console.error(error);

        toast.error(
          "No fue posible cargar el dashboard",
        );
      } finally {
        setLoading(false);
      }
    };

    void cargarDatos();
  }, []);

  /*
   * LOADING
   */

  if (loading) {
    return <FullScreenLoading />;
  }

  if (!dashboard || !perfil) {
    return <FullScreenLoading />;
  }

  /*
   * ALERTAS
   */

  const cuotasVencidas =
    dashboard.cuotasVencidas ?? 0;

  const premiosFisicosPendientes =
    dashboard.premiosFisicosPendientes ?? 0;

  const reactivacionesPendientes =
    dashboard.reactivacionesPendientes ?? 0;

  const alertaSeguridad =
    !perfil.twoFactorEnabled ? 1 : 0;

  /*
   * Sumamos solamente las tareas
   * que realmente requieren acción.
   */

  const totalAlertas =
    cuotasVencidas +
    premiosFisicosPendientes +
    reactivacionesPendientes +
    alertaSeguridad;

  const hayAlertas = totalAlertas > 0;

  return (
    <div
      className="
        min-h-screen
        w-full
        overflow-x-hidden
        bg-[#12201b]
        text-white
      "
    >
      <TopBar nombre={perfil.nombre} />

      <main
        className="
          w-full
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          pt-24
          pb-10
          overflow-x-hidden
        "
      >
        {/* ================================================== */}
        {/* HERO */}
        {/* ================================================== */}

        <DashboardHero />

        {/* ================================================== */}
        {/* ALERTAS */}
        {/* ================================================== */}

        <section className="mb-10">

          {/* CABECERA */}

          <div className="mb-4">

            <p
              className={`
                text-xs
                font-bold
                uppercase
                tracking-wider

                ${
                  hayAlertas
                    ? "text-amber-400"
                    : "text-[#4adea8]"
                }
              `}
            >
              Alertas
            </p>

            <h2 className="mt-1 text-xl font-bold">
              Tareas pendientes
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Revisá las situaciones que requieren tu atención.
            </p>

          </div>

          {/* BOTÓN DESPLEGABLE */}

          <button
            type="button"
            onClick={() =>
              setMostrarTareas(
                (valorActual) => !valorActual,
              )
            }
            className={`
              w-full
              rounded-2xl
              border
              px-4
              py-4
              text-left
              transition-all
              duration-300

              ${
                hayAlertas
                  ? `
                    border-amber-500/50
                    bg-amber-500/10
                    hover:bg-amber-500/15
                    hover:border-amber-400
                  `
                  : `
                    border-[#4adea8]/30
                    bg-[#1a211d]
                    hover:border-[#4adea8]
                  `
              }
            `}
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-4
              "
            >

              {/* IZQUIERDA */}

              <div
                className="
                  flex
                  items-center
                  gap-3
                  min-w-0
                "
              >

                {/* ICONO */}

                <div
                  className={`
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl

                    ${
                      hayAlertas
                        ? `
                          bg-amber-500/20
                          text-amber-400
                        `
                        : `
                          bg-[#4adea8]/10
                          text-[#4adea8]
                        `
                    }
                  `}
                >
                  {hayAlertas ? (
                    <WarningAmberOutlinedIcon
                      fontSize="small"
                    />
                  ) : (
                    <CheckCircleOutlineOutlinedIcon
                      fontSize="small"
                    />
                  )}
                </div>

                {/* INFORMACIÓN */}

                <div className="min-w-0">

                  <div
                    className="
                      flex
                      flex-wrap
                      items-center
                      gap-2
                    "
                  >

                    <p
                      className={`
                        font-bold

                        ${
                          hayAlertas
                            ? "text-amber-300"
                            : "text-white"
                        }
                      `}
                    >
                      {hayAlertas
                        ? `${totalAlertas} ${
                            totalAlertas === 1
                              ? "tarea pendiente"
                              : "tareas pendientes"
                          }`
                        : "Todo está al día"}
                    </p>

                  </div>

                  <p className="mt-0.5 text-xs text-gray-400">
                    {mostrarTareas
                      ? "Ocultar detalles"
                      : hayAlertas
                        ? "Tocá para revisar todas las alertas"
                        : "No hay acciones que requieran atención"}
                  </p>

                </div>

              </div>

              {/* FLECHA */}

              <div
                className={`
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  transition-all
                  duration-300

                  ${
                    hayAlertas
                      ? `
                        border-amber-500/30
                        bg-amber-500/10
                        text-amber-400
                      `
                      : `
                        border-[#2d463b]
                        bg-[#12201b]
                        text-[#4adea8]
                      `
                  }

                  ${
                    mostrarTareas
                      ? "rotate-180"
                      : ""
                  }
                `}
              >
                <KeyboardArrowDownOutlinedIcon />
              </div>

            </div>
          </button>

          {/* CONTENIDO DESPLEGABLE */}

          {mostrarTareas && (
            <div className="mt-3">
           <DashboardSystemStatus
  dashboard={dashboard}
  twoFactorEnabled={perfil.twoFactorEnabled ?? false}
/>
            </div>
          )}

        </section>

        {/* ================================================== */}
        {/* RESUMEN */}
        {/* ================================================== */}

        <section className="mb-10">

          <div className="mb-5">

            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-[#4adea8]
              "
            >
              Resumen
            </p>

            <h2 className="mt-1 text-xl font-bold">
              Estado general
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Una vista rápida de la actividad del sistema.
            </p>

          </div>

          <DashboardStats
            dashboard={dashboard}
            recaudadoMes={recaudadoMes}
          />

        </section>

        {/* ================================================== */}
        {/* ACCIONES RÁPIDAS */}
        {/* ================================================== */}

        <section>
          <DashboardQuickActions />
        </section>

      </main>
    </div>
  );
}