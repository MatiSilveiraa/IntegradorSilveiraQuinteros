import { useNavigate } from "react-router-dom";

import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";

type Props = {
  proximaClaseId?: number;
};

export default function DashboardQuickActions({
  proximaClaseId,
}: Props) {
  const navigate = useNavigate();

  const acciones = [
    {
      titulo: "Mis grupos",
      descripcion:
        "Consultá los grupos que tenés asignados.",
      icono: <GroupsOutlinedIcon />,
      onClick: () =>
        navigate("/entrenador/grupos"),
    },
    {
      titulo: "Tomar asistencia",
      descripcion: proximaClaseId
        ? "Registrá la asistencia de tu próxima clase."
        : "Seleccioná una clase para registrar asistencia.",
      icono: <FactCheckOutlinedIcon />,
      onClick: () =>
        proximaClaseId
          ? navigate(
              `/entrenador/clases/${proximaClaseId}/asistencia`,
            )
          : navigate("/entrenador/grupos"),
    },
    {
      titulo: "Mi agenda",
      descripcion:
        "Revisá tus clases y horarios programados.",
      icono: <CalendarMonthOutlinedIcon />,
      onClick: () =>
        navigate("/entrenador/grupos"),
    },
    {
      titulo: "Desafíos",
      descripcion:
        "Consultá los desafíos activos del equipo.",
      icono: <EmojiEventsOutlinedIcon />,
      onClick: () => navigate("/desafios"),
    },
  ];

  return (
    <section>
      <div className="mb-5">
        <p className="text-[#4adea8] text-xs font-bold uppercase tracking-wide">
          Navegación
        </p>

        <h2 className="text-2xl font-bold mt-1">
          Accesos rápidos
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {acciones.map((accion) => (
          <button
            key={accion.titulo}
            type="button"
            onClick={accion.onClick}
            className="group rounded-3xl bg-[#1a2b24] border border-[#2d463b] p-5 text-left hover:border-[#4adea8]/50 hover:-translate-y-1 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#4adea8]/10 border border-[#4adea8]/20 text-[#4adea8] flex items-center justify-center">
              {accion.icono}
            </div>

            <div className="flex items-start justify-between gap-3 mt-5">
              <div>
                <h3 className="text-lg font-bold">
                  {accion.titulo}
                </h3>

                <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                  {accion.descripcion}
                </p>
              </div>

              <ArrowForwardOutlinedIcon
                className="text-gray-500 group-hover:text-[#4adea8] group-hover:translate-x-1 transition-all"
                fontSize="small"
              />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
