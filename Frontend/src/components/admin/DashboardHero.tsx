import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import WavingHandOutlinedIcon from "@mui/icons-material/WavingHandOutlined";

export default function DashboardHero() {
  const fecha = new Date();

  return (
    <div className="grid xl:grid-cols-[1fr_320px] gap-6 mb-8">

      <div
        className="
          rounded-3xl
          border
          border-[#2d463b]
          bg-gradient-to-r
          from-[#1a2b24]
          to-[#12201b]
          p-10
        "
      >
        <div className="flex items-center gap-3">

          <WavingHandOutlinedIcon
            sx={{
              color: "#4adea8",
              fontSize: 40,
            }}
          />

          <h1 className="text-4xl font-black">
            Bienvenido Administrador
          </h1>

        </div>

        <p className="text-gray-400 text-lg mt-4 max-w-2xl">
          Gestioná alumnos, grupos, clases, pagos, desafíos y todo el
          funcionamiento del gimnasio desde un único lugar.
        </p>
      </div>

      <div
        className="
          rounded-3xl
          border
          border-[#2d463b]
          bg-[#1a211d]
          p-7
          flex
          items-center
          gap-5
        "
      >
        <div
          className="
            w-16
            h-16
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
              fontSize: 38,
            }}
          />
        </div>

        <div>

          <p className="text-gray-400">
            Fecha
          </p>

          <h2 className="text-2xl font-bold text-[#4adea8]">
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