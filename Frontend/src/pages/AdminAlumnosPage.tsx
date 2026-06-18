import { useEffect, useState } from "react";

import {
  obtenerAlumnos,
  obtenerAlumno,
  eliminarAlumno,
} from "../services/AdminAlumno.Service";

import type { Alumno } from "../types";
import toast from "react-hot-toast";

export default function AdminAlumnosPage() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);

  const [detalle, setDetalle] = useState<Alumno | null>(null);

  const cargarDatos = async () => {
    try {
      const data = await obtenerAlumnos();

      setAlumnos(data);
    } catch (error) {
      console.error(error);

      toast.error("No fue posible cargar los alumnos");
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const verDetalle = async (alumnoId: number) => {
    try {
      const data = await obtenerAlumno(alumnoId);

      setDetalle(data);
    } catch (error) {
      console.error(error);

      toast.error("No fue posible obtener el detalle del alumno");
    }
  };

  const borrar = async (alumnoId: number) => {
    if (!confirm("¿Eliminar alumno?")) {
      return;
    }

    try {
      await eliminarAlumno(alumnoId);

      cargarDatos();
      toast.success("Alumno eliminado correctamente");
    } catch (error) {
      console.error(error);

      toast.error("No fue posible eliminar el alumno");
    }
  };

  return (
    <div className="min-h-screen bg-[#12201b] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Alumnos</h1>

        <p className="text-gray-400 mb-8">Gestión de alumnos registrados.</p>

        <div className="grid gap-4">
          {alumnos.map((alumno) => (
            <div
              key={alumno.id}
              className="
                  bg-[#1a2b24]
                  border
                  border-[#2d463b]
                  rounded-2xl
                  p-5
                "
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">
                    {alumno.nombre} {alumno.apellido}
                  </h3>

                  <p className="text-gray-400">{alumno.email}</p>

                  <span
                    className="
                        inline-block
                        mt-2
                        px-3
                        py-1
                        rounded-full
                        bg-green-500/10
                        text-green-400
                        text-xs
                      "
                  >
                    {alumno.estado}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => verDetalle(alumno.id)}
                    className="
                        px-3
                        py-2
                        rounded-lg
                        bg-blue-500/20
                        text-blue-400
                      "
                  >
                    Ver
                  </button>

                  <button
                    onClick={() => borrar(alumno.id)}
                    className="
                        px-3
                        py-2
                        rounded-lg
                        bg-red-500/20
                        text-red-400
                      "
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {detalle && (
        <div
          className="
            fixed
            inset-0
            bg-black/60
            flex
            items-center
            justify-center
          "
        >
          <div
            className="
              w-full
              max-w-lg
              bg-[#1a2b24]
              rounded-2xl
              p-6
            "
          >
            <h2 className="text-2xl font-bold mb-5">Detalle Alumno</h2>

            <div className="space-y-3">
              <p>
                <strong>Nombre:</strong> {detalle.nombre}
              </p>

              <p>
                <strong>Apellido:</strong> {detalle.apellido}
              </p>

              <p>
                <strong>Email:</strong> {detalle.email}
              </p>

              <p>
                <strong>Estado:</strong> {detalle.estado}
              </p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setDetalle(null)}
                className="
                  px-4
                  py-2
                  rounded-lg
                  bg-[#4adea8]
                  text-[#12201b]
                  font-semibold
                "
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
