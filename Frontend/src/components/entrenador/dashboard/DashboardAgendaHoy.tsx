import { useNavigate } from "react-router-dom";

import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";

import type { AgendaClase } from "../../../types";

type Props = {
  agenda: AgendaClase[];
};

export default function DashboardAgendaHoy({
  agenda,
}: Props) {
  const navigate = useNavigate();

  const agendaOrdenada = [...agenda].sort(
    (a, b) =>
      a.horaInicio.localeCompare(b.horaInicio),
  );

  return (
    <section className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6 sm:p-7 min-h-[310px]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[#4adea8] text-xs font-bold uppercase tracking-wide">
            Organización
          </p>

          <h2 className="text-2xl font-bold mt-1">
            Agenda de hoy
          </h2>
        </div>

        <span className="px-3 py-1 rounded-full bg-[#4adea8]/10 border border-[#4adea8]/30 text-[#4adea8] text-sm font-bold">
          {agenda.length}
        </span>
      </div>

      {agendaOrdenada.length === 0 ? (
        <div className="h-[210px] flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#12201b] border border-[#2d463b] flex items-center justify-center">
            <EventAvailableOutlinedIcon
              sx={{
                color: "#6b7280",
                fontSize: 30,
              }}
            />
          </div>

          <h3 className="text-xl font-bold mt-4">
            Agenda libre
          </h3>

          <p className="text-gray-400 mt-2">
            No tenés clases programadas para hoy.
          </p>
        </div>
      ) : (
        <div className="space-y-3 mt-6 max-h-[310px] overflow-y-auto pr-1">
          {agendaOrdenada.map((clase) => (
            <button
              key={clase.claseId}
              type="button"
              onClick={() =>
                navigate(
                  `/entrenador/clases/${clase.claseId}`,
                )
              }
              className="w-full rounded-2xl bg-[#12201b] border border-[#2d463b] p-4 flex items-center gap-4 text-left hover:border-[#4adea8]/50 transition-all"
            >
              <div className="w-14 shrink-0 text-center">
                <ScheduleOutlinedIcon
                  sx={{
                    color: "#4adea8",
                    fontSize: 22,
                  }}
                />

                <p className="text-sm font-bold mt-1">
                  {formatearHora(
                    clase.horaInicio,
                  )}
                </p>
              </div>

              <div className="w-px self-stretch bg-[#2d463b]" />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <GroupsOutlinedIcon
                    sx={{
                      color: "#4adea8",
                      fontSize: 18,
                    }}
                  />

                  <h3 className="font-bold truncate">
                    {clase.grupo}
                  </h3>
                </div>

                <p className="text-sm text-gray-400 mt-2">
                  {formatearHora(clase.horaInicio)} -{" "}
                  {formatearHora(clase.horaFin)}
                  {" · "}
                  {clase.cantidadAlumnos} alumnos
                </p>
              </div>

              <ChevronRightOutlinedIcon
                sx={{ color: "#9ca3af" }}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function formatearHora(hora?: string) {
  return hora?.substring(0, 5) ?? "--:--";
}
