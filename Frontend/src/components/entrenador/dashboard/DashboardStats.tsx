import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";

type Props = {
  dashboard: {
    grupos: number;
    alumnos: number;
    clasesHoy: number;
    desafiosActivos: number;
    notificacionesNoLeidas: number;
  };
};

export default function DashboardStats({ dashboard }: Props) {
  const cards = [
    {
      titulo: "Mis Grupos",
      valor: dashboard.grupos,
      icono: <GroupsOutlinedIcon />,
    },
    {
      titulo: "Alumnos",
      valor: dashboard.alumnos,
      icono: <PeopleOutlineOutlinedIcon />,
    },
    {
      titulo: "Clases Hoy",
      valor: dashboard.clasesHoy,
      icono: <CalendarMonthOutlinedIcon />,
    },
    {
      titulo: "Desafíos Activos",
      valor: dashboard.desafiosActivos,
      icono: <EmojiEventsOutlinedIcon />,
    },
    {
      titulo: "Notificaciones",
      valor: dashboard.notificacionesNoLeidas,
      icono: <NotificationsOutlinedIcon />,
    },
  ];

  return (
    <>
      <h2 className="text-2xl font-bold mb-5">
        Resumen del día
      </h2>

      <div
        className="
          grid
          gap-5
          md:grid-cols-2
          xl:grid-cols-5
          mb-10
        "
      >
        {cards.map((card) => (
          <div
            key={card.titulo}
            className="
              bg-[#1a2b24]
              border
              border-[#2d463b]
              rounded-3xl
              p-6
              hover:border-[#4adea8]/40
              hover:scale-[1.02]
              transition-all
            "
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">
                  {card.titulo}
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {card.valor}
                </h2>
              </div>

              <div className="text-[#4adea8] text-4xl">
                {card.icono}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}