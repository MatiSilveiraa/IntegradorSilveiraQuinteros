import Card from "../ui/Card";

import type { Clase } from "../../types";

type Props = {
  clase?: Clase;
};

export default function ProximaClaseCard({
  clase,
}: Props) {

  return (
    <Card className="lg:col-span-2">

      <span className="text-[#4adea8] text-xs font-bold uppercase">
        Próxima clase
      </span>

      {clase ? (

        <>
          <h2 className="text-3xl font-bold mt-3 text-white">
            {clase.diaSemana}
          </h2>

          <p className="text-gray-400 mt-2">
            {clase.horaInicio.substring(0, 5)}
            {" - "}
            {clase.horaFin.substring(0, 5)}
          </p>

          <div className="mt-4 flex items-center gap-2">

            <span
              className="
                px-3
                py-1
                rounded-full
                bg-[#4adea8]/10
                text-[#4adea8]
                text-xs
                font-semibold
              "
            >
              Grupo {clase.grupoId}
            </span>

          </div>
        </>

      ) : (

        <p className="text-gray-400 mt-4">
          No tienes clases programadas.
        </p>

      )}

    </Card>
  );
}