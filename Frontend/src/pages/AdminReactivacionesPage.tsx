import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  obtenerSolicitudesPendientes,
  resolverSolicitud,
} from "../services/AdminReactivacion.Service";

import type {
  SolicitudReactivacion,
} from "../types";

export default function AdminReactivacionesPage() {

  const [
    solicitudes,
    setSolicitudes,
  ] = useState<
    SolicitudReactivacion[]
  >([]);

  const [
    modalAbierto,
    setModalAbierto,
  ] = useState(false);

  const [
    solicitudSeleccionada,
    setSolicitudSeleccionada,
  ] =
    useState<SolicitudReactivacion | null>(
      null
    );

  const [
    aprobar,
    setAprobar,
  ] = useState(true);

  const [
    respuestaAdmin,
    setRespuestaAdmin,
  ] = useState("");

  const cargarDatos =
    async () => {

      try {

        const data =
          await obtenerSolicitudesPendientes();

        setSolicitudes(data);

      } catch (error) {

        console.error(error);

        toast.error(
          "No fue posible cargar las solicitudes"
        );

      }

    };

  useEffect(() => {

    cargarDatos();

  }, []);

  const abrirResolver =
    (
      solicitud: SolicitudReactivacion,
      aprobarSolicitud: boolean
    ) => {

      setSolicitudSeleccionada(
        solicitud
      );

      setAprobar(
        aprobarSolicitud
      );

      setRespuestaAdmin("");

      setModalAbierto(true);

    };

  const confirmarResolver =
    async () => {

      if (
        !solicitudSeleccionada
      ) {
        return;
      }

      try {

        await resolverSolicitud(
          solicitudSeleccionada.id,
          aprobar,
          respuestaAdmin
        );

        toast.success(
          aprobar
            ? "Solicitud aprobada correctamente"
            : "Solicitud rechazada correctamente"
        );

        setModalAbierto(false);

        setSolicitudSeleccionada(
          null
        );

        cargarDatos();

      } catch (error) {

        console.error(error);

        toast.error(
          "No fue posible resolver la solicitud"
        );

      }

    };

  return (
    <div className="min-h-screen bg-[#12201b] text-white p-6">

      <div className="max-w-7xl mx-auto">

        <div className="mb-8">

          <h1 className="text-3xl font-bold">
            Reactivaciones
          </h1>

          <p className="text-gray-400 mt-2">
            Solicitudes pendientes de reactivación.
          </p>

        </div>

        <div
          className="
            bg-[#1a2b24]
            border
            border-[#2d463b]
            rounded-2xl
            p-5
            mb-6
          "
        >

          <p className="text-gray-400 text-sm">
            Pendientes
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {solicitudes.length}
          </h2>

        </div>

        {solicitudes.length === 0 ? (

          <div
            className="
              bg-[#1a2b24]
              border
              border-[#2d463b]
              rounded-2xl
              p-10
              text-center
            "
          >

            <p className="text-gray-400">
              No hay solicitudes pendientes.
            </p>

          </div>

        ) : (

          <div className="grid gap-4">

            {solicitudes.map(
              (solicitud) => (

                <div
                  key={solicitud.id}
                  className="
                    bg-[#1a2b24]
                    border
                    border-[#2d463b]
                    rounded-2xl
                    p-5
                  "
                >

                  <div className="flex justify-between items-start">

                    <div>

                      <h3 className="text-xl font-bold">
                        {
                          solicitud.nombreAlumno
                        }
                      </h3>

                      <p className="text-gray-400 mt-2">
                        Alumno ID:
                        {" "}
                        {
                          solicitud.alumnoId
                        }
                      </p>

                      <p className="text-gray-400 mt-2">
                        {
                          solicitud.motivoAlumno
                        }
                      </p>

                      <p className="text-sm text-gray-500 mt-4">
                        {new Date(
                          solicitud.fechaSolicitud
                        ).toLocaleDateString(
                          "es-UY"
                        )}
                      </p>

                    </div>

                    <div className="flex gap-2">

                      <button
                        onClick={() =>
                          abrirResolver(
                            solicitud,
                            true
                          )
                        }
                        className="
                          px-4
                          py-2
                          rounded-lg
                          bg-green-500/20
                          text-green-400
                        "
                      >
                        Aprobar
                      </button>

                      <button
                        onClick={() =>
                          abrirResolver(
                            solicitud,
                            false
                          )
                        }
                        className="
                          px-4
                          py-2
                          rounded-lg
                          bg-red-500/20
                          text-red-400
                        "
                      >
                        Rechazar
                      </button>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

      {modalAbierto && (

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

            <h2 className="text-2xl font-bold mb-5">

              {aprobar
                ? "Aprobar solicitud"
                : "Rechazar solicitud"}

            </h2>

            <textarea
              value={respuestaAdmin}
              onChange={(e) =>
                setRespuestaAdmin(
                  e.target.value
                )
              }
              placeholder="Respuesta para el alumno..."
              className="
                w-full
                h-32
                p-4
                rounded-xl
                bg-[#12201b]
                border
                border-[#2d463b]
              "
            />

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() =>
                  setModalAbierto(
                    false
                  )
                }
                className="
                  px-4
                  py-2
                  rounded-lg
                  bg-gray-700
                "
              >
                Cancelar
              </button>

              <button
                onClick={
                  confirmarResolver
                }
                className={`
                  px-4
                  py-2
                  rounded-lg
                  font-semibold
                  ${
                    aprobar
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }
                `}
              >
                Confirmar
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}