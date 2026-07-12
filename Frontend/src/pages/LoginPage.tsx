import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";

import logo from "../assets/logo.png";
import { login } from "../services/Auth.service";
import { loginGoogle } from "../services/AuthGoogle.Service";

export default function LoginPage() {
  const navigate = useNavigate();
  const passwordRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const guardarSesion = (response: any) => {
    localStorage.setItem("token", response.token);
    localStorage.setItem("usuario", JSON.stringify(response.usuario));
  };

  const redirigirPorRol = (rol?: string) => {
    if (rol === "Admin") return navigate("/admin", { replace: true });
    if (rol === "Alumno") return navigate("/alumno", { replace: true });
    if (rol === "Entrenador") return navigate("/entrenador", { replace: true });
    navigate("/", { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const emailNormalizado = email.trim().toLowerCase();
    setError("");

    try {
      setLoading(true);
      const response = await login(emailNormalizado, password);

      if (response.requiere2FA) {
        navigate("/2fa-login", {
          state: { email: response.email ?? emailNormalizado },
        });
        return;
      }

      guardarSesion(response);
      toast.success("Bienvenido nuevamente");
      redirigirPorRol(response.usuario?.rol);
    } catch (err: any) {
      console.error(err);
      const mensaje =
        err?.response?.data?.mensaje ??
        "El correo o la contraseña son incorrectos.";

      setError(mensaje);
      setPassword("");
      requestAnimationFrame(() => passwordRef.current?.focus());
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credential?: string) => {
    if (!credential) return;

    try {
      const response = await loginGoogle(credential);

      if (response.requiere2FA) {
        navigate("/2fa-login", { state: { email: response.email } });
        return;
      }

      guardarSesion(response);
      toast.success("Bienvenido nuevamente");
      redirigirPorRol(response.usuario?.rol);
    } catch (err) {
      console.error(err);
      toast.error("No fue posible iniciar sesión con Google");
    }
  };

  return (
    <div className="min-h-screen bg-[#12201b] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-[#4adea8] shadow-lg shadow-[#4adea8]/20">
            <img src={logo} alt="Joki Training Team" className="w-full h-full object-cover" />
          </div>

          <h1 className="text-white text-3xl font-bold mt-6">Joki Training Team</h1>
          <p className="text-gray-400 mt-2">Iniciá sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
          <div>
            <label htmlFor="login-email" className="text-sm text-gray-300 block mb-2">
              Correo electrónico
            </label>

            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="ejemplo@correo.com"
              autoComplete="email"
              disabled={loading}
              required
              className="w-full h-14 px-4 rounded-xl bg-[#12201b] border border-[#2d463b] text-white outline-none focus:border-[#4adea8] focus:ring-2 focus:ring-[#4adea8]/10 transition-all"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="text-sm text-gray-300 block mb-2">
              Contraseña
            </label>

            <div className="relative">
              <input
                ref={passwordRef}
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Ingresá tu contraseña"
                autoComplete="current-password"
                disabled={loading}
                required
                aria-invalid={Boolean(error)}
                className={`w-full h-14 px-4 pr-14 rounded-xl bg-[#12201b] border text-white outline-none transition-all ${
                  error
                    ? "border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/10"
                    : "border-[#2d463b] focus:border-[#4adea8] focus:ring-2 focus:ring-[#4adea8]/10"
                }`}
              />

              <button
                type="button"
                onClick={() => setShowPassword((actual) => !actual)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? (
                  <VisibilityOffOutlinedIcon fontSize="small" />
                ) : (
                  <VisibilityOutlinedIcon fontSize="small" />
                )}
              </button>
            </div>

            {error && (
              <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300" role="alert">
                <ErrorOutlineOutlinedIcon fontSize="small" className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-[#4adea8] hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading || !email.trim() || !password}
            className="w-full h-14 bg-[#4adea8] text-[#12201b] font-bold rounded-xl flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 rounded-full border-2 border-[#12201b]/30 border-t-[#12201b] animate-spin" />
                Ingresando...
              </>
            ) : (
              <>
                <LoginOutlinedIcon fontSize="small" />
                Iniciar sesión
              </>
            )}
          </button>
        </form>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-[#2d463b]" />
          <span className="text-gray-500 text-sm">o</span>
          <div className="flex-1 h-px bg-[#2d463b]" />
        </div>

        <div className="w-full flex justify-center p-3 border border-[#2d463b] rounded-xl hover:bg-[#22362e] transition-all">
          <GoogleLogin
            theme="filled_black"
            shape="pill"
            size="large"
            width="320"
            onSuccess={(response) => void handleGoogleSuccess(response.credential)}
            onError={() => toast.error("No fue posible iniciar sesión con Google")}
          />
        </div>

        <button
          type="button"
          onClick={() => navigate("/passwordless-login")}
          className="w-full h-14 border border-[#2d463b] rounded-xl text-white hover:bg-[#22362e] hover:border-[#4adea8]/40 transition-all mt-4"
        >
          Ingresar sin contraseña
        </button>

        <button
          type="button"
          onClick={() => navigate("/register")}
          className="w-full h-14 border-2 border-[#4adea8]/30 text-[#4adea8] rounded-xl font-semibold hover:bg-[#4adea8]/10 transition-all mt-4"
        >
          Crear cuenta
        </button>
      </div>
    </div>
  );
}
