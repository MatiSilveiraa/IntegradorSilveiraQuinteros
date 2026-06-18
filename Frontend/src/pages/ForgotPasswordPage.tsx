import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { solicitarRecuperacion } from "../services/Auth.service";

import logo from "../assets/logo.png";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      await solicitarRecuperacion(
        email
      );

      toast.success(
        "Código de recuperación enviado correctamente"
      );

      navigate(
        "/verify-code",
        {
          state: {
            email,
          },
        }
      );
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data
          ?.mensaje ||
          "No fue posible enviar el código de recuperación"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#12201b]">
      <header className="h-16 flex items-center px-6">
        <button
          onClick={() =>
            navigate("/")
          }
          className="text-[#4adea8] text-3xl"
        >
          ←
        </button>
      </header>

      <div className="flex flex-col items-center px-6">
        <div
          className="
            w-32
            h-32
            rounded-full
            overflow-hidden
            border-4
            border-[#4adea8]
            shadow-lg
            shadow-[#4adea8]/20
          "
        >
          <img
            src={logo}
            alt="logo"
            className="w-full h-full object-cover"
          />
        </div>

        <h1
          className="
            text-white
            text-4xl
            font-bold
            mt-6
          "
        >
          Joki Training Team
        </h1>

        <div
          className="
            w-full
            max-w-md
            bg-[#1a2b24]
            border
            border-[#2d463b]
            rounded-3xl
            p-8
            mt-10
          "
        >
          <p
            className="
              text-center
              text-gray-300
              text-lg
            "
          >
            Ingresa tu correo
            electrónico para recibir
            un enlace de recuperación
            de contraseña.
          </p>

          <form
            onSubmit={
              handleSubmit
            }
            className="mt-8"
          >
            <label
              className="
                block
                text-gray-300
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
                  e.target.value
                )
              }
              placeholder="ejemplo@correo.com"
              className="
                w-full
                h-14
                px-4
                rounded-xl
                bg-[#12201b]
                border
                border-[#2d463b]
                text-white
              "
              required
            />

            <button
              type="submit"
              className="
                w-full
                h-14
                bg-[#4adea8]
                text-[#12201b]
                font-bold
                rounded-xl
                mt-8
              "
            >
              Enviar código de recuperación
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}