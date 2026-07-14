import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

import ClassLocationMap from "../../maps/ClassLocationMap";

import type {
  ClaseDisponibleEntrenador,
} from "../../../types/entrenadorClases";

type Props = {
  clase: ClaseDisponibleEntrenador | null;
  uniendose: boolean;
  onCerrar: () => void;
  onUnirme: (clase: ClaseDisponibleEntrenador) => void;
};

export default function ClaseDisponibleDetalleModal({
  clase,
  uniendose,
  onCerrar,
  onUnirme,
}: Props) {
  if (!clase) return null;

  const porcentaje =
    clase.cupoMaximo > 0
      ? Math.min(
          100,
          Math.round(
            (clase.cantidadAlumnos * 100) /
              clase.cupoMaximo,
          ),
        )
      : 0;

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Cerrar detalle"
        onClick={uniendose ? undefined : onCerrar}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
      />

      <section
        role="dialog"
        aria-modal="true"
        className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-[#2d463b] bg-[#17251f] shadow-2xl"
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#2d463b] bg-[#17251f]/95 p-5 backdrop-blur sm:p-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[#4adea8]/30 bg-[#4adea8]/10 px-3 py-1 text-[11px] font-bold text-[#4adea8]">
                {clase.estado}
              </span>

              {clase.tieneConflictoHorario && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-bold text-amber-300">
                  <WarningAmberOutlinedIcon sx={{ fontSize: 15 }} />
                  Posible conflicto
                </span>
              )}
            </div>

            <h2 className="mt-3 text-3xl font-bold text-white">
              {clase.grupo}
            </h2>

            <p className="mt-2 text-gray-400">
              Revisá todos los datos antes de unirte.
            </p>
          </div>

          <button
            type="button"
            disabled={uniendose}
            onClick={onCerrar}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-400 transition-all hover:bg-[#20362d] hover:text-white disabled:opacity-50"
            aria-label="Cerrar"
          >
            <CloseOutlinedIcon />
          </button>
        </header>

        <div className="grid gap-6 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Resumen
                icono={<CalendarMonthOutlinedIcon />}
                titulo="Día"
                valor={clase.diaSemana}
              />

              <Resumen
                icono={<AccessTimeOutlinedIcon />}
                titulo="Horario"
                valor={`${hora(clase.horaInicio)} - ${hora(
                  clase.horaFin,
                )}`}
              />

              <Resumen
                icono={<GroupsOutlinedIcon />}
                titulo="Entrenadores"
                valor={String(clase.cantidadEntrenadores)}
              />

              <Resumen
                icono={<LocationOnOutlinedIcon />}
                titulo="Radio"
                valor={`${clase.radioGeolocalizacion} m`}
              />
            </section>

            <section className="rounded-3xl border border-[#2d463b] bg-[#12201b] p-5">
              <h3 className="text-xl font-bold text-white">
                Vigencia
              </h3>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <FechaDato
                  titulo="Fecha de inicio"
                  valor={fecha(clase.fechaInicio)}
                />

                <FechaDato
                  titulo="Fecha de finalización"
                  valor={
                    clase.fechaFin
                      ? fecha(clase.fechaFin)
                      : "Sin fecha de finalización"
                  }
                />
              </div>
            </section>

            <section className="rounded-3xl border border-[#2d463b] bg-[#12201b] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Ocupación
                  </h3>

                  <p className="mt-1 text-sm text-gray-400">
                    Alumnos actualmente inscriptos.
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-white">
                    {clase.cantidadAlumnos}/{clase.cupoMaximo}
                  </p>

                  <p className="text-xs text-gray-500">
                    {porcentaje}% ocupado
                  </p>
                </div>
              </div>

              <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#1a2b24]">
                <div
                  className="h-full rounded-full bg-[#4adea8]"
                  style={{ width: `${porcentaje}%` }}
                />
              </div>

              <p className="mt-3 inline-flex items-center gap-2 text-sm text-gray-300">
                <PeopleOutlineOutlinedIcon
                  sx={{ color: "#4adea8", fontSize: 19 }}
                />
                {Math.max(
                  0,
                  clase.cupoMaximo - clase.cantidadAlumnos,
                )}{" "}
                lugares disponibles
              </p>
            </section>

            {clase.tieneConflictoHorario && (
              <section className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-5">
                <div className="flex items-start gap-3">
                  <WarningAmberOutlinedIcon
                    sx={{ color: "#fbbf24" }}
                  />

                  <div>
                    <h3 className="font-bold text-amber-200">
                      Posible conflicto de horario
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-amber-100">
                      Esta advertencia es informativa. Podés intentar
                      unirte y, si el conflicto continúa vigente, el
                      sistema te pedirá confirmación.
                    </p>
                  </div>
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-5">
            <section className="rounded-3xl border border-[#2d463b] bg-[#12201b] p-4">
              <div className="flex items-center gap-2">
                <LocationOnOutlinedIcon
                  sx={{ color: "#4adea8" }}
                />

                <div>
                  <h3 className="font-bold text-white">
                    Ubicación
                  </h3>

                  <p className="text-xs text-gray-500">
                    Código postal {clase.codigoPostal || "no informado"}
                  </p>
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl">
                <ClassLocationMap
                  latitud={clase.latitud}
                  longitud={clase.longitud}
                  radio={clase.radioGeolocalizacion}
                  editable={false}
                />
              </div>

              <p className="mt-3 text-xs leading-relaxed text-gray-400">
                El círculo representa el radio configurado para esta
                clase.
              </p>
            </section>

            <button
              type="button"
              disabled={uniendose}
              onClick={() => onUnirme(clase)}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#4adea8] font-bold text-[#12201b] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <PersonAddAltOutlinedIcon fontSize="small" />
              {uniendose
                ? "Procesando..."
                : clase.tieneConflictoHorario
                  ? "Intentar unirme"
                  : "Unirme a la clase"}
            </button>
          </aside>
        </div>
      </section>
    </div>
  );
}

function Resumen({
  icono,
  titulo,
  valor,
}: {
  icono: React.ReactNode;
  titulo: string;
  valor: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-[#2d463b] bg-[#12201b] p-4">
      <div className="text-[#4adea8]">{icono}</div>
      <p className="mt-3 text-xs text-gray-500">{titulo}</p>
      <p className="mt-1 break-words text-sm font-semibold text-white">
        {valor}
      </p>
    </div>
  );
}

function FechaDato({
  titulo,
  valor,
}: {
  titulo: string;
  valor: string;
}) {
  return (
    <div className="rounded-2xl border border-[#2d463b] bg-[#1a2b24] p-4">
      <p className="text-xs text-gray-500">{titulo}</p>
      <p className="mt-1 font-semibold text-white">{valor}</p>
    </div>
  );
}

function hora(value: string) {
  return value?.substring(0, 5) ?? "--:--";
}

function fecha(value: string) {
  return new Date(value).toLocaleDateString("es-UY", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "America/Montevideo",
  });
}
