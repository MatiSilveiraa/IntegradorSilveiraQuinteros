type Props = {
  nombre?: string;
};

export default function DashboardHero({ nombre }: Props) {
  return (
    <section
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
        PANEL ENTRENADOR
      </span>

      <h1 className="text-4xl font-bold mt-4">
        Bienvenido {nombre}
      </h1>

      <p className="text-gray-300 mt-2 max-w-3xl">
        Gestiona tus grupos, consulta tu agenda diaria, registra asistencias y
        realiza el seguimiento de tus alumnos desde un único lugar.
      </p>
    </section>
  );
}