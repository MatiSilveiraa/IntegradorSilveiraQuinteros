import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import TopBar from "../components/navigation/DashboardTopBar";
import FullScreenLoading from "../components/FullScreenSpinner";
import BeneficioCard from "../components/admin/BeneficioCard";

import { obtenerBeneficiosPendientes } from "../services/AdminBeneficio.Service";
import type { BeneficioPendienteAdmin } from "../types";

type Filtro = "todos" | "descuento" | "cuota-gratis";

export default function AdminBeneficiosPendientesPage() {
  const [beneficios, setBeneficios] = useState<BeneficioPendienteAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [busqueda, setBusqueda] = useState("");

  const cargarDatos = async () => {
    try {
      setLoading(true);

      const data = await obtenerBeneficiosPendientes();

      setBeneficios(data);
    } catch (error) {
      console.error(error);
      toast.error("No fue posible cargar los beneficios económicos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const beneficiosFiltrados = useMemo(() => {
    return beneficios.filter((beneficio) => {
      if (filtro === "cuota-gratis" && !beneficio.cuotaGratis) return false;
      if (filtro === "descuento" && beneficio.cuotaGratis) return false;

      const texto = `${beneficio.nombreAlumno} ${beneficio.apellidoAlumno} ${beneficio.descripcion}`.toLowerCase();

      return texto.includes(busqueda.toLowerCase());
    });
  }, [beneficios, filtro, busqueda]);

  const totalDescuentos = beneficios.filter((b) => !b.cuotaGratis).length;
  const totalCuotasGratis = beneficios.filter((b) => b.cuotaGratis).length;


  if (loading) {
    return <FullScreenLoading />;
  }

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      <TopBar />

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Beneficios económicos</h1>

          <p className="text-gray-400 mt-2">
            Descuentos y cuotas gratis que se aplican automáticamente al generar
            las próximas cuotas mensuales.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <CardResumen titulo="Beneficios pendientes" valor={beneficios.length} />
          <CardResumen titulo="Descuentos" valor={totalDescuentos} />
          <CardResumen titulo="Cuotas gratis" valor={totalCuotasGratis} />
        </div>

        <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-5 mb-8">
          <div className="grid lg:grid-cols-[1fr_auto] gap-4">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por alumno o descripción..."
              className="w-full p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8]"
            />

            <div className="flex flex-wrap gap-3">
              <BotonFiltro
                texto="Todos"
                activo={filtro === "todos"}
                onClick={() => setFiltro("todos")}
              />

              <BotonFiltro
                texto="Descuentos"
                activo={filtro === "descuento"}
                onClick={() => setFiltro("descuento")}
              />

              <BotonFiltro
                texto="Cuotas gratis"
                activo={filtro === "cuota-gratis"}
                onClick={() => setFiltro("cuota-gratis")}
              />
            </div>
          </div>
        </div>

        {beneficiosFiltrados.length === 0 ? (
          <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-10 text-center">
            <h2 className="text-2xl font-bold mb-2">
              No hay beneficios para mostrar
            </h2>

            <p className="text-gray-400">
              No se encontraron beneficios económicos con el filtro seleccionado.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
{beneficiosFiltrados.map((beneficio) => (
  <BeneficioCard
    key={beneficio.beneficioId}
    beneficio={beneficio}
  />
))}
          </div>
        )}
      </main>
    </div>
  );
}

function CardResumen({ titulo, valor }: { titulo: string; valor: number }) {
  return (
    <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6">
      <p className="text-sm text-gray-400">{titulo}</p>

      <h2 className="text-4xl font-bold mt-3">{valor}</h2>
    </div>
  );
}

function BotonFiltro({
  texto,
  activo,
  onClick,
}: {
  texto: string;
  activo: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-5 py-3 rounded-xl border font-semibold transition-all ${
        activo
          ? "bg-[#4adea8] text-[#12201b] border-[#4adea8]"
          : "bg-[#12201b] text-gray-300 border-[#2d463b] hover:border-[#4adea8]"
      }`}
    >
      {texto}
    </button>
  );
}