import { useNavigate } from "react-router-dom";

import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import SportsKabaddiOutlinedIcon from "@mui/icons-material/SportsKabaddiOutlined";

import DashboardQuickAction from "./DashboardQuickAction";

export default function DashboardQuickActions() {
  const navigate = useNavigate();

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-3xl font-bold">
          Acciones rápidas
        </h2>

        <p className="text-gray-400 mt-2">
          Accedé rápidamente a los principales módulos del sistema.
        </p>
      </div>

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
          icono={<SportsKabaddiOutlinedIcon sx={{ fontSize: 34 }} />}
          onClick={() => navigate("/admin/grupos")}
        />

        <DashboardQuickAction
          titulo="Cuotas"
          descripcion="Consultar pagos y cuotas de alumnos."
          icono={<AttachMoneyOutlinedIcon sx={{ fontSize: 34 }} />}
          onClick={() => navigate("/admin/cuotas")}
        />

        <DashboardQuickAction
          titulo="Desafíos"
          descripcion="Gestionar desafíos, recompensas y ganadores."
          icono={<EmojiEventsOutlinedIcon sx={{ fontSize: 34 }} />}
          onClick={() => navigate("/admin/desafios")}
        />

        <DashboardQuickAction
          titulo="Premios físicos"
          descripcion="Entregar premios pendientes."
          icono={<WorkspacePremiumOutlinedIcon sx={{ fontSize: 34 }} />}
          onClick={() => navigate("/admin/premios")}
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
          icono={<ShieldOutlinedIcon sx={{ fontSize: 34 }} />}
          onClick={() => navigate("/admin/seguridad")}
        />
      </div>
    </section>
  );
}