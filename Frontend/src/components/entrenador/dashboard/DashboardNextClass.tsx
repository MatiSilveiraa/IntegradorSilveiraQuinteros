import { useNavigate } from "react-router-dom";

import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";

import type { ProximaClase } from "../../../types";

type Props = {
  clase?: ProximaClase;
};

export default function DashboardNextClass({
  clase,
}: Props) {
  const navigate = useNavigate();

  return (
    <section className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6 sm:p-7 min-h-[310px]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[#4adea8] text-xs font-bold uppercase tracking-wide">
            Prioridad
          </p>

          <h2 className="text-2xl font-bold mt-1">
            Próxima clase
          </h2>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-[#4adea8]/10 border border-[#4adea8]/30 flex items-center justify-center">
          <CalendarMonthOutlinedIcon
            sx={{ color: "#4adea8" }}
          />
        </div>
      </div>

      {!clase ? (
        <div className="h-[210px] flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#12201b] border border-[#2d463b] flex items-center justify-center">
            <EventBusyOutlinedIcon
              sx={{
                color: "#6b7280",
                fontSize: 30,
              }}
            />
          </div>

          <h3 className="text-xl font-bold mt-4">
            No hay una próxima clase
          </h3>

          <p className="text-gray-400 mt-2">
            Cuando tengas una clase programada aparecerá acá.
          </p>
        </div>
      ) : (
        <div className="mt-6">
          <div className="rounded-2xl bg-[#12201b] border border-[#2d463b] p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 rounded-2xl bg-[#4adea8]/10 border border-[#4adea8]/20 flex items-center justify-center">
                <GroupsOutlinedIcon
                  sx={{ color: "#4adea8" }}
                />
              </div>

              <div>
                <p className="text-sm text-gray-400">
                  Grupo
                </p>

                <h3 className="text-2xl font-bold mt-1">
                  {clase.grupo}
                </h3>

                <p className="text-[#4adea8] font-semibold mt-3">
                  {formatearHora(clase.horaInicio)} -{" "}
                  {formatearHora(clase.horaFin)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mt-4">
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/entrenador/clases/${clase.claseId}`,
                )
              }
              className="h-12 rounded-xl bg-[#12201b] border border-[#2d463b] font-semibold flex items-center justify-center gap-2 hover:border-[#4adea8] transition-all"
            >
              <VisibilityOutlinedIcon fontSize="small" />
              Ver clase
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/entrenador/clases/${clase.claseId}/asistencia`,
                )
              }
              className="h-12 rounded-xl bg-[#4adea8] text-[#12201b] font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all"
            >
              <FactCheckOutlinedIcon fontSize="small" />
              Tomar asistencia
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function formatearHora(hora?: string) {
  return hora?.substring(0, 5) ?? "--:--";
}
