import { useNavigate } from "react-router-dom";

import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";

import DashboardStatCard from "./DashboardStatCard";

type Props = {
  dashboard: any;
  recaudadoMes: number;
};

export default function DashboardStats({
  dashboard,
  recaudadoMes,
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="grid lg:grid-cols-3 gap-6 mb-10">
      {/* ALUMNOS */}

      <DashboardStatCard
        titulo="Alumnos activos"
        valor={dashboard.alumnosActivos}
        descripcion="Actualmente habilitados"
        icono={
          <GroupsOutlinedIcon
            sx={{
              color: "#4adea8",
              fontSize: 36,
            }}
          />
        }
        textoAccion="Gestionar alumnos"
        onClick={() => {
          navigate("/admin/alumnos");
        }}
      />

      {/* FINANZAS */}

      <DashboardStatCard
  titulo="Finanzas"
  valor={`$ ${recaudadoMes.toLocaleString("es-UY")}`}
  descripcion="Ingresos confirmados este mes"
  icono={
    <PaidOutlinedIcon
      sx={{
        color: "#4adea8",
        fontSize: 36,
      }}
    />
  }
  textoAccion="Ver finanzas"
  onClick={() => navigate("/admin/cuotas")}
/>

      {/* DESAFÍOS */}

      <DashboardStatCard
        titulo="Desafíos activos"
        valor={dashboard.desafiosActivos}
        descripcion="Disponibles para alumnos"
        icono={
          <EmojiEventsOutlinedIcon
            sx={{
              color: "#4adea8",
              fontSize: 36,
            }}
          />
        }
        textoAccion="Gestionar desafíos"
        onClick={() => {
          navigate("/admin/desafios");
        }}
      />
    </div>
  );
}