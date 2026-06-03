type Props = {
  nombre?: string;
};

export default function DashboardHeader({
  nombre,
}: Props) {

  const fechaActual = new Date();

  const fechaFormateada =
    fechaActual.toLocaleDateString("es-UY", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

  return (
    <div className="mb-8">

      <h1 className="text-3xl lg:text-4xl font-bold text-white">
        ¡Hola, {nombre || "Alumno"}!
      </h1>

      <p className="text-gray-400 mt-1 capitalize">
        {fechaFormateada}
      </p>

    </div>
  );
}