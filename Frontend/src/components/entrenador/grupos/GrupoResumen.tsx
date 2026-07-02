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
            icono: <GroupsOutlinedIcon sx={{ fontSize: 34 }} />,
        },

        {
            titulo: "Clases",
            valor: cantidadClases,
            icono: <CalendarMonthOutlinedIcon sx={{ fontSize: 34 }} />,
        },

        {
            titulo: "Estado",
            valor: estado,
            icono: <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 34 }} />,
        },

        {
            titulo: "Nivel",
            valor: nivel,
            icono: <FitnessCenterOutlinedIcon sx={{ fontSize: 34 }} />,
        },

    ];

    return (

        <section
            className="
                grid
                grid-cols-2
                xl:grid-cols-4
                gap-5
                mb-8
            "
        >

            {

                cards.map(card => (

                    <div
                        key={card.titulo}
                        className="
                            bg-[#1a2b24]
                            border
                            border-[#2d463b]
                            rounded-3xl
                            p-6
                            transition-all
                            hover:border-[#4adea8]
                        "
                    >

                        <div
                            className="
                                flex
                                justify-between
                                items-start
                                mb-6
                            "
                        >

                            <div>

                                <p className="text-gray-400">

                                    {card.titulo}

                                </p>

                                <h2
                                    className="
                                        text-3xl
                                        font-bold
                                        mt-2
                                    "
                                >
                                    {card.valor}
                                </h2>

                            </div>

                            <div className="text-[#4adea8]">

                                {card.icono}

                            </div>

                        </div>

                    </div>

                ))

            }

        </section>

    );

}