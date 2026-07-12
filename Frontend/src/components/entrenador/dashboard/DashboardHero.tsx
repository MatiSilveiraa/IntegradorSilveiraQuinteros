import WavingHandOutlinedIcon from "@mui/icons-material/WavingHandOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";

type Props = {
  nombre?: string;
  clasesHoy: number;
};

export default function DashboardHero({
  nombre,
  clasesHoy,
}: Props) {
  const saludo = obtenerSaludo();

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#4adea8]/20 bg-gradient-to-br from-[#193128] via-[#173028] to-[#12201b] p-6 sm:p-8 lg:p-10 mb-8">
      <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-[#4adea8]/5 blur-2xl" />

      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4adea8]/10 border border-[#4adea8]/30 text-[#4adea8] text-xs font-bold uppercase tracking-wide">
            Panel del entrenador
          </p>

          <div className="flex items-start gap-3 mt-5">
            <WavingHandOutlinedIcon
              sx={{
                color: "#4adea8",
                fontSize: 36,
              }}
            />

            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                {saludo}, {nombre || "Entrenador"}
              </h1>

              <p className="text-gray-300 mt-3 text-base sm:text-lg leading-relaxed">
                Organizá tu jornada, revisá tus grupos y registrá asistencias
                desde un solo lugar.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-auto min-w-60 rounded-2xl bg-[#12201b]/80 border border-[#2d463b] p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#4adea8]/10 border border-[#4adea8]/30 flex items-center justify-center">
              <CalendarMonthOutlinedIcon
                sx={{ color: "#4adea8" }}
              />
            </div>

            <div>
              <p className="text-sm text-gray-400">
                Clases programadas hoy
              </p>

              <p className="text-3xl font-bold text-[#4adea8] mt-1">
                {clasesHoy}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function obtenerSaludo() {
  const hora = new Date().getHours();

  if (hora < 12) return "Buen día";
  if (hora < 19) return "Buenas tardes";

  return "Buenas noches";
}
