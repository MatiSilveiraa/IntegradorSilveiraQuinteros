import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

type Props = {
  grupo: string;
  dia: string;
  horaInicio: string;
  horaFin: string;
};

export default function ClaseDetalleHero({
  grupo,
  dia,
  horaInicio,
  horaFin,
}: Props) {
  return (
    <section
      className="
        bg-[#1a2b24]
        border
        border-[#2d463b]
        rounded-3xl
        p-6
        mb-8
      "
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        <div
          className="
            w-20
            h-20
            rounded-3xl
            bg-[#22372f]
            flex
            items-center
            justify-center
            shrink-0
          "
        >
          <FitnessCenterOutlinedIcon
            sx={{
              fontSize: 42,
              color: "#4adea8",
            }}
          />
        </div>

        <div className="flex-1">
          <span
            className="
              inline-block
              mb-2
              rounded-full
              bg-[#4adea8]
              px-4
              py-1
              text-sm
              font-bold
              text-[#12201b]
            "
          >
            CLASE
          </span>

          <h1 className="text-4xl font-bold">
            {grupo}
          </h1>

          <div className="flex flex-wrap gap-6 mt-4 text-gray-300">

            <div className="flex items-center gap-2">
              <CalendarMonthOutlinedIcon
                sx={{ color: "#4adea8", fontSize: 22 }}
              />
              {dia}
            </div>

            <div className="flex items-center gap-2">
              <AccessTimeOutlinedIcon
                sx={{ color: "#4adea8", fontSize: 22 }}
              />
              {horaInicio.substring(0,5)} - {horaFin.substring(0,5)}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}