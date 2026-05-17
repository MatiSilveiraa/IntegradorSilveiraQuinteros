import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { login } from "../services/Auth.service";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await login(
        email,
        password
      );

      console.log(response);

      localStorage.setItem(
        "token",
        response.token
      );

      localStorage.setItem(
        "usuario",
        JSON.stringify(response.usuario)
      );

      const rol = response.usuario.rol;

      if (rol === "Admin") {
        navigate("/admin");
      } else if (rol === "Alumno") {
        navigate("/alumno");
      } else if (rol === "Entrenador") {
        navigate("/entrenador");
      } else {
        navigate("/");
      }

    } catch (err) {
      console.error(err);

      setError(
        "Email o contraseña incorrectos"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#12201b] flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-8 shadow-2xl">

        {/* LOGO */}

        <div className="flex flex-col items-center">

          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#4adea8] shadow-lg shadow-[#4adea8]/20">

            <img
              src={logo}
              alt="Logo"
              className="w-full h-full object-cover"
            />

          </div>

          <h1 className="text-white text-3xl font-bold mt-6">
            Joki Training Team
          </h1>

          <p className="text-gray-400 mt-2">
            Inicia sesión para continuar
          </p>

        </div>

        {/* ERROR */}

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-xl mt-6 text-sm">
            {error}
          </div>
        )}

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          {/* EMAIL */}

          <div>

            <label className="text-sm text-gray-300 block mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full h-14 px-4 rounded-xl bg-[#12201b] border border-[#2d463b] text-white outline-none focus:border-[#4adea8]"
              required
            />

          </div>

          {/* PASSWORD */}

          <div>

            <label className="text-sm text-gray-300 block mb-2">
              Contraseña
            </label>

            <div className="relative">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="********"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full h-14 px-4 rounded-xl bg-[#12201b] border border-[#2d463b] text-white outline-none focus:border-[#4adea8]"
                required
                autoComplete="current-password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute right-4 top-4 text-gray-400 hover:text-white"
              >
                {showPassword
                  ? "Ocultar"
                  : "Ver"}
              </button>

            </div>

          </div>

          {/* RECUPERAR */}

          <div className="flex justify-end">

            <Link
              to="/forgot-password"
              className="text-sm text-[#4adea8] hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>

          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-[#4adea8] text-[#12201b] font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all"
          >

            {loading
              ? "Ingresando..."
              : "Iniciar sesión"}

          </button>

        </form>

        {/* DIVIDER */}

        <div className="flex items-center gap-4 my-6">

          <div className="flex-1 h-[1px] bg-[#2d463b]"></div>

          <span className="text-gray-500 text-sm">
            o
          </span>

          <div className="flex-1 h-[1px] bg-[#2d463b]"></div>

        </div>

        {/* GOOGLE */}

        <button
          onClick={() =>
            alert(
              "Login con Google próximamente"
            )
          }
          className="w-full h-14 border border-[#2d463b] rounded-xl text-white hover:bg-[#22362e] transition-all"
        >
          Continuar con Google
        </button>

        {/* OTP */}

        <button
          onClick={() =>
            navigate("/otp-login")
          }
          className="w-full h-14 border border-[#2d463b] rounded-xl text-white hover:bg-[#22362e] transition-all mt-4"
        >
          Ingresar sin contraseña
        </button>

        {/* REGISTER */}

        <button
          onClick={() =>
            navigate("/register")
          }
          className="w-full h-14 border-2 border-[#4adea8]/30 text-[#4adea8] rounded-xl font-semibold hover:bg-[#4adea8]/10 transition-all mt-4"
        >
          Crear cuenta
        </button>

      </div>

    </div>
  );
}