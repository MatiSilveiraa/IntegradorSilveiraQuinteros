import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";

type Props = {
  nombre: string;
  apellido: string;
  presente?: boolean;
};

export default function AlumnoClaseCard({
  nombre,
  apellido,
  presente,
}: Props) {
  return (
    <div
      className="
        flex
        flex-col
        md:flex-row
        md:items-center
        md:justify-between
        gap-5
        rounded-2xl
        border
        border-[#2d463b]
        bg-[#22372f]
        p-5
        hover:border-[#4adea8]
        transition
      "
    >
      <div className="flex items-center gap-4">

        <div
          className="
            w-14
            h-14
            rounded-full
            bg-[#12201b]
            flex
            items-center
            justify-center
          "
        >
          <PersonOutlineOutlinedIcon
            sx={{
              color: "#4adea8",
            }}
          />
        </div>

        <div>

          <h3 className="font-bold text-lg">

            {nombre} {apellido}

          </h3>

          <span
            className={`
              text-sm
              font-semibold

              ${
                presente === true
                  ? "text-green-400"
                  : presente === false
                  ? "text-red-400"
                  : "text-gray-400"
              }
            `}
          >
            {presente === true
              ? "Presente"
              : presente === false
              ? "Ausente"
              : "Sin registrar"}
          </span>

        </div>

      </div>

      <button
        className="
          flex
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-[#4adea8]
          text-[#12201b]
          px-5
          py-3
          font-semibold
          hover:bg-[#6ef3bc]
          transition
        "
      >
        Ver perfil

        <ArrowForwardOutlinedIcon />

      </button>

    </div>
  );
}