import { useEffect, useState } from "react";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import AlumnoLayout from "../../components/layout/AlumnoLayout";
import { obtenerMisClases } from "../../services/Inscripciones.Service";
import obtenerDiaActual from "../../utils/dayUtils";
import { registrarAsistenciaGeolocalizacion } from "../../services/Asistencia.Service";
import LocationMap from "../../components/maps/LocationMap";
import { configurarLeaflet } from "../../utils/leafletUtils";
import ClassLocationMap from "../../components/maps/ClassLocationMap";
import { calcularDistancia } from "../../utils/geolocationUtils";
import { obtenerProximaClase }
from "../../utils/proximaClaseUtils";

configurarLeaflet();
export default function AsistenciasPage() {
  const [estado, setEstado] = useState("Obteniendo clases...");
  const [misClases, setMisClases] = useState<any[]>([]);

  const [latitud, setLatitud] = useState<number | null>(null);

  const [longitud, setLongitud] = useState<number | null>(null);

  useEffect(() => {
    registrarAsistencia();
  }, []);

  const registrarAsistencia = async () => {
    try {
      setEstado("Buscando clases...");

      const clases = await obtenerMisClases();

      setMisClases(clases);

      if (!clases || clases.length === 0) {
        setEstado("No tienes clases registradas.");

        return;
      }

      setEstado("Obteniendo ubicación...");

      navigator.geolocation.getCurrentPosition(
        async (posicion) => {
          setLatitud(posicion.coords.latitude);

          setLongitud(posicion.coords.longitude);

          const diaActual = obtenerDiaActual();

          const clase = clases.find((c: any) => c.diaSemana === diaActual);

          if (!clase) {
            setEstado(`No tienes clases programadas para hoy (${diaActual}).`);

            return;
          }

          try {
            setEstado("Registrando asistencia...");

            const resultado = await registrarAsistenciaGeolocalizacion(
              clase.id,
              posicion.coords.latitude,
              posicion.coords.longitude,
            );

            setEstado(
              resultado.mensaje || "Asistencia registrada correctamente",
            );
          } catch (error: any) {
            console.error(error);

            console.log("ERROR BACKEND:", error?.response?.data);

            setEstado(
              error?.response?.data?.mensaje ||
                JSON.stringify(error?.response?.data || "Error desconocido"),
            );
          }
        },
        (error) => {
          console.error(error);

          setEstado("Debes habilitar la ubicación para registrar asistencia.");
        },
        {
          enableHighAccuracy: true,
        },
      );
    } catch (error) {
      console.error(error);

      setEstado("Ocurrió un error al verificar la asistencia.");
    }
  };

  const proximaClase =
  obtenerProximaClase(misClases);

  const distancia =
    proximaClase && latitud && longitud
      ? calcularDistancia(
          latitud,
          longitud,
          proximaClase.latitud,
          proximaClase.longitud,
        )
      : null;

  return (
    <AlumnoLayout>
      <main className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Asistencias</h1>

        <p className="text-gray-400 mb-8">
          Registro automático de asistencia mediante geolocalización.
        </p>

        {/* ESTADO */}

        <div
          className="
          bg-[#1a2b24]
          border
          border-[#2d463b]
          rounded-3xl
          p-8
          mb-8
        "
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 mb-2">Estado de asistencia</p>

              <h2 className="text-3xl font-bold">{estado}</h2>

              {proximaClase && (
                <p className="text-gray-400 mt-3">
                  Próxima clase: {proximaClase.diaSemana}{" "}
                  {proximaClase.horaInicio.substring(0, 5)}
                  {" - "}
                  {proximaClase.horaFin.substring(0, 5)}
                </p>
              )}
            </div>

            <span
              className="
              px-4
              py-2
              rounded-full
              bg-[#4adea8]/10
              text-[#4adea8]
              font-semibold
            "
            >
              Activo
            </span>
          </div>
        </div>

        <div
          className="
          grid
          md:grid-cols-2
          gap-6
          mb-8
        "
        >
          <div
            className="
            bg-[#1a2b24]
            border
            border-[#2d463b]
            rounded-3xl
            p-6
          "
          >
            <h3 className="flex items-center gap-2 text-2xl font-bold mb-5">
              <LocationOnOutlinedIcon />
              Mi ubicación
            </h3>

            {latitud && longitud && (
              <div
                className="
      overflow-hidden
      rounded-2xl
      border
      border-[#2d463b]
      mb-4
    "
              >
                <LocationMap latitud={latitud} longitud={longitud} />
              </div>
            )}
          </div>

          <div
            className="
            bg-[#1a2b24]
            border
            border-[#2d463b]
            rounded-3xl
            p-6
          "
          >
            <h3 className="flex items-center gap-2 text-2xl font-bold mb-5">
              <ScheduleOutlinedIcon />
              Próxima clase
            </h3>
            {proximaClase ? (
              <>
                <p className="text-3xl font-bold">{proximaClase.diaSemana}</p>

                <p className="mt-3 text-lg">
                  {proximaClase.horaInicio.substring(0, 5)}
                  {" - "}
                  {proximaClase.horaFin.substring(0, 5)}
                </p>

                <p className="mt-3 text-gray-400">
                  Radio permitido: {proximaClase.radioGeolocalizacion}m
                </p>

                {distancia && (
                  <div
                    className="
        mt-4
        p-3
        rounded-xl
        bg-[#12201b]
      "
                  >
                    <p className="text-[#4adea8] font-semibold">
                      Distancia actual: {distancia}m
                    </p>

                    {distancia <= proximaClase.radioGeolocalizacion ? (
                      <p className="text-green-400 text-sm mt-1">
                        Dentro del área de asistencia
                      </p>
                    ) : (
                      <p className="text-yellow-400 text-sm mt-1">
                        Aún estás fuera del radio permitido
                      </p>
                    )}
                  </div>
                )}

                <div
                  className="
      mt-5
      overflow-hidden
      rounded-2xl
      border
      border-[#2d463b]
    "
                >
                  <ClassLocationMap
                    latitud={proximaClase.latitud}
                    longitud={proximaClase.longitud}
                    radio={proximaClase.radioGeolocalizacion}
                  />
                </div>
              </>
            ) : (
              <p className="text-gray-400">No hay clases disponibles.</p>
            )}
          </div>
        </div>

        {/* MIS CLASES */}

        <div
          className="
          bg-[#1a2b24]
          border
          border-[#2d463b]
          rounded-3xl
          p-6
        "
        >
          <h2 className="text-2xl font-bold mb-6">Mis clases</h2>

          {misClases.length === 0 ? (
            <p className="text-gray-400">No tienes clases registradas.</p>
          ) : (
            <div className="space-y-4">
              {misClases.map((clase) => (
                <div
                  key={clase.id}
                  className="
                  flex
                  justify-between
                  items-center
                  border
                  border-[#2d463b]
                  rounded-2xl
                  p-4
                "
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <ScheduleOutlinedIcon
                        sx={{
                          fontSize: 20,
                        }}
                      />

                      <p className="font-bold text-lg">{clase.diaSemana}</p>
                    </div>
                    <p className="text-gray-400">
                      {clase.horaInicio.substring(0, 5)}
                      {" - "}
                      {clase.horaFin.substring(0, 5)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-gray-400">Radio</p>

                    <p>{clase.radioGeolocalizacion}m</p>
                  </div>

                  <span
                    className="
                            flex
                            items-center
                            gap-2
                            px-4
                            py-2
                            rounded-full
                            bg-[#4adea8]/10
                            text-[#4adea8]
                            font-semibold
                            "
                  >
                    <CheckCircleOutlineOutlinedIcon fontSize="small" />
                    Activo
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </AlumnoLayout>
  );
}
