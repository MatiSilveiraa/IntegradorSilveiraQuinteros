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
         * Usamos el mismo valor de recaudado
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
   * Solamente contamos las situaciones
   * que requieren atención del administrador.
   */

  const totalAlertas =
    cuotasVencidas +
    premiosFisicosPendientes +
    reactivacionesPendientes +
    alertaSeguridad;

  const hayAlertas = totalAlertas > 0;

  /*
   * RETURN
   */

  return (
    <div
      className="
        min-h-screen
        w-full
        max-w-full
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
          px-3
          sm:px-6
          pt-24
          pb-10
          overflow-x-hidden
        "
      >
        {/* HERO */}

        <div className="w-full min-w-0 overflow-hidden">
          <DashboardHero />
        </div>

        {/* ALERTAS */}

        <section
          className="
            mt-7
            mb-8
            w-full
            min-w-0
          "
        >
          {/* TÍTULO */}

          <div className="mb-4">
            <p
              className={`
                text-xs
                sm:text-sm
                font-bold
                uppercase
                tracking-wide

                ${
                  hayAlertas
                    ? "text-yellow-400"
                    : "text-[#4adea8]"
                }
              `}
            >
              Alertas
            </p>

            <h2
              className="
                mt-1
                text-xl
                sm:text-2xl
                font-bold
              "
            >
              Tareas pendientes
            </h2>

            <p
              className="
                mt-1
                text-xs
                sm:text-sm
                text-gray-400
              "
            >
              Revisá las situaciones que requieren tu atención.
            </p>
          </div>

          {/* DESPLEGABLE */}

          <button
            type="button"
            onClick={() =>
              setMostrarTareas(
                (estadoActual) => !estadoActual,
              )
            }
            className={`
              w-full
              min-w-0
              rounded-2xl
              border
              px-4
              py-4
              sm:px-5
              text-left
              transition-all
              duration-300

              ${
                hayAlertas
                  ? `
                    border-yellow-500/50
                    bg-yellow-500/10
                    hover:bg-yellow-500/15
                  `
                  : `
                    border-[#4adea8]/30
                    bg-[#4adea8]/5
                    hover:bg-[#4adea8]/10
                  `
              }
            `}
          >
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
                  w-11
                  h-11
                  sm:w-12
                  sm:h-12
                  shrink-0
                  rounded-xl
                  flex
                  items-center
                  justify-center

                  ${
                    hayAlertas
                      ? "bg-yellow-500/15 text-yellow-300"
                      : "bg-[#4adea8]/10 text-[#4adea8]"
                  }
                `}
              >
                {hayAlertas ? (
                  <WarningAmberOutlinedIcon />
                ) : (
                  <CheckCircleOutlineOutlinedIcon />
                )}
              </div>

              {/* TEXTO */}

              <div className="flex-1 min-w-0">
                <p
                  className={`
                    text-sm
                    sm:text-base
                    font-bold

                    ${
                      hayAlertas
                        ? "text-yellow-300"
                        : "text-[#4adea8]"
                    }
                  `}
                >
                  {hayAlertas
                    ? `${totalAlertas} ${
                        totalAlertas === 1
                          ? "tarea pendiente"
                          : "tareas pendientes"
                      }`
                    : "Todo al día"}
                </p>

                <p
                  className="
                    mt-0.5
                    text-xs
                    sm:text-sm
                    text-gray-400
                  "
                >
                  {hayAlertas
                    ? "Tocá para revisar las alertas."
                    : "No hay tareas que requieran atención."}
                </p>
              </div>

              {/* FLECHA */}

              <div
                className={`
                  w-9
                  h-9
                  shrink-0
                  rounded-xl
                  border
                  flex
                  items-center
                  justify-center
                  transition-transform
                  duration-300

                  ${
                    hayAlertas
                      ? `
                        border-yellow-500/40
                        text-yellow-300
                      `
                      : `
                        border-[#4adea8]/30
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

          {/* CONTENIDO DESPLEGADO */}

          {mostrarTareas && (
            <div
              className="
                mt-3
                w-full
                min-w-0
              "
            >
              <DashboardSystemStatus
                dashboard={dashboard}
                twoFactorEnabled={
                  perfil.twoFactorEnabled ?? false
                }
              />
            </div>
          )}
        </section>

        {/* RESUMEN */}

        <section
          className="
            mb-8
            w-full
            min-w-0
          "
        >
          <div className="mb-4">
            <p
              className="
                text-xs
                sm:text-sm
                font-bold
                uppercase
                tracking-wide
                text-[#4adea8]
              "
            >
              Resumen
            </p>

            <h2
              className="
                mt-1
                text-xl
                sm:text-2xl
                font-bold
              "
            >
              Estado general
            </h2>

            <p
              className="
                mt-1
                text-xs
                sm:text-sm
                text-gray-400
              "
            >
              Una vista rápida de la actividad del sistema.
            </p>
          </div>

          <div className="w-full min-w-0">
            <DashboardStats
              dashboard={dashboard}
              recaudadoMes={recaudadoMes}
            />
          </div>
        </section>

        {/* ACCIONES RÁPIDAS */}

        <section
          className="
            w-full
            min-w-0
          "
        >
          <DashboardQuickActions />
        </section>
      </main>
    </div>
  );
}