import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import MonitorWeightOutlinedIcon from "@mui/icons-material/MonitorWeightOutlined";
import HeightOutlinedIcon from "@mui/icons-material/HeightOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";

import type { AlumnoGrupo } from "../../../types/grupoDetalle";

type Props = {
  alumnos: AlumnoGrupo[];
};

export default function GrupoAlumnos({
  alumnos,
}: Props) {
  return (
    <section>
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <p className="text-[#4adea8] text-xs font-bold uppercase tracking-wide">
            Plantel
          </p>

          <h2 className="text-2xl font-bold mt-1">
            Alumnos inscriptos
          </h2>
        </div>

        <span className="px-3 py-1 rounded-full bg-[#4adea8]/10 border border-[#4adea8]/30 text-[#4adea8] text-sm font-bold">
          {alumnos.length}
        </span>
      </div>

      {alumnos.length === 0 ? (
        <div className="rounded-3xl bg-[#1a2b24] border border-[#2d463b] p-10 text-center">
          <PeopleOutlineOutlinedIcon
            sx={{
              color: "#4adea8",
              fontSize: 38,
            }}
          />

          <h3 className="text-xl font-bold mt-4">
            Sin alumnos inscriptos
          </h3>

          <p className="text-gray-400 mt-2">
            Todavía no hay alumnos en este grupo.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {alumnos.map((alumno) => (
            <article
              key={alumno.id}
              className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-5 hover:border-[#4adea8]/40 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 shrink-0 rounded-full bg-[#4adea8]/10 border border-[#4adea8]/30 flex items-center justify-center">
                  <PersonOutlinedIcon
                    sx={{ color: "#4adea8" }}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-bold break-words">
                    {alumno.nombre} {alumno.apellido}
                  </h3>

                  <span
                    className={`inline-flex items-center gap-1 text-sm mt-1 ${
                      alumno.bloqueado
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {alumno.bloqueado ? (
                      <LockOutlinedIcon fontSize="small" />
                    ) : (
                      <LockOpenOutlinedIcon fontSize="small" />
                    )}

                    {alumno.bloqueado
                      ? "Bloqueado"
                      : "Activo"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-5">
                <DatoAlumno
                  icono={<MonitorWeightOutlinedIcon />}
                  titulo="Peso"
                  valor={
                    alumno.peso != null
                      ? `${alumno.peso} kg`
                      : "Sin dato"
                  }
                />

                <DatoAlumno
                  icono={<HeightOutlinedIcon />}
                  titulo="Estatura"
                  valor={
                    alumno.estatura != null
                      ? `${alumno.estatura} m`
                      : "Sin dato"
                  }
                />

                <DatoAlumno
                  icono={<FavoriteBorderOutlinedIcon />}
                  titulo="IMC"
                  valor={
                    alumno.imc != null
                      ? String(alumno.imc)
                      : "Sin dato"
                  }
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function DatoAlumno({
  icono,
  titulo,
  valor,
}: {
  icono: React.ReactNode;
  titulo: string;
  valor: string;
}) {
  return (
    <div className="rounded-2xl bg-[#12201b] border border-[#2d463b] p-3 min-w-0">
      <div className="text-[#4adea8]">
        {icono}
      </div>

      <p className="text-[11px] text-gray-500 mt-2">
        {titulo}
      </p>

      <p className="text-sm font-semibold mt-1 truncate">
        {valor}
      </p>
    </div>
  );
}
