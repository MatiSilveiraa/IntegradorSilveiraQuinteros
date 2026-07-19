import { useNavigate } from "react-router-dom";

import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import SportsKabaddiOutlinedIcon from "@mui/icons-material/SportsKabaddiOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";

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
          Accedé rápidamente a las principales tareas de administración.
        </p>
      </div>

   <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <DashboardQuickAction
          titulo="Administrar alumnos"
          descripcion="Consultá alumnos, su estado y la información de sus cuentas."
          icono={<GroupsOutlinedIcon sx={{ fontSize: 34 }} />}
          onClick={() => navigate("/admin/alumnos")}
        />

        <DashboardQuickAction
          titulo="Organizar clases"
          descripcion="Creá, editá y administrá las clases programadas."
          icono={<CalendarMonthOutlinedIcon sx={{ fontSize: 34 }} />}
          onClick={() => navigate("/admin/clases")}
        />

        <DashboardQuickAction
          titulo="Administrar grupos"
          descripcion="Consultá grupos, integrantes y organización de entrenamientos."
          icono={<SportsKabaddiOutlinedIcon sx={{ fontSize: 34 }} />}
          onClick={() => navigate("/admin/grupos")}
        />

        <DashboardQuickAction
          titulo="Gestionar cuotas y pagos"
          descripcion="Consultá cuotas, registrá pagos y revisá el estado financiero."
          icono={<AttachMoneyOutlinedIcon sx={{ fontSize: 34 }} />}
          onClick={() => navigate("/admin/cuotas")}
        />

        <DashboardQuickAction
          titulo="Administrar desafíos"
          descripcion="Creá desafíos y gestioná la participación de los alumnos."
          icono={<EmojiEventsOutlinedIcon sx={{ fontSize: 34 }} />}
          onClick={() => navigate("/admin/desafios")}
        />

        <DashboardQuickAction
          titulo="Entregar premios"
          descripcion="Revisá y gestioná los premios físicos pendientes de entrega."
          icono={<WorkspacePremiumOutlinedIcon sx={{ fontSize: 34 }} />}
          onClick={() => navigate("/admin/premios")}
        />

        <DashboardQuickAction
          titulo="Revisar reactivaciones"
          descripcion="Gestioná solicitudes de reactivación de alumnos bloqueados."
          icono={<AutorenewOutlinedIcon sx={{ fontSize: 34 }} />}
          onClick={() => navigate("/admin/reactivaciones")}
        />

        <DashboardQuickAction
          titulo="Consultar auditoría"
          descripcion="Revisá el historial de acciones realizadas en el sistema."
          icono={<HistoryOutlinedIcon sx={{ fontSize: 34 }} />}
          onClick={() => navigate("/admin/auditoria")}
        />

        <DashboardQuickAction
          titulo="Configurar seguridad"
          descripcion="Administrá las opciones de acceso y autenticación de tu cuenta."
          icono={<ShieldOutlinedIcon sx={{ fontSize: 34 }} />}
          onClick={() => navigate("/admin/seguridad")}
        />
      </div>
    </section>
  );
}