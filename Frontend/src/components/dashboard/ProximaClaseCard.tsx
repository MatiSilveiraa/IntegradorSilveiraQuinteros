import Card from "../ui/Card";
import type { Clase } from "../../types";

type Props = {
  clase?: Clase;
};

export default function ProximaClaseCard({ clase }: Props) {
  return (
    <Card className="lg:col-span-2">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[#4adea8] text-sm font-bold uppercase tracking-wide">
            Próxima clase
          </p>

          {clase ? (
            <>
              <h2 className="text-4xl font-bold mt-4 text-white">
                {clase.diaSemana}
              </h2>

              <p className="text-gray-300 mt-3 text-lg">
                {clase.horaInicio?.substring(0, 5)} -{" "}
                {clase.horaFin?.substring(0, 5)}
              </p>

              <div className="flex flex-wrap gap-3 mt-5">
                <span className="px-4 py-2 rounded-full bg-[#4adea8]/10 text-[#4adea8] border border-[#4adea8]/30 text-sm font-bold">
                  Grupo {clase.grupoId}
                </span>

                <span className="px-4 py-2 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 text-sm font-bold">
                  Programada
                </span>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mt-4 text-white">
                Sin clases programadas
              </h2>

              <p className="text-gray-400 mt-2">
                Cuando te inscribas a una clase, aparecerá acá.
              </p>
            </>
          )}
        </div>

        <div className="hidden md:flex w-16 h-16 rounded-2xl bg-[#4adea8]/10 border border-[#4adea8]/30 items-center justify-center text-3xl">
          📅
        </div>
      </div>
    </Card>
  );
}