import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import logo from "../assets/logo.png";
import {
  solicitarLoginSinPassword,
  validarLoginSinPassword,
} from "../services/AuthPasswordless.Service";

export default function PasswordlessCodePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const [reenviando, setReenviando] = useState(false);

  if (!email) {
    navigate("/passwordless-login");
    return null;
  }

  const redirigirPorRol = (response: any) => {
    localStorage.setItem("token", response.token);
    localStorage.setItem("usuario", JSON.stringify(response.usuario));

    toast.success("Inicio de sesión correcto");

    const rol = response.usuario.rol;

    if (rol === "Admin") navigate("/admin");
    else if (rol === "Alumno") navigate("/alumno");
    else if (rol === "Entrenador") navigate("/entrenador");
    else navigate("/");
  };

  const handleValidar = async (codigoIngresado?: string) => {
    const codigoFinal = codigoIngresado ?? codigo;

    if (codigoFinal.length < 6) return;

    try {
      setLoading(true);

      const response = await validarLoginSinPassword(email, codigoFinal);

      if (response.requiere2FA) {
        navigate("/2fa-login", {
          state: { email: response.email },
        });

        return;
      }

      redirigirPorRol(response);
    } catch (error: any) {
      console.error(error);

      toast.error(error?.response?.data?.mensaje || "Código inválido");

      setCodigo("");
    } finally {
      setLoading(false);
    }
  };

  const reenviarCodigo = async () => {
    try {
      setReenviando(true);

      await solicitarLoginSinPassword(email);

      toast.success("Te enviamos un nuevo código");
      setCodigo("");
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.mensaje || "No fue posible reenviar el código"
      );
    } finally {
      setReenviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#12201b] flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-8 shadow-2xl">
        <button
          type="button"
          onClick={() => navigate("/passwordless-login")}
          className="mb-6 text-sm text-gray-400 hover:text-[#4adea8] transition-all"
        >
          ← Cambiar correo
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#4adea8] shadow-lg shadow-[#4adea8]/20">
            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
          </div>

          <span className="mt-6 inline-flex px-4 py-2 rounded-full bg-[#4adea8]/10 border border-[#4adea8]/30 text-[#4adea8] text-sm font-bold">
            Código de acceso
          </span>

          <h1 className="text-white text-3xl font-bold mt-5">
            Verificá tu correo
          </h1>

          <p className="text-gray-400 mt-3 leading-relaxed">
            Ingresá el código de 6 dígitos enviado a:
          </p>

          <p className="text-[#4adea8] font-bold mt-2">{email}</p>
        </div>

        <div className="mt-8">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={codigo}
            onChange={(e) => {
              const valor = e.target.value.replace(/\D/g, "");

              setCodigo(valor);

              if (valor.length === 6) {
                handleValidar(valor);
              }
            }}
            placeholder="000000"
            disabled={loading}
            className="w-full h-16 text-center text-3xl tracking-[12px] rounded-xl bg-[#12201b] border border-[#2d463b] text-white outline-none focus:border-[#4adea8] disabled:opacity-60"
          />

          <button
            type="button"
            disabled={loading || codigo.length < 6}
            onClick={() => handleValidar()}
            className="w-full h-14 mt-6 bg-[#4adea8] text-[#12201b] font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? "Validando..." : "Ingresar"}
          </button>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500 mb-2">
              ¿No recibiste el código?
            </p>

            <button
              type="button"
              onClick={reenviarCodigo}
              disabled={reenviando || loading}
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
    </div>
  );
}