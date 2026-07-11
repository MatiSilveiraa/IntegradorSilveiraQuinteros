import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";

type Props = {
  latitud: number;
  longitud: number;
};

export default function ClaseMapa({
  latitud,
  longitud,
}: Props) {

  return (

    <section
      className="
        bg-[#1a2b24]
        border
        border-[#2d463b]
        rounded-3xl
        p-6
        h-full
      "
    >

      <h2 className="text-2xl font-bold mb-6">

        Ubicación

      </h2>

      <div
        className="
          flex
          flex-col
          items-center
          justify-center
          text-center
          h-[220px]
        "
      >

        <LocationOnOutlinedIcon
          sx={{
            fontSize: 56,
            color: "#4adea8",
          }}
        />

        <p className="mt-4 text-gray-400">

          La clase utiliza geolocalización.

        </p>

        <a
          href={`https://www.openstreetmap.org/?mlat=${latitud}&mlon=${longitud}&zoom=17`}
          target="_blank"
          rel="noreferrer"
          className="
            mt-6
            flex
            items-center
            gap-2
            rounded-xl
            bg-[#4adea8]
            px-5
            py-3
            font-semibold
            text-[#12201b]
            hover:bg-[#6ef3bc]
            transition
          "
        >

          Ver mapa

          <OpenInNewOutlinedIcon />

        </a>

      </div>

    </section>

  );

}