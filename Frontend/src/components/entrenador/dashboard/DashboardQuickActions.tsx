import { useNavigate } from "react-router-dom";

import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
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
      titulo: "Mis clases",
      descripcion:
        "Consultá y administrá todas tus asignaciones.",
      icono: <CalendarMonthOutlinedIcon />,
      onClick: () =>
        navigate("/entrenador/mis-clases"),
    },
    {
      titulo: "Clases disponibles",
      descripcion:
        "Buscá nuevas clases y unite directamente.",
      icono: <AddCircleOutlineOutlinedIcon />,
      onClick: () =>
        navigate(
          "/entrenador/clases-disponibles",
        ),
    },
    {
      titulo: "Tomar asistencia",
      descripcion: proximaClaseId
        ? "Registrá la asistencia de tu próxima clase."
        : "Elegí una de tus clases para registrar asistencia.",
      icono: <FactCheckOutlinedIcon />,
      onClick: () =>
        proximaClaseId
          ? navigate(
              `/entrenador/clases/${proximaClaseId}/asistencia`,
            )
          : navigate("/entrenador/mis-clases"),
    },
    {
      titulo: "Mis grupos",
      descripcion:
        "Consultá los grupos en los que tenés clases a cargo.",
      icono: <GroupsOutlinedIcon />,
      onClick: () =>
        navigate("/entrenador/grupos"),
    },
    {
      titulo: "Desafíos",
      descripcion:
        "Consultá los desafíos activos del equipo.",
      icono: <EmojiEventsOutlinedIcon />,
      onClick: () =>
        navigate("/alumno/desafios"),
    },
  ];

  return (
    <section>
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-wide text-[#4adea8]">
          Navegación
        </p>

        <h2 className="mt-1 text-2xl font-bold">
          Accesos rápidos
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {acciones.map((accion) => (
          <button
            key={accion.titulo}
            type="button"
            onClick={accion.onClick}
            className="group rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-5 text-left transition-all hover:-translate-y-1 hover:border-[#4adea8]/50"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#4adea8]/20 bg-[#4adea8]/10 text-[#4adea8]">
              {accion.icono}
            </div>

            <div className="mt-5 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold">
                  {accion.titulo}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-gray-400">
                  {accion.descripcion}
                </p>
              </div>

              <ArrowForwardOutlinedIcon
                className="text-gray-500 transition-all group-hover:translate-x-1 group-hover:text-[#4adea8]"
                fontSize="small"
              />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
