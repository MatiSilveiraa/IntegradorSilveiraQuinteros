import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { solicitarRecuperacion } from "../services/Auth.service";
import toast from "react-hot-toast";

export default function VerifyCodePage() {
  const navigate = useNavigate();

  const location = useLocation();

  const email = location.state?.email || "";

  const [codigo, setCodigo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!codigo.trim()) {
      toast.error("Ingresa el código recibido");

      return;
    }

    if (codigo.length < 6) {
      toast.error("El código debe tener 6 dígitos");

      return;
    }

    navigate("/reset-password", {
      state: {
        email,
        codigo,
      },
    });
  };

  const handleReenviarCodigo = async () => {
    try {
      await solicitarRecuperacion(email);

      toast.success("Se envió un nuevo código a tu correo");
    } catch (error) {
      console.error(error);

      toast.error("No fue posible reenviar el código");
    }
  };

  return (
    <div className="min-h-screen bg-[#12201b] px-6">
      <header className="h-16 flex items-center">
        <button onClick={() => navigate(-1)} className="text-white text-3xl">
          ←
        </button>
      </header>

      <div className="max-w-md mx-auto pt-10">
        <h1 className="text-white text-4xl font-bold text-center">
          Verifica tu identidad
        </h1>

        <p className="text-center text-gray-400 mt-4">
          Ingresa el código de 6 dígitos enviado a tu correo.
        </p>

        <form onSubmit={handleSubmit} className="mt-10">
          <input
            type="text"
            maxLength={6}
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ""))}
            className="w-full h-16 text-center text-3xl tracking-[12px] rounded-xl bg-[#1a2b24] border border-[#2d463b] text-white"
          />

          <button
            type="submit"
            disabled={codigo.length < 6}
            className="
    w-full
    h-14
    bg-[#4adea8]
    text-[#12201b]
    font-bold
    rounded-xl
    mt-8
    disabled:opacity-50
  "
          >
            Verificar
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={handleReenviarCodigo}
            className="text-[#4adea8] font-semibold"
          >
            Reenviar código
          </button>
        </div>
      </div>
    </div>
  );
}
