import { useNavigate } from "react-router-dom";

import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";

import type { ClaseGrupo } from "../../../types/grupoDetalle";

type Props = {
  clases: ClaseGrupo[];
};

export default function GrupoClases({
  clases,
}: Props) {
  const navigate = useNavigate();

  return (
    <section>
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <p className="text-[#4adea8] text-xs font-bold uppercase tracking-wide">
            Agenda
          </p>

          <h2 className="text-2xl font-bold mt-1">
            Clases del grupo
          </h2>
        </div>

        <span className="px-3 py-1 rounded-full bg-[#4adea8]/10 border border-[#4adea8]/30 text-[#4adea8] text-sm font-bold">
          {clases.length}
        </span>
      </div>

      {clases.length === 0 ? (
        <div className="rounded-3xl bg-[#1a2b24] border border-[#2d463b] p-10 text-center">
          <EventBusyOutlinedIcon
            sx={{
              color: "#4adea8",
              fontSize: 38,
            }}
          />

          <h3 className="text-xl font-bold mt-4">
            Sin clases configuradas
          </h3>

          <p className="text-gray-400 mt-2">
            Este grupo todavía no tiene clases asignadas.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {clases.map((clase) => {
            const porcentaje =
              clase.cupoMaximo > 0
                ? Math.min(
                    100,
                    Math.round(
                      (clase.inscriptos * 100) /
                        clase.cupoMaximo,
                    ),
                  )
                : 0;

            return (
              <article
                key={clase.id}
                className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-5 hover:border-[#4adea8]/40 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span
                      className={`inline-flex px-3 py-1 rounded-full border text-xs font-bold ${
                        clase.activa
                          ? "bg-[#4adea8]/10 border-[#4adea8]/30 text-[#4adea8]"
                          : "bg-red-500/10 border-red-500/30 text-red-400"
                      }`}
                    >
                      {clase.activa
                        ? "ACTIVA"
                        : "INACTIVA"}
                    </span>

                    <h3 className="text-2xl font-bold mt-3">
                      {clase.diaSemana}
                    </h3>
                  </div>

                  <div className="w-11 h-11 rounded-2xl bg-[#4adea8]/10 border border-[#4adea8]/20 flex items-center justify-center">
                    <CalendarMonthOutlinedIcon
                      sx={{ color: "#4adea8" }}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 mt-5">
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
                    icono={<GroupsOutlinedIcon />}
                    titulo="Alumnos"
                    valor={`${clase.inscriptos}/${clase.cupoMaximo}`}
                  />
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">
                      Ocupación
                    </span>

                    <span className="font-semibold">
                      {porcentaje}%
                    </span>
                  </div>

                  <div className="h-2 mt-2 rounded-full bg-[#12201b] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#4adea8]"
                      style={{
                        width: `${porcentaje}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 mt-5">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/entrenador/clases/${clase.id}`,
                      )
                    }
                    className="h-12 rounded-xl bg-[#12201b] border border-[#2d463b] font-semibold flex items-center justify-center gap-2 hover:border-[#4adea8] transition-all"
                  >
                    Ver clase
                    <ArrowForwardOutlinedIcon fontSize="small" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/entrenador/clases/${clase.id}/asistencia`,
                      )
                    }
                    className="h-12 rounded-xl bg-[#4adea8] text-[#12201b] font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                  >
                    <FactCheckOutlinedIcon fontSize="small" />
                    Asistencia
                  </button>
                </div>
              </article>
            );
          })}
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
  icono: React.ReactNode;
  titulo: string;
  valor: string;
}) {
  return (
    <div className="rounded-2xl bg-[#12201b] border border-[#2d463b] p-4">
      <div className="text-[#4adea8]">
        {icono}
      </div>

      <p className="text-xs text-gray-500 mt-3">
        {titulo}
      </p>

      <p className="font-semibold mt-1">
        {valor}
      </p>
    </div>
  );
}

function formatearHora(hora?: string) {
  return hora?.substring(0, 5) ?? "--:--";
}
