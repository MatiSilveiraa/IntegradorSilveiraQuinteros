import { useEffect, useState } from "react";

import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";

import AlumnoTopBar from "../components/navigation/DashboardTopBar";
import AlumnoSidebar from "../components/navigation/AlumnoSidebar";
import AlumnoBottomNav from "../components/navigation/AlumnoBottomNav";

import { obtenerMiPerfil } from "../services/Perfil.service";

import {
  obtenerMisNotificaciones,
  marcarComoLeida,
} from "../services/Notificacion.Service";

export default function NotificacionPage() {
  const [perfil, setPerfil] = useState<any>(null);

  const [notificaciones, setNotificaciones] = useState<any[]>([]);

  useEffect(() => {
    obtenerMiPerfil().then(setPerfil).catch(console.error);
  }, []);

  useEffect(() => {
    cargarNotificaciones();
  }, []);

  const cargarNotificaciones = async () => {
    try {
      const data = await obtenerMisNotificaciones();

      setNotificaciones(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarcarLeida = async (id: number) => {
    try {
      await marcarComoLeida(id);

      setNotificaciones((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  const esAlumno = usuario.rol === "Alumno";

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      {esAlumno && (
        <>
          <AlumnoTopBar nombre={perfil?.nombre} />

          <AlumnoSidebar />
        </>
      )}

      <main
        className={`
    px-4
    max-w-5xl
    mx-auto
    ${esAlumno ? "pt-20 pb-24 lg:px-6 lg:ml-64" : "pt-24 pb-8"}
  `}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Notificaciones</h1>

          <p className="text-gray-400 mt-2">
            Mantente informado sobre cuotas, pagos, desafíos y beneficios.
          </p>
        </div>

        {notificaciones.length === 0 ? (
          <div
            className="
              bg-[#1a2b24]
              border
              border-[#2d463b]
              rounded-2xl
              p-8
              text-center
            "
          >
            <NotificationsOutlinedIcon
              sx={{
                fontSize: 50,
              }}
            />

            <p className="text-gray-400 mt-4">No tienes notificaciones.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notificaciones
              .filter((n) => !n.leida)
              .map((notificacion) => (
                <div
                  key={notificacion.id}
                  className={`
                    rounded-2xl
                    border
                    p-5
                    transition-all
                    ${
                      notificacion.leida
                        ? `
                          bg-[#1a2b24]
                          border-[#2d463b]
                        `
                        : `
                          bg-[#163129]
                          border-[#4adea8]
                        `
                    }
                  `}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-lg">
                          {notificacion.titulo}
                        </h3>

                        {!notificacion.leida && (
                          <span
                            className="
                              px-2
                              py-1
                              rounded-full
                              bg-[#4adea8]
                              text-[#12201b]
                              text-xs
                              font-bold
                            "
                          >
                            NUEVA
                          </span>
                        )}
                      </div>

                      <p className="text-gray-300 mt-2">
                        {notificacion.mensaje}
                      </p>

                      <div className="flex gap-4 mt-3 text-sm text-gray-500">
                        <span>{notificacion.tipo}</span>

                        <span>
                          {new Date(
                            notificacion.fechaCreacion,
                          ).toLocaleDateString("es-UY")}
                        </span>
                      </div>
                    </div>

                    {!notificacion.leida && (
                      <button
                        onClick={() => handleMarcarLeida(notificacion.id)}
                        className="
                          px-4
                          py-2
                          rounded-lg
                          bg-[#4adea8]
                          text-[#12201b]
                          font-semibold
                          hover:opacity-90
                        "
                      >
                        Marcar leída
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>
      {esAlumno && <AlumnoBottomNav />}
    </div>
  );
}
