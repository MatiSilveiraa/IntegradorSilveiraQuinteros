import { useNavigate } from "react-router-dom";

import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";

import DashboardQuickAction from "./DashboardQuickAction";

export default function DashboardQuickActions() {
  const navigate = useNavigate();

  return (
    <section>
      <h2 className="text-3xl font-bold mb-2">
        Gestión
      </h2>

      <p className="text-gray-400 mb-6">
        Accede rápidamente a los principales módulos del sistema.
      </p>

      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <DashboardQuickAction
          titulo="Gestionar alumnos"
          descripcion="Consultar y administrar alumnos."
          icono={<GroupsOutlinedIcon sx={{ fontSize: 34 }} />}
          onClick={() => navigate("/admin/alumnos")}
        />

        <DashboardQuickAction
          titulo="Gestionar clases"
          descripcion="Crear y modificar clases."
          icono={<CalendarMonthOutlinedIcon sx={{ fontSize: 34 }} />}
          onClick={() => navigate("/admin/clases")}
        />

        <DashboardQuickAction
          titulo="Gestionar grupos"
          descripcion="Administrar grupos de entrenamiento."
          icono={<FitnessCenterOutlinedIcon sx={{ fontSize: 34 }} />}
          onClick={() => navigate("/alumno/grupos")}
        />

        <DashboardQuickAction
          titulo="Cuotas"
          descripcion="Consultar pagos y cuotas de alumnos."
          icono={<PaidOutlinedIcon sx={{ fontSize: 34 }} />}
          onClick={() => navigate("/admin/alumnos?filtro=cuotas-pendientes")}
        />

        <DashboardQuickAction
          titulo="Desafíos"
          descripcion="Administrar desafíos activos."
          icono={<EmojiEventsOutlinedIcon sx={{ fontSize: 34 }} />}
          onClick={() => navigate("/admin/desafios")}
        />

        <DashboardQuickAction
          titulo="Recompensas"
          descripcion="Administrar recompensas por desafío."
          icono={<CardGiftcardOutlinedIcon sx={{ fontSize: 34 }} />}
          onClick={() => navigate("/admin/recompensas")}
        />

        <DashboardQuickAction
          titulo="Reactivaciones"
          descripcion="Revisar solicitudes de alumnos bloqueados."
          icono={<AutorenewOutlinedIcon sx={{ fontSize: 34 }} />}
          onClick={() => navigate("/admin/reactivaciones")}
        />

        <DashboardQuickAction
          titulo="Seguridad"
          descripcion="Configurar acceso y autenticación."
          icono={<SecurityOutlinedIcon sx={{ fontSize: 34 }} />}
          onClick={() => navigate("/admin/seguridad")}
        />
      </div>
    </section>
  );
}