import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";

type Props = {
  nombre: string;
  nivel: string;
  estado: string;
};

export default function GrupoHeader({
  nombre,
  nivel,
  estado,
}: Props) {
  return (
    <section
      className="
        mb-10
        flex
        flex-col
        lg:flex-row
        justify-between
        gap-6
      "
    >
      <div className="flex items-center gap-5">

        <div
          className="
            w-20
            h-20
            rounded-3xl
            bg-[#1a2b24]
            border
            border-[#2d463b]
            flex
            items-center
            justify-center
          "
        >
          <FitnessCenterOutlinedIcon
            sx={{
              color: "#4adea8",
              fontSize: 40,
            }}
          />
        </div>

        <div>

          <h1
            className="
              text-4xl
              font-bold
            "
          >
            {nombre}
          </h1>

          <div className="flex items-center gap-3 mt-2">

            <span className="text-gray-400">
              {nivel}
            </span>

            <span className="text-gray-600">
              •
            </span>

            <span
              className="
                text-green-400
                font-semibold
              "
            >
              {estado}
            </span>

          </div>

        </div>

      </div>
    </section>
  );
}