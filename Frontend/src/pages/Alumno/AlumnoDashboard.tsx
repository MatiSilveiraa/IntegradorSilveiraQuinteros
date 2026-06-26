import { useEffect, useState } from "react";

import { obtenerMiPerfil } from "../../services/Perfil.service";
import { obtenerMiCuota } from "../../services/Cuota.service";
import { obtenerMiHistorial } from "../../services/Historial.service";
import { obtenerMisClases } from "../../services/Inscripciones.Service";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import ProximaClaseCard from "../../components/dashboard/ProximaClaseCard";
import CuotaCard from "../../components/dashboard/CuotaCard";
import RachaCard from "../../components/dashboard/RachaCard";
import ResumenCard from "../../components/dashboard/ResumenCard";
import NovedadesCard from "../../components/dashboard/NovedadesCard";

import { useNavigate } from "react-router-dom";

import AlumnoLayout from "../../components/layout/DashboardLayout";

import toast from "react-hot-toast";
import FullScreenLoading from "../../components/FullScreenSpinner";

import type { Perfil, Cuota, Historial, Clase } from "../../types";
import { obtenerMotivoBloqueo } from "../../utils/accountUtils";
import BlockedAccountAlert from "../../components/BlockedAccountAlert";

export default function AlumnoDashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [perfil, setPerfil] = useState<Perfil | null>(null);

  const [cuota, setCuota] = useState<Cuota | any>(null);

  const [historial, setHistorial] = useState<Historial | any>(null);

  const [misClases, setMisClases] = useState<Clase[]>([]);

  const diasSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
  ];

  const obtenerProximaClase = (clases: Clase[]) => {
    if (!clases.length) {
      return undefined;
    }

    const hoy = new Date().getDay();

    const ordenadas = [...clases].sort(
      (a, b) =>
        diasSemana.indexOf(a.diaSemana) - diasSemana.indexOf(b.diaSemana),
    );

    return (
      ordenadas.find((c) => diasSemana.indexOf(c.diaSemana) >= hoy) ||
      ordenadas[0]
    );
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [perfilData, historialData, clasesData] = await Promise.all([
          obtenerMiPerfil(),
          obtenerMiHistorial(),
          obtenerMisClases(),
        ]);
        console.log("PERFIL", perfilData);
        setPerfil(perfilData);

        setHistorial(historialData);

        setMisClases(clasesData);

        try {
          const cuotaData = await obtenerMiCuota();

          setCuota(cuotaData);
        } catch (error: any) {
          if (
            error.response?.data?.mensaje ===
            "No existe cuota generada para el mes actual"
          ) {
            setCuota({
              estado: "Sin cuota",
            });
          } else {
            toast.error("No fue posible cargar la cuota");
          }
        }
      } catch (error) {
        console.error(error);

        toast.error("No fue posible cargar el dashboard");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const proximaClase = obtenerProximaClase(misClases);

  if (loading) {
    return <FullScreenLoading />;
  }

  return (
    <AlumnoLayout nombre={perfil?.nombre}>
      <main className="max-w-7xl mx-auto">
        <DashboardHeader nombre={perfil?.nombre} />

        <BlockedAccountAlert motivo={obtenerMotivoBloqueo(perfil)} />

        {perfil && !perfil.twoFactorEnabled && (
          <div
            className="
            mb-6
            bg-amber-500/10
            border
            border-amber-500/30
            rounded-2xl
            p-5
            flex
            items-center
            justify-between
            gap-4
          "
          >
            <div>
              <h3
                className="
                text-amber-400
                font-bold
                text-lg
              "
              >
                🔐 Protegé tu cuenta
              </h3>

              <p className="text-gray-300 mt-1">
                Todavía no tenés activada la autenticación de dos factores
                (2FA).
              </p>
            </div>

            <button
              onClick={() => navigate("/alumno/seguridad")}
              className="
              px-5
              py-3
              rounded-xl
              bg-[#4adea8]
              text-[#12201b]
              font-bold
            "
            >
              Activar 2FA
            </button>
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          <ProximaClaseCard clase={proximaClase} />

          <CuotaCard cuota={cuota} />

          <RachaCard racha={perfil?.rachaAsistenciaMensual} />

          <ResumenCard historial={historial} />

          <NovedadesCard />
        </div>
      </main>
    </AlumnoLayout>
  );
}
