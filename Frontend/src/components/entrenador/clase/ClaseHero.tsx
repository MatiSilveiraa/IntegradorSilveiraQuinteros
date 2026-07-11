import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";

type Props = {
  grupo: string;
  dia: string;
  horaInicio: string;
  horaFin: string;
};

export default function ClaseHero({
  grupo,
  dia,
  horaInicio,
  horaFin,
}: Props) {
  return (
    <section
      className="
        rounded-3xl
        border
        border-[#2d463b]
        bg-gradient-to-r
        from-[#183028]
        to-[#22372f]
        p-6
        md:p-8
        mb-8
      "
    >
      <div
        className="
          flex
          flex-col
          md:flex-row
          md:items-center
          gap-6
        "
      >
        <div
          className="
            w-20
            h-20
            rounded-3xl
            bg-[#12201b]
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
              px-4
              py-1
              rounded-full
              bg-[#4adea8]
              text-[#12201b]
              font-bold
              text-sm
              mb-3
            "
          >
            CLASE
          </span>

          <h1 className="text-3xl md:text-5xl font-bold">

            {grupo}

          </h1>

          <div
            className="
              flex
              flex-wrap
              gap-6
              mt-5
              text-gray-300
            "
          >

            <div className="flex items-center gap-2">

              <CalendarMonthOutlinedIcon
                sx={{
                  color: "#4adea8",
                }}
              />

              {dia}

            </div>

            <div className="flex items-center gap-2">

              <AccessTimeOutlinedIcon
                sx={{
                  color: "#4adea8",
                }}
              />

              {horaInicio.substring(0,5)}
              {" - "}
              {horaFin.substring(0,5)}

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}