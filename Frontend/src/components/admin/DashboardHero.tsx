import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import WavingHandOutlinedIcon from "@mui/icons-material/WavingHandOutlined";

export default function DashboardHero() {
  const fecha = new Date();

  return (
    <div
      className="
        grid
        grid-cols-1
        xl:grid-cols-[minmax(0,1fr)_320px]
        gap-4
        sm:gap-6
        mb-8
        w-full
        min-w-0
      "
    >
      {/* BIENVENIDA */}

      <div
        className="
          w-full
          min-w-0
          overflow-hidden
          rounded-3xl
          border
          border-[#2d463b]
          bg-gradient-to-r
          from-[#1a2b24]
          to-[#12201b]
          p-5
          sm:p-8
          lg:p-10
        "
      >
        <div
          className="
            flex
            items-start
            gap-3
            min-w-0
          "
        >
          <WavingHandOutlinedIcon
            sx={{
              color: "#4adea8",
              fontSize: {
                xs: 30,
                sm: 40,
              },
              flexShrink: 0,
              marginTop: "3px",
            }}
          />

          <h1
            className="
              min-w-0
              text-2xl
              sm:text-3xl
              lg:text-4xl
              font-black
              leading-tight
              break-words
            "
          >
            Bienvenido Administrador
          </h1>
        </div>

        <p
          className="
            mt-4
            max-w-2xl
            text-sm
            sm:text-base
            lg:text-lg
            leading-relaxed
            text-gray-400
            break-words
          "
        >
          Gestioná alumnos, grupos, clases, pagos, desafíos y todo el
          funcionamiento del gimnasio desde un único lugar.
        </p>
      </div>

      {/* FECHA */}

      <div
        className="
          w-full
          min-w-0
          overflow-hidden
          rounded-3xl
          border
          border-[#2d463b]
          bg-[#1a211d]
          p-5
          sm:p-7
          flex
          items-center
          gap-4
          sm:gap-5
        "
      >
        <div
          className="
            w-12
            h-12
            sm:w-16
            sm:h-16
            shrink-0
            rounded-2xl
            bg-[#4adea8]/10
            flex
            items-center
            justify-center
          "
        >
          <CalendarMonthOutlinedIcon
            sx={{
              color: "#4adea8",
              fontSize: {
                xs: 28,
                sm: 38,
              },
            }}
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm sm:text-base text-gray-400">
            Fecha
          </p>

          <h2
            className="
              mt-1
              text-lg
              sm:text-xl
              xl:text-2xl
              font-bold
              leading-tight
              text-[#4adea8]
              break-words
            "
          >
            {fecha.toLocaleDateString("es-UY", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </h2>
        </div>
      </div>
    </div>
  );
}