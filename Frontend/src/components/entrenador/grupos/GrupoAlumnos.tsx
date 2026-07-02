import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import MonitorWeightOutlinedIcon from "@mui/icons-material/MonitorWeightOutlined";
import HeightOutlinedIcon from "@mui/icons-material/HeightOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";

import type { AlumnoGrupo } from "../../../types/grupoDetalle";

type Props = {

    alumnos: AlumnoGrupo[];

};

export default function GrupoAlumnos({

    alumnos,

}: Props) {

    return (

        <section className="mb-10">

            <div className="flex items-center justify-between mb-6">

                <h2 className="text-2xl font-bold">

                    Alumnos inscriptos

                </h2>

                <span
                    className="
                        bg-[#4adea8]
                        text-[#12201b]
                        px-3
                        py-1
                        rounded-full
                        text-sm
                        font-bold
                    "
                >

                    {alumnos.length}

                </span>

            </div>

            <div
                className="
                    grid
                    md:grid-cols-2
                    xl:grid-cols-3
                    gap-6
                "
            >

                {

                    alumnos.map(alumno => (

                        <div
                            key={alumno.id}
                            className="
                                bg-[#1a2b24]
                                border
                                border-[#2d463b]
                                rounded-3xl
                                p-6
                                hover:border-[#4adea8]
                                transition-all
                            "
                        >

                            <div className="flex justify-between mb-5">

                                <div className="flex items-center gap-4">

                                    <div
                                        className="
                                            w-14
                                            h-14
                                            rounded-full
                                            bg-[#22372f]
                                            flex
                                            items-center
                                            justify-center
                                        "
                                    >

                                        <PersonOutlinedIcon
                                            sx={{
                                                color:"#4adea8",
                                                fontSize:30
                                            }}
                                        />

                                    </div>

                                    <div>

                                        <h3 className="font-bold text-lg">

                                            {alumno.nombre} {alumno.apellido}

                                        </h3>

                                        {

                                            alumno.bloqueado ?

                                            <span className="text-red-400 text-sm flex items-center gap-1">

                                                <LockOutlinedIcon fontSize="small"/>

                                                Bloqueado

                                            </span>

                                            :

                                            <span className="text-green-400 text-sm flex items-center gap-1">

                                                <LockOpenOutlinedIcon fontSize="small"/>

                                                Activo

                                            </span>

                                        }

                                    </div>

                                </div>

                            </div>

                            <div className="space-y-3">

                                <div className="flex items-center gap-3">

                                    <MonitorWeightOutlinedIcon sx={{color:"#4adea8"}}/>

                                    <span>

                                        Peso

                                    </span>

                                    <span className="ml-auto font-semibold">

                                        {alumno.peso ?? "-"} kg

                                    </span>

                                </div>

                                <div className="flex items-center gap-3">

                                    <HeightOutlinedIcon sx={{color:"#4adea8"}}/>

                                    <span>

                                        Estatura

                                    </span>

                                    <span className="ml-auto font-semibold">

                                        {alumno.estatura ?? "-"} m

                                    </span>

                                </div>

                                <div className="flex items-center gap-3">

                                    <FavoriteBorderOutlinedIcon sx={{color:"#4adea8"}}/>

                                    <span>

                                        IMC

                                    </span>

                                    <span className="ml-auto font-semibold">

                                        {alumno.imc ?? "-"}

                                    </span>

                                </div>

                            </div>

                        </div>

                    ))

                }

            </div>

        </section>

    );

}