import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import logo from "../assets/logo.png";
import { solicitarRecuperacion } from "../services/Auth.service";

export default function VerifyCodePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [codigo, setCodigo] = useState("");
  const [reenviando, setReenviando] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (codigo.length < 6) {
      toast.error("Ingresá el código de 6 dígitos");
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
      setReenviando(true);

      await solicitarRecuperacion(email);

      toast.success("Se envió un nuevo código");
    } catch (error) {
      console.error(error);

      toast.error("No fue posible reenviar el código");
    } finally {
      setReenviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#12201b] flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-8 shadow-2xl">
        <button
          type="button"
          onClick={() => navigate("/forgot-password")}
          className="mb-6 text-sm text-gray-400 hover:text-[#4adea8] transition-all"
        >
          ← Cambiar correo
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#4adea8] shadow-lg shadow-[#4adea8]/20">
            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
          </div>

          <span className="mt-6 inline-flex px-4 py-2 rounded-full bg-[#4adea8]/10 border border-[#4adea8]/30 text-[#4adea8] text-sm font-bold">
            Recuperación de cuenta
          </span>

          <h1 className="text-white text-3xl font-bold mt-5">
            Verificá tu identidad
          </h1>

          <p className="text-gray-400 mt-3">
            Ingresá el código enviado a:
          </p>

          <p className="text-[#4adea8] font-bold mt-2 break-all">
            {email}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={codigo}
            onChange={(e) =>
              setCodigo(e.target.value.replace(/\D/g, ""))
            }
            placeholder="000000"
            className="w-full h-16 text-center text-3xl tracking-[12px] rounded-xl bg-[#12201b] border border-[#2d463b] text-white outline-none focus:border-[#4adea8]"
          />

          <button
            type="submit"
            disabled={codigo.length < 6}
            className="w-full h-14 bg-[#4adea8] text-[#12201b] font-bold rounded-xl mt-8 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            Continuar
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500 mb-2">
            ¿No recibiste el código?
          </p>

          <button
            onClick={handleReenviarCodigo}
            disabled={reenviando}
            className="text-[#4adea8] font-semibold hover:underline disabled:opacity-60"
          >
            {reenviando ? "Reenviando..." : "Reenviar código"}
          </button>
        </div>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full h-12 mt-6 border border-[#2d463b] rounded-xl text-gray-300 hover:border-[#4adea8] hover:text-[#4adea8] transition-all"
        >
          Volver al inicio de sesión
        </button>
      </div>
    </div>
  );
}