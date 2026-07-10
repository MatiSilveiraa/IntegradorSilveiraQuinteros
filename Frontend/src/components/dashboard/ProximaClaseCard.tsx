import Card from "../ui/Card";
import type { Clase } from "../../types";

type Props = {
  clase?: Clase;
};

export default function ProximaClaseCard({ clase }: Props) {
  const abrirMapa = () => {
    if (!clase) return;

    window.open(
      `https://www.google.com/maps?q=${clase.latitud},${clase.longitud}`,
      "_blank"
    );
  };

  const ubicacionLegible =
  clase?.ubicacionNombre &&
  !/^\d+$/.test(clase.ubicacionNombre.trim())
    ? clase.ubicacionNombre
    : null;

  return (
    <Card className="lg:col-span-2">
      <div className="flex justify-between items-start gap-6">
        <div className="flex-1">
          <span className="text-[#4adea8] text-xs uppercase font-bold tracking-wider">
            Próxima clase
          </span>

          {clase ? (
            <>
              <h2 className="text-3xl font-bold mt-3 text-white">
                {clase.grupoNombre ?? "Clase programada"}
              </h2>

              <div className="space-y-3 mt-6">

                <div className="flex items-center gap-3">
                  <span className="text-xl">📅</span>

                  <div>
                    <p className="text-white font-semibold">
                      {clase.diaSemana}
                    </p>

                    <p className="text-gray-400 text-sm">
                      {clase.horaInicio.substring(0, 5)} -{" "}
                      {clase.horaFin.substring(0, 5)}
                    </p>
                  </div>
                </div>

           {ubicacionLegible && (
  <div className="flex items-center gap-3">
    <span className="text-xl">📍</span>

    <p className="text-white font-semibold">
      {ubicacionLegible}
    </p>
  </div>
)}

                <div className="flex items-center gap-3">
                  <span className="text-xl">👨‍🏫</span>

                  <div>
                    <p className="text-white font-semibold">
                      {clase.entrenadorNombre ??
                        "Entrenador"}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={abrirMapa}
                className="
                  mt-7
                  bg-[#4adea8]
                  text-[#12201b]
                  font-bold
                  px-5
                  py-3
                  rounded-xl
                  hover:brightness-110
                  transition
                "
              >
                Ver ubicación
              </button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mt-4 text-white">
                Sin clases programadas
              </h2>

              <p className="text-gray-400 mt-3">
                Cuando te inscribas a una clase,
                aparecerá aquí.
              </p>
            </>
          )}
        </div>

        <div
          className="
            hidden
            md:flex
            w-20
            h-20
            rounded-3xl
            bg-[#4adea8]/10
            border
            border-[#4adea8]/20
            items-center
            justify-center
            text-4xl
          "
        >
          📅
        </div>
      </div>
    </Card>
);
}