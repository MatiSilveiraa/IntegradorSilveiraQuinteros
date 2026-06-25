import { useNavigate } from "react-router-dom";

import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";

import DashboardQuickAction from "./DashboardQuickAction";

export default function DashboardQuickActions() {
  const navigate = useNavigate();

  return (
    <section>

      <h2 className="text-3xl font-bold mb-6">
        Acciones rápidas
      </h2>

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
          titulo="Desafíos"
          descripcion="Administrar desafíos activos."
          icono={<EmojiEventsOutlinedIcon sx={{ fontSize: 34 }} />}
          onClick={() => navigate("/admin/desafios")}
        />

        <DashboardQuickAction
          titulo="Recompensas"
          descripcion="Administrar recompensas."
          icono={<CardGiftcardOutlinedIcon sx={{ fontSize: 34 }} />}
          onClick={() => navigate("/admin/recompensas")}
        />

        <DashboardQuickAction
          titulo="Premios físicos"
          descripcion="Entregar premios pendientes."
          icono={<WorkspacePremiumOutlinedIcon sx={{ fontSize: 34 }} />}
          onClick={() => navigate("/admin/premios")}
        />

        <DashboardQuickAction
          titulo="Reactivaciones"
          descripcion="Revisar solicitudes."
          icono={<AutorenewOutlinedIcon sx={{ fontSize: 34 }} />}
          onClick={() => navigate("/admin/reactivaciones")}
        />

      </div>

    </section>
  );
}