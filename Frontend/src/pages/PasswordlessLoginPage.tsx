import { useState } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../assets/logo.png";

import { solicitarLoginSinPassword } from "../services/AuthPasswordless.Service";

import toast from "react-hot-toast";

export default function PasswordlessLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error(
        "Ingresa tu correo electrónico",
      );

      return;
    }

    try {
      setLoading(true);

      await solicitarLoginSinPassword(
        email,
      );

      toast.success(
        "Código enviado correctamente",
      );

      navigate(
        "/otp-login-codigo",
        {
          state: {
            email,
          },
        },
      );
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data
          ?.mensaje ||
          "No fue posible enviar el código",
      );
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
            Ingreso sin contraseña
          </h1>

          <p
            className="
              text-gray-400
              mt-2
              text-center
            "
          >
            Te enviaremos un código
            temporal a tu correo.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8"
        >
          <label
            className="
              text-sm
              text-gray-300
              block
              mb-2
            "
          >
            Correo electrónico
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value,
              )
            }
            placeholder="correo@ejemplo.com"
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
            "
          />

          <button
            type="submit"
            disabled={loading}
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
            {loading
              ? "Enviando..."
              : "Enviar código"}
          </button>
        </form>
      </div>
    </div>
  );
}