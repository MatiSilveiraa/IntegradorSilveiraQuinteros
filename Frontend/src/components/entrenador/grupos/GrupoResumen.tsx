import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";

type Props = {
  cantidadAlumnos: number;
  cantidadClases: number;
  estado: string;
  nivel: string;
};

export default function GrupoResumen({
  cantidadAlumnos,
  cantidadClases,
  estado,
  nivel,
}: Props) {
  const cards = [
    {
      titulo: "Alumnos",
      valor: cantidadAlumnos,
      descripcion:
        cantidadAlumnos === 1
          ? "Alumno inscripto"
          : "Alumnos inscriptos",
      icono: <GroupsOutlinedIcon />,
    },
    {
      titulo: "Clases",
      valor: cantidadClases,
      descripcion: "Clases semanales",
      icono: <CalendarMonthOutlinedIcon />,
    },
    {
      titulo: "Estado",
      valor: estado,
      descripcion: "Situación actual",
      icono: <CheckCircleOutlineOutlinedIcon />,
    },
    {
      titulo: "Nivel",
      valor: nivel,
      descripcion: "Nivel del grupo",
      icono: <FitnessCenterOutlinedIcon />,
    },
  ];

  return (
    <section className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => (
        <article
          key={card.titulo}
          className="bg-[#1a2b24] border border-[#2d463b] rounded-2xl p-5 hover:border-[#4adea8]/40 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-[#4adea8]/10 border border-[#4adea8]/20 text-[#4adea8] flex items-center justify-center">
            {card.icono}
          </div>

          <p className="text-sm text-gray-400 mt-4">
            {card.titulo}
          </p>

          <p className="text-xl sm:text-2xl font-bold mt-1 break-words">
            {card.valor}
          </p>

          <p className="text-xs text-gray-500 mt-2">
            {card.descripcion}
          </p>
        </article>
      ))}
    </section>
  );
}
