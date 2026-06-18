import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { restablecerContrasena } from "../services/Auth.service";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const location = useLocation();

  const email = location.state?.email;
  const codigo = location.state?.codigo;
  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    try {
      await restablecerContrasena(email, codigo, password);

      toast.success("Contraseña actualizada correctamente");

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      console.error(error);

      toast.error("Código inválido o expirado");
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
          Nueva contraseña
        </h1>

        <p className="text-center text-gray-400 mt-4">
          Ingresa tu nueva contraseña.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-14 px-4 rounded-xl bg-[#1a2b24] border border-[#2d463b] text-white"
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full h-14 px-4 rounded-xl bg-[#1a2b24] border border-[#2d463b] text-white"
          />

          <button
            type="submit"
            className="w-full h-14 bg-[#4adea8] text-[#12201b] font-bold rounded-xl"
          >
            Cambiar contraseña
          </button>
        </form>
      </div>
    </div>
  );
}
