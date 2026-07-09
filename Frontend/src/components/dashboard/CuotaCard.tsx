import Card from "../ui/Card";
import type { Cuota } from "../../types";

type Props = {
  cuota?: Cuota;
};

export default function CuotaCard({ cuota }: Props) {
  const estado = cuota?.estado ?? "Sin cuota";

  const estaAlDia =
    estado.toUpperCase() === "PAGADA" ||
    estado.toUpperCase() === "SIN CUOTA";

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[#4adea8] text-sm font-bold uppercase tracking-wide">
            Cuota
          </p>

          <h3 className="text-3xl font-bold mt-4 text-white">
            {estado}
          </h3>

          <p className="text-gray-400 mt-2">
            {estaAlDia
              ? "No tenés pagos pendientes."
              : "Tenés una cuota pendiente."}
          </p>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-[#4adea8]/10 border border-[#4adea8]/30 flex items-center justify-center text-2xl">
          💳
        </div>
      </div>
    </Card>
  );
}