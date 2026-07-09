import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import EventSeatOutlinedIcon from "@mui/icons-material/EventSeatOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PinDropOutlinedIcon from "@mui/icons-material/PinDropOutlined";

type Props = {
  inscriptos: number;
  disponibles: number;
  radio: number;
  codigoPostal: string;
};

export default function ClaseResumen({
  inscriptos,
  disponibles,
  radio,
  codigoPostal,
}: Props) {

  const cards = [
    {
      titulo: "Inscriptos",
      valor: inscriptos,
      icono: <GroupsOutlinedIcon sx={{ color:"#4adea8",fontSize:28 }}/>,
    },
    {
      titulo: "Disponibles",
      valor: disponibles,
      icono: <EventSeatOutlinedIcon sx={{ color:"#4adea8",fontSize:28 }}/>,
    },
    {
      titulo: "Radio GPS",
      valor: `${radio} m`,
      icono: <LocationOnOutlinedIcon sx={{ color:"#4adea8",fontSize:28 }}/>,
    },
    {
      titulo: "Código Postal",
      valor: codigoPostal,
      icono: <PinDropOutlinedIcon sx={{ color:"#4adea8",fontSize:28 }}/>,
    },
  ];

  return (

    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

      {cards.map((card)=>(
        <div
          key={card.titulo}
          className="
            bg-[#1a2b24]
            border
            border-[#2d463b]
            rounded-3xl
            p-6
          "
        >
          <div className="flex justify-between items-start">

            <div>

              <p className="text-gray-400 text-sm">
                {card.titulo}
              </p>

              <h2 className="text-3xl font-bold mt-3">
                {card.valor}
              </h2>

            </div>

            {card.icono}

          </div>

        </div>
      ))}

    </section>

  );
}