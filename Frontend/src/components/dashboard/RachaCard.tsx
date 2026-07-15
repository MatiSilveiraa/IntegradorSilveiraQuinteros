import { useNavigate } from "react-router-dom";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";

import Card from "../ui/Card";

type Props = {
  racha?: number;
};

const OBJETIVO_RACHA = 10;

export default function RachaCard({ racha }: Props) {
  const navigate = useNavigate();

  const valor = racha ?? 0;
  const progreso = Math.min((valor / OBJETIVO_RACHA) * 100, 100);
  const restantes = Math.max(OBJETIVO_RACHA - valor, 0);

  const colorIcono = valor >= OBJETIVO_RACHA ? "#4adea8" : "#f97316";

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[#4adea8] text-sm font-bold uppercase tracking-wide">
            Racha mensual
          </p>

          <div className="flex items-end gap-2 mt-4">
            <p className="text-5xl font-bold text-white">{valor}</p>

            <p className="text-gray-400 pb-1">
              {valor === 1 ? "asistencia" : "asistencias"}
            </p>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-gray-400">Progreso del mes</span>

              <span className="text-white font-semibold">
                {valor}/{OBJETIVO_RACHA}
              </span>
            </div>

            <div className="h-3 mt-3 rounded-full bg-[#12201b] border border-[#2d463b] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#4adea8] transition-all duration-500"
                style={{ width: `${progreso}%` }}
              />
            </div>
          </div>

          <p className="text-gray-400 mt-4">
            {valor >= OBJETIVO_RACHA
              ? "¡Completaste el objetivo mensual!"
              : restantes === 1
                ? "Te falta 1 asistencia para completar el objetivo."
                : `Te faltan ${restantes} asistencias para completar el objetivo.`}
          </p>

          <button
            type="button"
            onClick={() => navigate("/alumno/asistencias")}
            className="mt-6 px-5 py-3 rounded-xl bg-[#12201b] border border-[#2d463b] text-gray-200 font-bold hover:border-[#4adea8] hover:text-[#4adea8] transition-all"
          >
            Ver asistencias
          </button>
        </div>

        <div
          className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center border ${
            valor >= OBJETIVO_RACHA
              ? "bg-[#4adea8]/10 border-[#4adea8]/30"
              : "bg-orange-500/10 border-orange-500/30"
          }`}
        >
          <LocalFireDepartmentRoundedIcon
            sx={{
              color: colorIcono,
              fontSize: 32,
            }}
          />
        </div>
      </div>
    </Card>
  );
}
