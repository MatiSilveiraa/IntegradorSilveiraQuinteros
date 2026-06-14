import { useState } from "react";

import AlumnoTopBar from "../components/navigation/AlumnoTopBar";
import AlumnoSidebar from "../components/navigation/AlumnoSidebar";
import AlumnoBottomNav from "../components/navigation/AlumnoBottomNav";

import { setup2FA, confirmar2FA } from "../services/Auth2FA.Service";

export default function SeguridadPage() {
  const [qrCode, setQrCode] = useState("");

  const [codigo, setCodigo] = useState("");
  const [activado, setActivado] = useState(false);

  const [mostrarQR, setMostrarQR] = useState(false);

  const activar2FA = async () => {
    try {
      const data = await setup2FA();

      setQrCode(data.qrCodeBase64);

      setMostrarQR(true);
    } catch (error) {
      console.error(error);
    }
  };

  const confirmar = async () => {
    try {
      await confirmar2FA(codigo);

      setActivado(true);

      setMostrarQR(false);

      alert("2FA activado correctamente");
    } catch (error) {
      console.error(error);

      alert("Código inválido");
    }
  };

  return (
    <div className="min-h-screen bg-[#12201b] text-white">
      <AlumnoTopBar />

      <AlumnoSidebar />

      <main
        className="
    pt-20
    pb-24
    px-4
    lg:px-6
    lg:ml-64
    max-w-6xl
    mx-auto
  "
      >
        <h1 className="text-4xl font-bold mb-2">Seguridad</h1>

        <p className="text-gray-400 mb-8">
          Configura la autenticación de dos factores para proteger tu cuenta.
        </p>

        {/* CARD PRINCIPAL */}

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
              <h2 className="text-2xl font-bold">
                Autenticación de dos factores (2FA)
              </h2>

              <p className="text-gray-400 mt-3 max-w-3xl">
                Agrega una capa extra de seguridad a tu cuenta. Cada vez que
                inicies sesión deberás ingresar un código de 6 dígitos generado
                por tu aplicación autenticadora.
              </p>
            </div>

            <span
              className={`
    px-4
    py-2
    rounded-full
    text-sm
    font-semibold
    ${
      activado ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
    }
  `}
            >
              {activado ? "Activado" : "No activado"}
            </span>
          </div>

          {!mostrarQR && (
            <button
              onClick={activar2FA}
              className="
          mt-6
          px-6
          py-3
          rounded-xl
          bg-[#4adea8]
          text-[#12201b]
          font-bold
          hover:opacity-90
        "
            >
              Activar 2FA
            </button>
          )}
        </div>

        {/* COMO FUNCIONA */}

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
          <h2 className="text-2xl font-bold mb-6">Cómo activar 2FA</h2>

          <div className="space-y-6">
            <div>
              <p className="font-semibold">1. Escanea el código QR</p>

              <p className="text-gray-400 mt-1">
                Utiliza Google Authenticator o Microsoft Authenticator.
              </p>
            </div>

            <div>
              <p className="font-semibold">2. Ingresa el código</p>

              <p className="text-gray-400 mt-1">
                Introduce el código de 6 dígitos generado por la aplicación.
              </p>
            </div>

            <div>
              <p className="font-semibold">3. Confirmar activación</p>

              <p className="text-gray-400 mt-1">
                Una vez validado, tu cuenta quedará protegida.
              </p>
            </div>
          </div>
        </div>

        {/* QR */}

        {mostrarQR && (
          <div
            className="
        bg-[#1a2b24]
        border
        border-[#2d463b]
        rounded-3xl
        p-8
      "
          >
            <h2 className="text-2xl font-bold mb-2">Escanea el código QR</h2>

            <p className="text-gray-400 mb-6">
              Usa tu aplicación autenticadora para escanear este código.
            </p>

            <div
              className="
          grid
          lg:grid-cols-2
          gap-8
          items-start
        "
            >
              {/* QR */}

              <div>
                <div
                  className="
              bg-white
              p-4
              rounded-2xl
              inline-block
            "
                >
                  <img src={qrCode} alt="QR 2FA" className="w-72 h-72" />
                </div>
              </div>

              {/* VALIDACION */}

              <div>
                <div
                  className="
              bg-[#12201b]
              border
              border-[#2d463b]
              rounded-2xl
              p-6
            "
                >
                  <h3 className="font-bold text-lg">Confirmar activación</h3>

                  <p className="text-gray-400 mt-2">
                    Ingresa el código generado por tu aplicación.
                  </p>

                  <input
                    type="text"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    placeholder="Código de 6 dígitos"
                    className="
                w-full
                mt-6
                h-14
                px-4
                rounded-xl
                bg-[#0e1511]
                border
                border-[#2d463b]
                focus:border-[#4adea8]
                outline-none
              "
                  />

                  {!activado && !mostrarQR && (
                    <button
                      onClick={activar2FA}
                      className="
      mt-6
      px-6
      py-3
      rounded-xl
      bg-[#4adea8]
      text-[#12201b]
      font-bold
    "
                    >
                      Activar 2FA
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <AlumnoBottomNav />
    </div>
  );
}
