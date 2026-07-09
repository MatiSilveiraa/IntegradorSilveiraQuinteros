import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import logo from "../assets/logo.png";
import { obtenerGeneros } from "../services/enums.service";
import { register, login } from "../services/Auth.service";
import type { Grupo } from "../types";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [generos, setGeneros] = useState<Grupo[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
  const [genero, setGenero] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [sociedadMedica, setSociedadMedica] = useState("");
  const [estatura, setEstatura] = useState("");
  const [peso, setPeso] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const cargarGeneros = async () => {
      try {
        const data = await obtenerGeneros();
        setGeneros(data);
      } catch (error) {
        console.error(error);
      }
    };

    cargarGeneros();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !apellido || !email || !password || !confirmPassword) {
      toast.error("Completá los campos obligatorios");
      return;
    }

    if (!email.includes("@")) {
      toast.error("Correo inválido");
      return;
    }

    if (password.length < 8) {
      toast.error("La contraseña debe tener mínimo 8 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    try {
      setLoading(true);

      const usuario = {
        nombre,
        apellido,
        email,
        contrasena: password,
        peso: peso ? Number(peso) : 0,
        estatura: estatura ? Number(estatura) : 0,
        celular,
        fechaNacimiento: fechaNacimiento || undefined,
        genero: genero ? Number(genero) : 0,
        sociedadMedica,
      };

      await register(usuario);

      toast.success("Cuenta creada correctamente");

      const loginResponse = await login(email, password);

      localStorage.setItem("token", loginResponse.token);
      localStorage.setItem("usuario", JSON.stringify(loginResponse.usuario));

      const rol = loginResponse.usuario.rol;

      if (rol === "Admin") navigate("/admin");
      else if (rol === "Alumno") navigate("/alumno");
      else if (rol === "Entrenador") navigate("/entrenador");
      else navigate("/");
    } catch (error: any) {
      console.error(error);

      toast.error(error.response?.data?.mensaje ?? "Ocurrió un error al registrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#12201b] text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-[#1a2b24] border border-[#2d463b] rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="hidden lg:flex flex-col justify-between bg-[#0f1b16] border-r border-[#2d463b] p-10">
            <div>
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#4adea8] shadow-lg shadow-[#4adea8]/20">
                <img src={logo} alt="Logo" className="w-full h-full object-cover" />
              </div>

              <h1 className="text-4xl font-bold mt-8">
                Sumate a Joki
              </h1>

              <p className="text-gray-400 mt-4 leading-relaxed">
                Creá tu cuenta para acceder a tus clases, asistencias, cuotas,
                desafíos y beneficios.
              </p>
            </div>

            <div className="mt-auto">
  <div className="w-16 h-1 rounded-full bg-[#4adea8]/40 mb-6" />

  <p className="text-gray-400 leading-relaxed">
    Entrená, seguí tu progreso y disfrutá de una plataforma pensada para que
    solo te preocupes por mejorar día a día.
  </p>
</div>
          </aside>

          <main className="p-6 md:p-10">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mb-6 text-sm text-gray-400 hover:text-[#4adea8] transition-all"
            >
              ← Volver al inicio de sesión
            </button>

            <div className="lg:hidden flex flex-col items-center text-center mb-8">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#4adea8] shadow-lg shadow-[#4adea8]/20">
                <img src={logo} alt="Logo" className="w-full h-full object-cover" />
              </div>

              <h1 className="text-3xl font-bold mt-5">Crear cuenta</h1>

              <p className="text-gray-400 mt-2">
                Sumate a Joki Training Team.
              </p>
            </div>

            <div className="hidden lg:block mb-8">
              <span className="inline-flex px-4 py-2 rounded-full bg-[#4adea8]/10 border border-[#4adea8]/30 text-[#4adea8] text-sm font-bold">
                Registro de alumno
              </span>

              <h2 className="text-3xl font-bold mt-5">Crear cuenta</h2>

              <p className="text-gray-400 mt-2">
                Completá tus datos para empezar a usar la plataforma.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <section>
                <h3 className="text-lg font-bold text-[#4adea8] mb-4">
                  Datos personales
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input label="Nombre *" value={nombre} onChange={setNombre} placeholder="Juan" />
                  <Input label="Apellido *" value={apellido} onChange={setApellido} placeholder="Pérez" />

                  <div className="md:col-span-2">
                    <Input
                      label="Correo electrónico *"
                      type="email"
                      value={email}
                      onChange={setEmail}
                      placeholder="juan@email.com"
                    />
                  </div>

                  <Input label="Celular" value={celular} onChange={setCelular} placeholder="099 123 456" />

                  <div>
                    <label className="text-sm text-gray-300 block mb-2">
                      Género
                    </label>

                    <select
                      value={genero}
                      onChange={(e) => setGenero(e.target.value)}
                      className="w-full h-14 px-4 rounded-xl bg-[#12201b] border border-[#2d463b] text-white outline-none focus:border-[#4adea8]"
                    >
                      <option value="">Seleccionar</option>

                      {generos.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    label="Fecha de nacimiento"
                    type="date"
                    value={fechaNacimiento}
                    onChange={setFechaNacimiento}
                  />
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-[#4adea8] mb-4">
                  Salud
                </h3>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-3">
                    <Input
                      label="Sociedad médica"
                      value={sociedadMedica}
                      onChange={setSociedadMedica}
                      placeholder="Ej: Médica Uruguaya"
                    />
                  </div>

                  <Input
                    label="Estatura"
                    type="number"
                    value={estatura}
                    onChange={setEstatura}
                    placeholder="175"
                  />

                  <Input
                    label="Peso"
                    type="number"
                    value={peso}
                    onChange={setPeso}
                    placeholder="70"
                  />
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold text-[#4adea8] mb-4">
                  Seguridad
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <PasswordInput
                    label="Contraseña *"
                    value={password}
                    onChange={setPassword}
                    visible={showPassword}
                    onToggle={() => setShowPassword(!showPassword)}
                  />

                  <PasswordInput
                    label="Confirmar contraseña *"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    visible={showConfirmPassword}
                    onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                </div>

                <p className="text-xs text-gray-500 mt-3">
                  La contraseña debe tener al menos 8 caracteres.
                </p>
              </section>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-[#4adea8] text-[#12201b] font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? "Creando cuenta..." : "Crear cuenta"}
              </button>

              <p className="text-center text-sm text-gray-400">
                ¿Ya tenés cuenta?{" "}
                <Link to="/" className="text-[#4adea8] font-bold hover:underline">
                  Iniciá sesión
                </Link>
              </p>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm text-gray-300 block mb-2">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-14 px-4 rounded-xl bg-[#12201b] border border-[#2d463b] text-white outline-none focus:border-[#4adea8]"
      />
    </div>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
  visible,
  onToggle,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <label className="text-sm text-gray-300 block mb-2">
        {label}
      </label>

      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
          className="w-full h-14 px-4 pr-20 rounded-xl bg-[#12201b] border border-[#2d463b] text-white outline-none focus:border-[#4adea8]"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-4 text-gray-400 hover:text-white text-sm"
        >
          {visible ? "Ocultar" : "Ver"}
        </button>
      </div>
    </div>
  );
}