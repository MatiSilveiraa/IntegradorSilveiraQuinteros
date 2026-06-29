import { useNavigate } from "react-router-dom";

export default function DashboardQuickActions() {

  const navigate = useNavigate();

  const acciones = [

    {
      titulo: "Mis grupos",
      icono: "👥",
      ruta: "/entrenador/grupos",
    },

    {
      titulo: "Tomar asistencia",
      icono: "✅",
      ruta: "/entrenador/asistencia",
    },

    {
      titulo: "Clases",
      icono: "📅",
      ruta: "/entrenador/clases",
    },

    {
      titulo: "Desafíos",
      icono: "🏆",
      ruta: "/desafios",
    },

  ];

  return (
    <section>

      <h2 className="text-2xl font-bold mb-5">
        Accesos rápidos
      </h2>

      <div
        className="
          grid
          md:grid-cols-2
          xl:grid-cols-4
          gap-5
        "
      >

        {acciones.map((accion) => (

          <button
            key={accion.titulo}
            onClick={() => navigate(accion.ruta)}
            className="
              bg-[#1a2b24]
              border
              border-[#2d463b]
              rounded-3xl
              p-6
              text-left
              hover:border-[#4adea8]
              hover:-translate-y-1
              transition-all
            "
          >

            <div className="text-4xl mb-4">
              {accion.icono}
            </div>

            <h3 className="font-bold text-lg">
              {accion.titulo}
            </h3>

          </button>

        ))}

      </div>

    </section>
  );
}