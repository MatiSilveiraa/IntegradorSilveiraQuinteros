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

import AlumnoLayout from "../../components/layout/AlumnoLayout";

import type { Perfil, Cuota, Historial, Clase } from "../../types";

export default function AlumnoDashboard() {
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

  const obtenerProximaClase = (clases: Clase[]): any | null => {
    if (!clases.length) {
      return null;
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

  const proximaClase = obtenerProximaClase(misClases);

  useEffect(() => {
    obtenerMiPerfil().then(setPerfil).catch(console.error);

    obtenerMiHistorial().then(setHistorial).catch(console.error);

    obtenerMiCuota()
      .then(setCuota)
      .catch((error) => {
        if (
          error.response?.data?.mensaje ===
          "No existe cuota generada para el mes actual"
        ) {
          setCuota({
            estado: "Sin cuota",
          });

          return;
        }

        console.error(error);
      });
  }, []);

  useEffect(() => {
    obtenerMisClases().then(setMisClases).catch(console.error);
  }, []);

  return (
    <AlumnoLayout nombre={perfil?.nombre}>
      <main className="max-w-7xl mx-auto">
        <DashboardHeader nombre={perfil?.nombre} />

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
                (2FA). Activala para aumentar la seguridad de tu cuenta.
              </p>
            </div>

            <button
              onClick={() => (window.location.href = "/alumno/seguridad")}
              className="
        px-5
        py-3
        rounded-xl
        bg-[#4adea8]
        text-[#12201b]
        font-bold
        whitespace-nowrap
        hover:opacity-90
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
