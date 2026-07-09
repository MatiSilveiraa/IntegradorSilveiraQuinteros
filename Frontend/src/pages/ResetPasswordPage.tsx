import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import logo from "../assets/logo.png";
import { restablecerContrasena } from "../services/Auth.service";

export default function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const codigo = location.state?.codigo;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !codigo) {
      toast.error("Faltan datos para restablecer la contraseña");
      navigate("/forgot-password");
      return;
    }

    if (password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    try {
      setLoading(true);

      await restablecerContrasena(email, codigo, password);

      toast.success("Contraseña actualizada correctamente");

      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
      toast.error("Código inválido o expirado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#12201b] flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-8 shadow-2xl">
        <button
          type="button"
          onClick={() => navigate("/verify-code", { state: { email } })}
          className="mb-6 text-sm text-gray-400 hover:text-[#4adea8] transition-all"
        >
          ← Volver al código
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#4adea8] shadow-lg shadow-[#4adea8]/20">
            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
          </div>

          <span className="mt-6 inline-flex px-4 py-2 rounded-full bg-[#4adea8]/10 border border-[#4adea8]/30 text-[#4adea8] text-sm font-bold">
            Recuperación de cuenta
          </span>

          <h1 className="text-white text-3xl font-bold mt-5">
            Nueva contraseña
          </h1>

          <p className="text-gray-400 mt-3 leading-relaxed">
            Creá una nueva contraseña segura para volver a ingresar a tu cuenta.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="text-sm text-gray-300 block mb-2">
              Nueva contraseña
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="w-full h-14 px-4 pr-20 rounded-xl bg-[#12201b] border border-[#2d463b] text-white outline-none focus:border-[#4adea8]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-gray-400 hover:text-white text-sm"
              >
                {showPassword ? "Ocultar" : "Ver"}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-300 block mb-2">
              Confirmar contraseña
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repetí la contraseña"
                className="w-full h-14 px-4 pr-20 rounded-xl bg-[#12201b] border border-[#2d463b] text-white outline-none focus:border-[#4adea8]"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-4 text-gray-400 hover:text-white text-sm"
              >
                {showConfirmPassword ? "Ocultar" : "Ver"}
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            Usá al menos 8 caracteres. Evitá contraseñas fáciles de adivinar.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-[#4adea8] text-[#12201b] font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? "Actualizando..." : "Guardar nueva contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}