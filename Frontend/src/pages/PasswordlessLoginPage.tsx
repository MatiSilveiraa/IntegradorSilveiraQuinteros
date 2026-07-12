import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";

import logo from "../assets/logo.png";
import { solicitarLoginSinPassword } from "../services/AuthPasswordless.Service";

export default function PasswordlessLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailNormalizado = email.trim().toLowerCase();

    if (!emailNormalizado) {
      toast.error("Ingresá tu correo electrónico");
      return;
    }

    try {
      setLoading(true);

      const response = await solicitarLoginSinPassword(emailNormalizado);

      setMensaje(
        response?.mensaje ??
          "Si existe una cuenta asociada a ese correo, recibirás un código de acceso.",
      );
      setEnviado(true);
      toast.success("Solicitud procesada");
    } catch (error) {
      console.error(error);
      toast.error("No fue posible procesar la solicitud. Intentá nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#12201b] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6 sm:p-8 shadow-2xl">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#4adea8]"
        >
          <ArrowBackOutlinedIcon fontSize="small" />
          Volver al inicio de sesión
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#4adea8] shadow-lg shadow-[#4adea8]/20">
            <img src={logo} alt="Joki Training Team" className="w-full h-full object-cover" />
          </div>

          <span className="mt-6 inline-flex px-4 py-2 rounded-full bg-[#4adea8]/10 border border-[#4adea8]/30 text-[#4adea8] text-sm font-bold">
            Acceso sin contraseña
          </span>

          <h1 className="text-white text-3xl font-bold mt-5">Ingresar con código</h1>

          <p className="text-gray-400 mt-3 leading-relaxed">
            Ingresá tu correo y te enviaremos un código temporal para acceder.
          </p>
        </div>

        {!enviado ? (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="passwordless-email" className="text-sm text-gray-300 block mb-2">
                Correo electrónico
              </label>

              <div className="relative">
                <EmailOutlinedIcon
                  fontSize="small"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  id="passwordless-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  autoComplete="email"
                  disabled={loading}
                  required
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-[#12201b] border border-[#2d463b] text-white outline-none focus:border-[#4adea8] focus:ring-2 focus:ring-[#4adea8]/10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full h-14 bg-[#4adea8] text-[#12201b] font-bold rounded-xl flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 rounded-full border-2 border-[#12201b]/30 border-t-[#12201b] animate-spin" />
                  Procesando...
                </>
              ) : (
                "Recibir código"
              )}
            </button>

            <p className="text-center text-sm text-gray-500">
              Por seguridad, no confirmaremos si el correo está registrado.
            </p>
          </form>
        ) : (
          <div className="mt-8">
            <div className="rounded-2xl border border-[#4adea8]/30 bg-[#4adea8]/10 p-5">
              <div className="flex items-start gap-3">
                <MarkEmailReadOutlinedIcon className="text-[#4adea8] mt-0.5" />

                <div>
                  <h2 className="text-lg font-bold text-white">Revisá tu correo</h2>
                  <p className="text-sm text-gray-300 mt-2 leading-relaxed">{mensaje}</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/otp-login-codigo", {
                  state: { email: email.trim().toLowerCase() },
                })
              }
              className="w-full h-14 mt-5 bg-[#4adea8] text-[#12201b] font-bold rounded-xl hover:brightness-110"
            >
              Ingresar código
            </button>

            <button
              type="button"
              onClick={() => {
                setEnviado(false);
                setMensaje("");
              }}
              className="w-full h-12 mt-3 border border-[#2d463b] rounded-xl text-gray-300 hover:border-[#4adea8]"
            >
              Usar otro correo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
