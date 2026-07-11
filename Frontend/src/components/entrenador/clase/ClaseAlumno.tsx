import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import { useMemo, useState } from "react";

import type { AlumnoClase } from "../../../types/claseDetalle";

type Props = {
  alumnos: AlumnoClase[];
};

export default function ClaseAlumnos({ alumnos }: Props) {
  const [busqueda, setBusqueda] = useState("");

  const alumnosFiltrados = useMemo(() => {
    return alumnos.filter((a) =>
      `${a.nombre} ${a.apellido}`
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    );
  }, [alumnos, busqueda]);

  return (
    <section
      className="
        bg-[#1a2b24]
        border
        border-[#2d463b]
        rounded-3xl
        p-8
      "
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
        <div>
          <h2 className="text-3xl font-bold">
            Alumnos
          </h2>

          <p className="text-gray-400 mt-1">
            {alumnos.length} inscriptos
          </p>
        </div>

        <div
          className="
            flex
            items-center
            gap-3
            bg-[#12201b]
            border
            border-[#2d463b]
            rounded-xl
            px-4
            py-3
            w-full
            md:w-80
          "
        >
          <SearchOutlinedIcon className="text-gray-400" />

          <input
            type="text"
            placeholder="Buscar alumno..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="
              bg-transparent
              outline-none
              flex-1
            "
          />
        </div>
      </div>

      {alumnosFiltrados.length === 0 ? (
        <div
          className="
            py-16
            text-center
            text-gray-400
          "
        >
          No se encontraron alumnos.
        </div>
      ) : (
        <div className="space-y-4">
          {alumnosFiltrados.map((alumno) => (
            <div
              key={alumno.id}
              className="
                bg-[#22372f]
                border
                border-[#2d463b]
                rounded-2xl
                p-5
                flex
                flex-col
                md:flex-row
                md:items-center
                md:justify-between
                gap-4
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
                      fontSize: 30,
                    }}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-semibold">
                    {alumno.nombre} {alumno.apellido}
                  </h3>

                  <p className="text-gray-400">
                    ID #{alumno.id}
                  </p>
                </div>
              </div>

              <div>
                {alumno.presente ? (
                  <span
                    className="
                      flex
                      items-center
                      gap-2
                      text-green-400
                      font-semibold
                    "
                  >
                    <CheckCircleOutlinedIcon />

                    Presente
                  </span>
                ) : (
                  <span
                    className="
                      flex
                      items-center
                      gap-2
                      text-red-400
                      font-semibold
                    "
                  >
                    <HighlightOffOutlinedIcon />

                    Sin asistencia
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}