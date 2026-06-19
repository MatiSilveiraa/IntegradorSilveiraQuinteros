import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import logo from "../assets/logo.png";

import { validarLoginSinPassword } from "../services/AuthPasswordless.Service";

import toast from "react-hot-toast";

export default function PasswordlessCodePage() {
  const navigate = useNavigate();

  const location = useLocation();

  const email = location.state?.email;
  if (!email) {
    navigate("/passwordless-login");
    return null;
  }
  const [codigo, setCodigo] = useState("");

  const [loading, setLoading] = useState(false);

  const handleValidar = async (codigoIngresado?: string) => {
    const codigoFinal = codigoIngresado ?? codigo;

    if (codigoFinal.length < 6) {
      return;
    }

    try {
      setLoading(true);

      const response = await validarLoginSinPassword(email, codigoFinal);

      if (response.requiere2FA) {
        navigate("/2fa-login", {
          state: {
            email: response.email,
          },
        });

        return;
      }

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

      toast.error(error?.response?.data?.mensaje || "Código inválido");

      setCodigo("");
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
            Verificar código
          </h1>

          <p
            className="
              text-gray-400
              mt-2
              text-center
            "
          >
            Ingresa el código enviado a tu correo.
          </p>
        </div>

        <div className="mt-8">
          <input
            type="text"
            maxLength={6}
            value={codigo}
            onChange={(e) => {
              const valor = e.target.value.replace(/\D/g, "");

              setCodigo(valor);

              if (valor.length === 6) {
                handleValidar(valor);
              }
            }}
            placeholder="123456"
            className="
              w-full
              h-16
              text-center
              text-3xl
              tracking-[12px]
              rounded-xl
              bg-[#12201b]
              border
              border-[#2d463b]
              text-white
              outline-none
              focus:border-[#4adea8]
            "
          />

          {loading && (
            <p
              className="
                text-center
                text-gray-400
                mt-4
              "
            >
              Validando...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
