import { useNavigate } from "react-router-dom";

import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";

import type { ClaseGrupo } from "../../../types/grupoDetalle";

type Props = {
  nombre: string;
  nivel: string;
  estado: string;
  cantidadAlumnos: number;
  cantidadClases: number;
  proximaClase?: ClaseGrupo;
};

export default function GrupoDetalleHero({
  nombre,
  nivel,
  estado,
  cantidadAlumnos,
  cantidadClases,
  proximaClase,
}: Props) {
  const navigate = useNavigate();
  const activo =
    estado.toUpperCase() === "ACTIVO";

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1a2b24] to-[#163129] border border-[#4adea8]/20 rounded-3xl p-6 lg:p-8 mb-8">
      <div className="absolute -right-16 -top-20 w-64 h-64 rounded-full bg-[#4adea8]/5 blur-2xl" />

      <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-center">
        <div>
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-3xl bg-[#4adea8]/10 border border-[#4adea8]/30 flex items-center justify-center">
              <FitnessCenterOutlinedIcon
                sx={{
                  fontSize: 40,
                  color: "#4adea8",
                }}
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#4adea8]/10 border border-[#4adea8]/30 text-[#4adea8] text-xs font-bold uppercase">
                  Grupo
                </span>

                <span
                  className={`px-3 py-1 rounded-full border text-xs font-bold ${
                    activo
                      ? "bg-green-500/10 border-green-500/30 text-green-300"
                      : "bg-amber-500/10 border-amber-500/30 text-amber-300"
                  }`}
                >
                  {estado}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 break-words">
                {nombre}
              </h1>

              <p className="text-gray-300 mt-2">
                Nivel {nivel}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-7 max-w-lg">
            <InfoHero
              icono={<GroupsOutlinedIcon />}
              titulo="Alumnos"
              valor={cantidadAlumnos}
            />

            <InfoHero
              icono={<CalendarMonthOutlinedIcon />}
              titulo="Clases"
              valor={cantidadClases}
            />
          </div>
        </div>

        <div className="rounded-3xl bg-[#12201b]/90 border border-[#2d463b] p-5 sm:p-6">
          <p className="text-[#4adea8] text-xs font-bold uppercase tracking-wide">
            Próxima clase
          </p>

          {proximaClase ? (
            <>
              <h2 className="text-2xl font-bold mt-3">
                {proximaClase.diaSemana}
              </h2>

              <div className="flex items-center gap-2 text-gray-300 mt-2">
                <AccessTimeOutlinedIcon fontSize="small" />

                <span>
                  {formatearHora(
                    proximaClase.horaInicio,
                  )}{" "}
                  -{" "}
                  {formatearHora(
                    proximaClase.horaFin,
                  )}
                </span>
              </div>

              <p className="text-sm text-gray-400 mt-3">
                {proximaClase.inscriptos}/
                {proximaClase.cupoMaximo} alumnos inscriptos
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/entrenador/clases/${proximaClase.id}/asistencia`,
                  )
                }
                className="w-full h-12 mt-5 rounded-xl bg-[#4adea8] text-[#12201b] font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all"
              >
                <FactCheckOutlinedIcon fontSize="small" />
                Tomar asistencia
              </button>
            </>
          ) : (
            <p className="text-gray-400 mt-3">
              No hay una próxima clase activa.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function InfoHero({
  icono,
  titulo,
  valor,
}: {
  icono: React.ReactNode;
  titulo: string;
  valor: number;
}) {
  return (
    <div className="rounded-2xl bg-[#12201b]/80 border border-[#2d463b] p-4">
      <div className="text-[#4adea8]">{icono}</div>

      <p className="text-2xl font-bold mt-3">
        {valor}
      </p>

      <p className="text-xs text-gray-400 mt-1">
        {titulo}
      </p>
    </div>
  );
}

function formatearHora(hora?: string) {
  return hora?.substring(0, 5) ?? "--:--";
}
