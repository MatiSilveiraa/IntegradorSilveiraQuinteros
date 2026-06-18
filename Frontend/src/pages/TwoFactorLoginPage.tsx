import { useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import logo from "../assets/logo.png";

import { validar2FA } from "../services/Auth2FA.Service";
import toast from "react-hot-toast";

export default function TwoFactorLoginPage() {
  const navigate = useNavigate();

  const location = useLocation();

  const email = location.state?.email;

  const [codigo, setCodigo] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleValidar = async () => {
    try {
      if (!codigo.trim()) {
        toast.error("Ingresa el código de verificación");
        return;
      }

      setLoading(true);

      setError("");

      const response = await validar2FA(email, codigo);

      localStorage.setItem("token", response.token);

      localStorage.setItem("usuario", JSON.stringify(response.usuario));
      toast.success("Inicio de sesión correcto");

      const rol = response.usuario.rol;

      if (rol === "Admin") {
        navigate("/admin");
      } else if (rol === "Alumno") {
        navigate("/alumno");
      } else if (rol === "Entrenador") {
        navigate("/entrenador");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      console.error(error);

      const mensaje = error?.response?.data?.mensaje || "Código inválido";

      setError(mensaje);

      toast.error(mensaje);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen
        bg-[#12201b]
        flex
        items-center
        justify-center
        px-4
      "
    >
      <div
        className="
          w-full
          max-w-md
          bg-[#1a2b24]
          border
          border-[#2d463b]
          rounded-3xl
          p-8
          shadow-2xl
        "
      >
        <div className="flex flex-col items-center">
          <div
            className="
              w-24
              h-24
              rounded-full
              overflow-hidden
              border-4
              border-[#4adea8]
            "
          >
            <img
              src={logo}
              alt="Logo"
              className="
                w-full
                h-full
                object-cover
              "
            />
          </div>

          <h1
            className="
              text-white
              text-3xl
              font-bold
              mt-6
            "
          >
            Verificación 2FA
          </h1>

          <p
            className="
              text-gray-400
              mt-2
              text-center
            "
          >
            Ingresa el código generado por Google Authenticator
          </p>
        </div>

        {error && (
          <div
            className="
              bg-red-500/20
              border
              border-red-500
              text-red-300
              p-3
              rounded-xl
              mt-6
            "
          >
            {error}
          </div>
        )}

        <div className="mt-8">
          <label
            className="
              text-sm
              text-gray-300
              block
              mb-2
            "
          >
            Código de verificación
          </label>

          <input
            type="text"
            maxLength={6}
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="123456"
            className="
              w-full
              h-14
              px-4
              rounded-xl
              bg-[#12201b]
              border
              border-[#2d463b]
              text-white
              outline-none
              focus:border-[#4adea8]
              text-center
              text-xl
              tracking-[0.4em]
            "
          />

          <button
            onClick={handleValidar}
            disabled={loading || codigo.length < 6}
            className="
              w-full
              h-14
              mt-6
              bg-[#4adea8]
              text-[#12201b]
              font-bold
              rounded-xl
              hover:scale-[1.02]
              active:scale-95
              transition-all
              disabled:opacity-50
            "
          >
            {loading ? "Validando..." : "Ingresar"}
          </button>
        </div>
      </div>
    </div>
  );
}
