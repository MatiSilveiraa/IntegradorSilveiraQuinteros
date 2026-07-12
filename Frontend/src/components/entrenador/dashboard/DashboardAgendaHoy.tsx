import { useNavigate } from "react-router-dom";

import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";

import type { AgendaClaseEntrenador } from "../../../types/entrenadorDashboard";

type Props = {
  agenda: AgendaClaseEntrenador[];
};

export default function DashboardAgendaHoy({
  agenda,
}: Props) {
  const navigate = useNavigate();

  const agendaOrdenada = [...agenda].sort((a, b) =>
    a.horaInicio.localeCompare(b.horaInicio),
  );

  return (
    <section className="min-h-[330px] rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-6 sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#4adea8]">
            Organización
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            Agenda de hoy
          </h2>
        </div>

        <span className="rounded-full border border-[#4adea8]/30 bg-[#4adea8]/10 px-3 py-1 text-sm font-bold text-[#4adea8]">
          {agendaOrdenada.length}
        </span>
      </div>

      {agendaOrdenada.length === 0 ? (
        <div className="flex h-[230px] flex-col items-center justify-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#2d463b] bg-[#12201b]">
            <EventAvailableOutlinedIcon
              sx={{
                color: "#6b7280",
                fontSize: 30,
              }}
            />
          </div>

          <h3 className="mt-4 text-xl font-bold">
            Agenda libre
          </h3>

          <p className="mt-2 text-gray-400">
            No tenés clases programadas para hoy.
          </p>
        </div>
      ) : (
        <div className="mt-6 max-h-[330px] space-y-3 overflow-y-auto pr-1">
          {agendaOrdenada.map((clase) => (
            <button
              key={clase.claseId}
              type="button"
              onClick={() =>
                navigate(
                  `/entrenador/clases/${clase.claseId}`,
                )
              }
              className="flex w-full items-center gap-4 rounded-2xl border border-[#2d463b] bg-[#12201b] p-4 text-left transition-all hover:border-[#4adea8]/50"
            >
              <div className="w-14 shrink-0 text-center">
                <ScheduleOutlinedIcon
                  sx={{
                    color: "#4adea8",
                    fontSize: 22,
                  }}
                />

                <p className="mt-1 text-sm font-bold">
                  {formatearHora(
                    clase.horaInicio,
                  )}
                </p>
              </div>

              <div className="self-stretch w-px bg-[#2d463b]" />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <GroupsOutlinedIcon
                    sx={{
                      color: "#4adea8",
                      fontSize: 18,
                    }}
                  />

                  <h3 className="truncate font-bold">
                    {clase.grupo}
                  </h3>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400">
                  <span>
                    {formatearHora(
                      clase.horaInicio,
                    )}{" "}
                    -{" "}
                    {formatearHora(
                      clase.horaFin,
                    )}
                  </span>

                  <span className="inline-flex items-center gap-1">
                    <PeopleOutlineOutlinedIcon
                      sx={{ fontSize: 16 }}
                    />

                    {clase.cantidadAlumnos}{" "}
                    {clase.cantidadAlumnos === 1
                      ? "alumno"
                      : "alumnos"}
                  </span>
                </div>
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

function formatearHora(
  hora?: string | null,
) {
  return hora?.substring(0, 5) ?? "--:--";
}