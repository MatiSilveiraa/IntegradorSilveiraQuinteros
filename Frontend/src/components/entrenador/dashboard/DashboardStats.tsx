import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";

import type { DashboardEntrenador } from "../../../types";

type Props = {
  dashboard: DashboardEntrenador | null;
};

export default function DashboardStats({
  dashboard,
}: Props) {
  const cards = [
    {
      titulo: "Mis grupos",
      valor: dashboard?.grupos ?? 0,
      descripcion: "Grupos asignados",
      icono: <GroupsOutlinedIcon />,
    },
    {
      titulo: "Alumnos",
      valor: dashboard?.alumnos ?? 0,
      descripcion: "Alumnos a cargo",
      icono: <PeopleOutlineOutlinedIcon />,
    },
    {
      titulo: "Clases hoy",
      valor: dashboard?.clasesHoy ?? 0,
      descripcion: "Agenda del día",
      icono: <CalendarMonthOutlinedIcon />,
    },
    {
      titulo: "Desafíos activos",
      valor: dashboard?.desafiosActivos ?? 0,
      descripcion: "En curso",
      icono: <EmojiEventsOutlinedIcon />,
    },
    {
      titulo: "Notificaciones",
      valor:
        dashboard?.notificacionesNoLeidas ?? 0,
      descripcion: "Sin leer",
      icono: <NotificationsOutlinedIcon />,
    },
  ];

  return (
    <section className="mb-8">
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <p className="text-[#4adea8] text-xs font-bold uppercase tracking-wide">
            Resumen
          </p>

          <h2 className="text-2xl font-bold mt-1">
            Tu jornada de hoy
          </h2>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <article
            key={card.titulo}
            className="bg-[#1a2b24] border border-[#2d463b] rounded-2xl p-5 hover:border-[#4adea8]/40 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-gray-400">
                  {card.titulo}
                </p>

                <p className="text-3xl font-bold mt-3">
                  {card.valor}
                </p>

                <p className="text-xs text-gray-500 mt-2">
                  {card.descripcion}
                </p>
              </div>

              <div className="w-11 h-11 shrink-0 rounded-2xl bg-[#4adea8]/10 border border-[#4adea8]/20 text-[#4adea8] flex items-center justify-center">
                {card.icono}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
