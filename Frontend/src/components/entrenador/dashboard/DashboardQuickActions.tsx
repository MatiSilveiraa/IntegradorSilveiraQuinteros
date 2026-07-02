import { useNavigate } from "react-router-dom";

import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";

export default function DashboardQuickActions() {

  const navigate = useNavigate();

  const acciones = [

    {
      titulo: "Mis grupos",
      icono: <GroupsOutlinedIcon sx={{ fontSize: 34 }} />,
      ruta: "/entrenador/grupos",
    },

    {
      titulo: "Tomar asistencia",
      icono: <FactCheckOutlinedIcon sx={{ fontSize: 34 }} />,
      ruta: "/entrenador/asistencia",
    },

    {
      titulo: "Mis clases",
      icono: <CalendarMonthOutlinedIcon sx={{ fontSize: 34 }} />,
      ruta: "/entrenador/clases",
    },

    {
      titulo: "Desafíos",
      icono: <EmojiEventsOutlinedIcon sx={{ fontSize: 34 }} />,
      ruta: "/desafios",
    },

  ];

  return (

    <section>

      <h2 className="text-2xl font-bold mb-6">
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
              group
              bg-[#1a2b24]
              border
              border-[#2d463b]
              rounded-3xl
              p-6
              text-left
              hover:border-[#4adea8]
              hover:bg-[#20342c]
              hover:-translate-y-1
              transition-all
              duration-300
            "
          >

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-[#234036]
                flex
                items-center
                justify-center
                mb-5
                text-[#4adea8]
                transition-all
                group-hover:bg-[#4adea8]
                group-hover:text-[#12201b]
              "
            >
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