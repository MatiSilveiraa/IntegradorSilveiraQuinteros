type Props = {
  nombre?: string;
};

export default function DashboardHeader({ nombre }: Props) {
  const fechaActual = new Date();

  const hora = fechaActual.getHours();

  const saludo =
    hora < 12
      ? "Buenos días"
      : hora < 19
      ? "Buenas tardes"
      : "Buenas noches";

  const fechaFormateada = fechaActual.toLocaleDateString("es-UY", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <section className="mb-8">
      <div className="bg-gradient-to-br from-[#1b2a23] to-[#15211c] border border-[#2d463b] rounded-3xl p-7 shadow-lg shadow-black/20">
        <p className="text-[#4adea8] font-bold text-sm uppercase tracking-wide">
          Panel del alumno
        </p>

        <h1 className="text-3xl lg:text-5xl font-bold text-white mt-3">
          {saludo}, {nombre || "Alumno"} 👋
        </h1>

        <p className="text-gray-400 mt-3 capitalize">
          {fechaFormateada}
        </p>
      </div>
    </section>
  );
}