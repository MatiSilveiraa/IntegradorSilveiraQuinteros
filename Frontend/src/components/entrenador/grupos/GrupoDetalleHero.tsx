import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

type Props = {
  nombre: string;
  nivel: string;
  estado: string;
  cantidadAlumnos: number;
  cantidadClases: number;
};

export default function GrupoDetalleHero({
  nombre,
  nivel,
  estado,
  cantidadAlumnos,
  cantidadClases,
}: Props) {
  return (
    <section
      className="
        bg-[#1a2b24]
        border
        border-[#2d463b]
        rounded-3xl
        p-6
        lg:p-8
        mb-8
      "
    >
      <div
        className="
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-8
        "
      >
        {/* Información principal */}

        <div className="flex items-center gap-5">
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

          <div>
            <span
              className="
                inline-flex
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
              GRUPO
            </span>

            <h1
              className="
                text-3xl
                lg:text-5xl
                font-bold
                leading-tight
              "
            >
              {nombre}
            </h1>

            <p className="text-gray-400 mt-2">
              Nivel {nivel}
            </p>

            <div className="mt-3">
              <span
                className={`
                  px-3
                  py-1
                  rounded-full
                  text-sm
                  font-semibold

                  ${
                    estado === "ACTIVO"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }
                `}
              >
                {estado}
              </span>
            </div>
          </div>
        </div>

        {/* Resumen */}

        <div
          className="
            grid
            grid-cols-2
            gap-5
            w-full
            lg:w-auto
          "
        >
          <div className="flex items-center gap-3">
            <GroupsOutlinedIcon sx={{ color: "#4adea8" }} />

            <div>
              <p className="text-gray-400 text-sm">
                Alumnos
              </p>

              <p className="font-bold text-xl">
                {cantidadAlumnos}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CalendarMonthOutlinedIcon
              sx={{ color: "#4adea8" }}
            />

            <div>
              <p className="text-gray-400 text-sm">
                Clases
              </p>

              <p className="font-bold text-xl">
                {cantidadClases}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CheckCircleOutlineOutlinedIcon
              sx={{ color: "#4adea8" }}
            />

            <div>
              <p className="text-gray-400 text-sm">
                Estado
              </p>

              <p className="font-bold">
                {estado}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <FitnessCenterOutlinedIcon
              sx={{ color: "#4adea8" }}
            />

            <div>
              <p className="text-gray-400 text-sm">
                Nivel
              </p>

              <p className="font-bold">
                {nivel}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}