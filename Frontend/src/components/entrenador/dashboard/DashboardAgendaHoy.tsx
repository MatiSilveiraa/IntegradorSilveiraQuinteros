type Alumno = {
  id: number;
  nombre: string;
  apellido: string;
};

type Clase = {
  claseId: number;
  grupo: string;
  horaInicio: string;
  horaFin: string;
  cantidadAlumnos: number;
  cupoMaximo: number;
  cuposDisponibles: number;
  alumnos: Alumno[];
};

type Props = {
  agenda: Clase[];
};

export default function DashboardAgendaHoy({
  agenda,
}: Props) {
  return (
    <div
      className="
        bg-[#1a2b24]
        border
        border-[#2d463b]
        rounded-3xl
        p-8
      "
    >
      <h2 className="text-2xl font-bold mb-6">
        Agenda de hoy
      </h2>

      {agenda.length === 0 && (
        <p className="text-gray-400">
          No hay clases programadas para hoy.
        </p>
      )}

      <div className="space-y-5">

        {agenda.map((clase) => (

          <div
            key={clase.claseId}
            className="
              bg-[#12201b]
              border
              border-[#2d463b]
              rounded-2xl
              p-5
            "
          >
            <div className="flex justify-between">

              <div>

                <h3 className="font-bold text-lg">
                  {clase.grupo}
                </h3>

                <p className="text-sm text-gray-400">
                  {clase.horaInicio} - {clase.horaFin}
                </p>

              </div>

              <div className="text-right">

                <span className="font-semibold">

                  {clase.cantidadAlumnos} / {clase.cupoMaximo}

                </span>

                <p className="text-xs text-gray-400">
                  alumnos
                </p>

              </div>

            </div>

            <div className="mt-4 flex flex-wrap gap-2">

              {clase.alumnos.map((a) => (

                <span
                  key={a.id}
                  className="
                    px-3
                    py-1
                    rounded-full
                    bg-[#4adea8]/10
                    border
                    border-[#4adea8]/20
                    text-sm
                  "
                >
                  {a.nombre} {a.apellido}
                </span>

              ))}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}