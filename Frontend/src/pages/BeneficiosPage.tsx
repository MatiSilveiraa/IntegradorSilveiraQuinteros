import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import AlumnoLayout from "../components/layout/AlumnoLayout";

import { obtenerMiPerfil } from "../services/Perfil.service";
import { obtenerMisBeneficios } from "../services/Beneficio.Service";

import type { Perfil, Beneficio } from "../types";
import FullPageLoader from "../components/FullScreenSpinner";

export default function BeneficiosPage() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [loading, setLoading] = useState(true);
  const [beneficios, setBeneficios] = useState<Beneficio[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [perfilData, beneficiosData] = await Promise.all([
          obtenerMiPerfil(),
          obtenerMisBeneficios(),
        ]);

        setPerfil(perfilData);

        setBeneficios(Array.isArray(beneficiosData) ? beneficiosData : []);
      } catch (error) {
        console.error(error);

        toast.error("No fue posible cargar los beneficios");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const beneficiosActivos = beneficios.filter(
    (b) => b.estado?.toUpperCase() === "ACTIVO",
  ).length;

  const descuentos = beneficios.filter((b) => !b.cuotaGratis).length;

  const cuotasGratis = beneficios.filter((b) => b.cuotaGratis).length;

  const obtenerColorEstado = (estado: string) => {
    switch (estado?.toUpperCase()) {
      case "ACTIVO":
        return `
          bg-green-500/10
          text-green-400
        `;

      case "UTILIZADO":
        return `
          bg-gray-500/10
          text-gray-400
        `;

      case "VENCIDO":
        return `
          bg-red-500/10
          text-red-400
        `;

      default:
        return `
          bg-[#4adea8]/10
          text-[#4adea8]
        `;
    }
  };

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <AlumnoLayout nombre={perfil?.nombre}>
      <main className="max-w-6xl mx-auto">
        <div
          className="
    rounded-3xl
    border
    border-[#4adea8]/20
    bg-gradient-to-r
    from-[#1a2b24]
    to-[#163129]
    p-8
    mb-8
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
            BENEFICIOS
          </span>

          <h1 className="text-4xl font-bold mt-4">Mis Beneficios</h1>

          <p className="text-gray-300 mt-2">
            Recompensas obtenidas por tu esfuerzo y constancia.
          </p>
        </div>

        <div
          className="
            grid
            gap-4
            md:grid-cols-3
            mb-8
          "
        >
          <div
            className="
              bg-[#1a2b24]
              border
              border-[#2d463b]
              rounded-2xl
              p-5
            "
          >
            <p className="text-gray-400 text-sm">Beneficios activos</p>

            <h2 className="text-3xl font-bold mt-2">{beneficiosActivos}</h2>
          </div>

          <div
            className="
              bg-[#1a2b24]
              border
              border-[#2d463b]
              rounded-2xl
              p-5
            "
          >
            <p className="text-gray-400 text-sm">Descuentos</p>

            <h2 className="text-3xl font-bold mt-2">{descuentos}</h2>
          </div>

          <div
            className="
              bg-[#1a2b24]
              border
              border-[#2d463b]
              rounded-2xl
              p-5
            "
          >
            <p className="text-gray-400 text-sm">Cuotas gratis</p>

            <h2 className="text-3xl font-bold mt-2">{cuotasGratis}</h2>
          </div>
        </div>

        {beneficios.length === 0 ? (
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
            <p className="text-gray-400">No tienes beneficios activos.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {beneficios.map((beneficio) => (
              <div
                key={beneficio.id}
                className="
                    bg-[#1a2b24]
                    border
                    border-[#2d463b]
                    rounded-2xl
                    p-5
                    hover:border-[#4adea8]/30
                    transition-all
                  "
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3
                      className="
                          text-xl
                          font-bold
                          flex
                          items-center
                          gap-2
                        "
                    >
                      {beneficio.cuotaGratis
                        ? "🎁 Cuota Gratis"
                        : `💰 ${beneficio.porcentajeDescuento}% de Descuento`}
                    </h3>

                    <p className="text-gray-400 mt-2">
                      {beneficio.descripcion}
                    </p>
                  </div>

                  <span
                    className={`
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-semibold
                        ${obtenerColorEstado(beneficio.estado!)}
                      `}
                  >
                    {beneficio.estado}
                  </span>
                </div>

                <div className="mt-5">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Duración</span>

                    <span>
                      {beneficio.mesesAplicados}
                      {" / "}
                      {beneficio.mesesDuracion}
                      {" meses"}
                    </span>
                  </div>

                  <div
                    className="
                        w-full
                        h-2
                        bg-[#12201b]
                        rounded-full
                        mt-3
                        overflow-hidden
                      "
                  >
                    <div
                      className="
                          h-full
                          bg-[#4adea8]
                        "
                      style={{
                        width: `${
                          (beneficio.mesesDuracion ?? 0) > 0
                            ? ((beneficio.mesesAplicados ?? 0) /
                                (beneficio.mesesDuracion ?? 0)) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </AlumnoLayout>
  );
}
