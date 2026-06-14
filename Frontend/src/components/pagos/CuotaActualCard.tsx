import Card from "../ui/Card";

import type { Cuota } from "../../types";

type Props = {
  cuota: Cuota;
  onPagar?: () => void;
};

export default function CuotaActualCard({
  cuota,
  onPagar,
}: Props) {

  const estado =
    cuota?.estado || "Sin cuota";

  return (
    <Card>

      <h3 className="text-[#4adea8] font-bold uppercase text-sm">
        Cuota actual
      </h3>

      <div className="mt-4">

        <p className="text-white text-3xl font-bold">
          $
          {cuota?.importe || 0}
        </p>

        <p className="text-gray-400 mt-2">
          {estado}
        </p>

      </div>

      {estado !== "Pagada" &&
        estado !== "Sin cuota" && (
          <button
            onClick={onPagar}
            className="
              w-full
              mt-5
              h-12
              rounded-xl
              bg-[#4adea8]
              text-[#12201b]
              font-bold
            "
          >
            Pagar ahora
          </button>
        )}

    </Card>
  );
}