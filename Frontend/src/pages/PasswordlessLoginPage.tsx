import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import logo from "../assets/logo.png";
import { solicitarLoginSinPassword } from "../services/AuthPasswordless.Service";

export default function PasswordlessLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Ingresá tu correo electrónico");
      return;
    }

    try {
      setLoading(true);

      await solicitarLoginSinPassword(email.trim());

      toast.success("Código enviado correctamente");

      navigate("/otp-login-codigo", {
        state: {
          email: email.trim(),
        },
      });
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.mensaje || "No fue posible enviar el código"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#12201b] flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-8 shadow-2xl">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-6 text-sm text-gray-400 hover:text-[#4adea8] transition-all"
        >
          ← Volver al inicio de sesión
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#4adea8] shadow-lg shadow-[#4adea8]/20">
            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
          </div>

          <span className="mt-6 inline-flex px-4 py-2 rounded-full bg-[#4adea8]/10 border border-[#4adea8]/30 text-[#4adea8] text-sm font-bold">
            Inicio de sesión
          </span>

          <h1 className="text-white text-3xl font-bold mt-5">
            Ingresar con código
          </h1>

          <p className="text-gray-400 mt-3 leading-relaxed">
            Ingresá tu correo electrónico y te enviaremos un código temporal
            para acceder a tu cuenta.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="text-sm text-gray-300 block mb-2">
              Correo electrónico
            </label>

            <div className="relative">
              <span className="absolute left-4 top-4 text-gray-500">✉️</span>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full h-14 pl-12 pr-4 rounded-xl bg-[#12201b] border border-[#2d463b] text-white outline-none focus:border-[#4adea8]"
                autoComplete="email"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-[#4adea8] text-[#12201b] font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? "Enviando código..." : "Recibir código"}
          </button>

          <p className="text-center text-sm text-gray-500">
            El código llegará al correo asociado a tu cuenta.
          </p>
        </form>
      </div>
    </div>
  );
}