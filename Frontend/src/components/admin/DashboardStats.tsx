import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";

import DashboardStatCard from "./DashboardStatCard";

type Props = {
  dashboard: any;
};

export default function DashboardStats({ dashboard }: Props) {
  return (
    <div className="grid lg:grid-cols-3 gap-6 mb-10">
      <DashboardStatCard
        titulo="Alumnos activos"
        valor={dashboard.alumnosActivos}
        descripcion="Actualmente habilitados"
        icono={<GroupsOutlinedIcon sx={{ color: "#4adea8", fontSize: 36 }} />}
      />

      <DashboardStatCard
        titulo="Ingresos del mes"
        valor={`$ ${dashboard.ingresosMesActual}`}
        descripcion="Pagos confirmados"
        icono={<PaidOutlinedIcon sx={{ color: "#4adea8", fontSize: 36 }} />}
      />

      <DashboardStatCard
        titulo="Desafíos activos"
        valor={dashboard.desafiosActivos}
        descripcion="Disponibles para alumnos"
        icono={
          <EmojiEventsOutlinedIcon sx={{ color: "#4adea8", fontSize: 36 }} />
        }
      />
    </div>
  );
}