import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";

import type { ProximaClaseEntrenador } from "../../../types";

type Props = {
  clase: ProximaClaseEntrenador | null;
};

export default function DashboardNextClass({
  clase,
}: Props) {
  const navigate = useNavigate();

  return (
    <section className="min-h-[330px] rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-6 sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#4adea8]">
            Prioridad
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            Próxima clase
          </h2>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#4adea8]/30 bg-[#4adea8]/10">
          <CalendarMonthOutlinedIcon
            sx={{ color: "#4adea8" }}
          />
        </div>
      </div>

      {clase === null ? (
        <div className="flex h-[230px] flex-col items-center justify-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#2d463b] bg-[#12201b]">
            <EventBusyOutlinedIcon
              sx={{
                color: "#6b7280",
                fontSize: 30,
              }}
            />
          </div>

          <h3 className="mt-4 text-xl font-bold">
            No hay una próxima clase
          </h3>

          <p className="mt-2 max-w-sm text-gray-400">
            No tenés clases futuras programadas en tus grupos
            asignados.
          </p>
        </div>
      ) : (
        <div className="mt-6">
          <div className="rounded-2xl border border-[#2d463b] bg-[#12201b] p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#4adea8]/20 bg-[#4adea8]/10">
                <GroupsOutlinedIcon
                  sx={{ color: "#4adea8" }}
                />
              </div>

              <div className="min-w-0">
                <p className="text-sm text-gray-400">
                  Grupo
                </p>

                <h3 className="mt-1 break-words text-2xl font-bold">
                  {clase.grupo}
                </h3>

                <p className="mt-3 font-semibold capitalize text-[#4adea8]">
                  {formatearFecha(
                    clase.fechaProximaClase,
                  )}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <InfoClase
                icono={<AccessTimeOutlinedIcon />}
                titulo="Horario"
                valor={`${formatearHora(
                  clase.horaInicio,
                )} - ${formatearHora(
                  clase.horaFin,
                )}`}
              />

              <InfoClase
                icono={<PeopleOutlineOutlinedIcon />}
                titulo="Ocupación"
                valor={`${clase.cantidadAlumnos}/${clase.cupoMaximo}`}
              />
            </div>

            <p className="mt-4 text-xs text-gray-500">
              {clase.cuposDisponibles}{" "}
              {clase.cuposDisponibles === 1
                ? "lugar disponible"
                : "lugares disponibles"}
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/entrenador/clases/${clase.claseId}`,
                )
              }
              className="flex h-12 items-center justify-center gap-2 rounded-xl border border-[#2d463b] bg-[#12201b] font-semibold transition-all hover:border-[#4adea8]"
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
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-[#4adea8] font-bold text-[#12201b] transition-all hover:brightness-110"
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

function InfoClase({
  icono,
  titulo,
  valor,
}: {
  icono: ReactNode;
  titulo: string;
  valor: string;
}) {
  return (
    <div className="rounded-2xl border border-[#2d463b] bg-[#1a2b24] p-4">
      <div className="text-[#4adea8]">
        {icono}
      </div>

      <p className="mt-3 text-xs text-gray-500">
        {titulo}
      </p>

      <p className="mt-1 font-semibold">
        {valor}
      </p>
    </div>
  );
}

function formatearHora(hora: string) {
  return hora.substring(0, 5);
}

function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString(
    "es-UY",
    {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "America/Montevideo",
    },
  );
}