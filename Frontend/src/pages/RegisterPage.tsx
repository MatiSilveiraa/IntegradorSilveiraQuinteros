import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import logo from "../assets/logo.png";

import { obtenerGeneros } from "../services/enums.service";
import { login, register } from "../services/Auth.service";

import type { Grupo } from "../types";

type ErroresFormulario = {
  nombre?: string;
  apellido?: string;
  email?: string;
  celular?: string;
  genero?: string;
  fechaNacimiento?: string;
  sociedadMedica?: string;
  estatura?: string;
  peso?: string;
  password?: string;
  confirmPassword?: string;
};

const emailValido = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const obtenerSoloNumeros = (valor: string) => {
  return valor.replace(/\D/g, "");
};

export default function RegisterPage() {
  const navigate = useNavigate();

  const [generos, setGeneros] = useState<Grupo[]>([]);

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [celular, setCelular] = useState("");
  const [genero, setGenero] = useState("");
  const [fechaNacimiento, setFechaNacimiento] =
    useState("");
  const [sociedadMedica, setSociedadMedica] =
    useState("");
  const [estatura, setEstatura] = useState("");
  const [peso, setPeso] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [errores, setErrores] =
    useState<ErroresFormulario>({});

  useEffect(() => {
    const cargarGeneros = async () => {
      try {
        const data = await obtenerGeneros();

        setGeneros(
          Array.isArray(data) ? data : [],
        );
      } catch (error) {
        console.error(
          "[Cargar géneros]",
          error,
        );

        toast.error(
          "No fue posible cargar los géneros",
        );
      }
    };

    void cargarGeneros();
  }, []);

  const limpiarError = (
    campo: keyof ErroresFormulario,
  ) => {
    setErrores((erroresActuales) => {
      if (!erroresActuales[campo]) {
        return erroresActuales;
      }

      const nuevosErrores = {
        ...erroresActuales,
      };

      delete nuevosErrores[campo];

      return nuevosErrores;
    });
  };

  const validarFormulario = () => {
    const nuevosErrores: ErroresFormulario = {};

    const nombreLimpio = nombre.trim();
    const apellidoLimpio = apellido.trim();
    const emailLimpio = email
      .trim()
      .toLowerCase();
    const celularLimpio =
      obtenerSoloNumeros(celular);
    const sociedadMedicaLimpia =
      sociedadMedica.trim();

    const estaturaNumero = Number(estatura);
    const pesoNumero = Number(peso);

    if (!nombreLimpio) {
      nuevosErrores.nombre =
        "El nombre es obligatorio.";
    } else if (nombreLimpio.length < 2) {
      nuevosErrores.nombre =
        "El nombre debe tener al menos 2 caracteres.";
    }

    if (!apellidoLimpio) {
      nuevosErrores.apellido =
        "El apellido es obligatorio.";
    } else if (apellidoLimpio.length < 2) {
      nuevosErrores.apellido =
        "El apellido debe tener al menos 2 caracteres.";
    }

    if (!emailLimpio) {
      nuevosErrores.email =
        "El correo electrónico es obligatorio.";
    } else if (!emailValido(emailLimpio)) {
      nuevosErrores.email =
        "Ingresá un correo electrónico válido.";
    }

    if (!celular.trim()) {
      nuevosErrores.celular =
        "El celular es obligatorio.";
    } else if (celularLimpio.length < 8) {
      nuevosErrores.celular =
        "Ingresá un número de celular válido.";
    }

    if (!genero) {
      nuevosErrores.genero =
        "Debés seleccionar un género.";
    }

    if (!fechaNacimiento) {
      nuevosErrores.fechaNacimiento =
        "La fecha de nacimiento es obligatoria.";
    } else {
      const fechaSeleccionada = new Date(
        `${fechaNacimiento}T00:00:00`,
      );

      const hoy = new Date();

      hoy.setHours(0, 0, 0, 0);

      if (
        Number.isNaN(
          fechaSeleccionada.getTime(),
        )
      ) {
        nuevosErrores.fechaNacimiento =
          "La fecha de nacimiento no es válida.";
      } else if (fechaSeleccionada >= hoy) {
        nuevosErrores.fechaNacimiento =
          "La fecha de nacimiento debe ser anterior a hoy.";
      }
    }

    if (!sociedadMedicaLimpia) {
      nuevosErrores.sociedadMedica =
        "La sociedad médica es obligatoria.";
    }

    if (!estatura.trim()) {
      nuevosErrores.estatura =
        "La estatura es obligatoria.";
    } else if (
      !Number.isFinite(estaturaNumero) ||
      estaturaNumero <= 0
    ) {
      nuevosErrores.estatura =
        "Ingresá una estatura válida.";
    } else if (
      estaturaNumero < 50 ||
      estaturaNumero > 250
    ) {
      nuevosErrores.estatura =
        "La estatura debe estar entre 50 y 250 cm.";
    }

    if (!peso.trim()) {
      nuevosErrores.peso =
        "El peso es obligatorio.";
    } else if (
      !Number.isFinite(pesoNumero) ||
      pesoNumero <= 0
    ) {
      nuevosErrores.peso =
        "Ingresá un peso válido.";
    } else if (
      pesoNumero < 20 ||
      pesoNumero > 350
    ) {
      nuevosErrores.peso =
        "El peso debe estar entre 20 y 350 kg.";
    }

    if (!password) {
      nuevosErrores.password =
        "La contraseña es obligatoria.";
    } else if (password.length < 8) {
      nuevosErrores.password =
        "La contraseña debe tener al menos 8 caracteres.";
    }

    if (!confirmPassword) {
      nuevosErrores.confirmPassword =
        "Debés confirmar la contraseña.";
    } else if (password !== confirmPassword) {
      nuevosErrores.confirmPassword =
        "Las contraseñas no coinciden.";
    }

    setErrores(nuevosErrores);

    const formularioValido =
      Object.keys(nuevosErrores).length === 0;

    if (!formularioValido) {
      toast.error(
        "Revisá los campos marcados antes de continuar.",
      );
    }

    return formularioValido;
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    if (!validarFormulario()) {
      return;
    }

    try {
      setLoading(true);

      const emailNormalizado = email
        .trim()
        .toLowerCase();

      const usuario = {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: emailNormalizado,
        contrasena: password,
        celular: celular.trim(),
        genero: Number(genero),
        fechaNacimiento,
        sociedadMedica:
          sociedadMedica.trim(),
        estatura: Number(estatura),
        peso: Number(peso),
      };

      await register(usuario);

      toast.success(
        "Cuenta creada correctamente",
      );

      const loginResponse = await login(
        emailNormalizado,
        password,
      );

      localStorage.setItem(
        "token",
        loginResponse.token,
      );

      localStorage.setItem(
        "usuario",
        JSON.stringify(
          loginResponse.usuario,
        ),
      );

      const rol =
        loginResponse.usuario?.rol;

      if (rol === "Admin") {
        navigate("/admin");
        return;
      }

      if (rol === "Alumno") {
        navigate("/alumno");
        return;
      }

      if (rol === "Entrenador") {
        navigate("/entrenador");
        return;
      }

      navigate("/");
    } catch (error: any) {
      console.error(
        "[Registrar alumno]",
        error,
      );

      const mensaje =
        error?.response?.data?.mensaje ??
        error?.response?.data?.message ??
        "Ocurrió un error al registrar la cuenta";

      toast.error(mensaje);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#12201b] px-4 py-10 text-white">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-[#2d463b] bg-[#1a2b24] shadow-2xl">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="hidden flex-col justify-between border-r border-[#2d463b] bg-[#0f1b16] p-10 lg:flex">
            <div>
              <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-[#4adea8] shadow-lg shadow-[#4adea8]/20">
                <img
                  src={logo}
                  alt="Logo de Joki"
                  className="h-full w-full object-cover"
                />
              </div>

              <h1 className="mt-8 text-4xl font-bold">
                Sumate a Joki
              </h1>

              <p className="mt-4 leading-relaxed text-gray-400">
                Creá tu cuenta para acceder a tus
                clases, asistencias, cuotas,
                desafíos y beneficios.
              </p>
            </div>

            <div className="mt-auto">
              <div className="mb-6 h-1 w-16 rounded-full bg-[#4adea8]/40" />

              <p className="leading-relaxed text-gray-400">
                Entrená, seguí tu progreso y disfrutá
                de una plataforma pensada para que
                solo te preocupes por mejorar día a
                día.
              </p>
            </div>
          </aside>

          <main className="p-6 md:p-10">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="mb-6 text-sm text-gray-400 transition-all hover:text-[#4adea8]"
            >
              ← Volver al inicio de sesión
            </button>

            <div className="mb-8 flex flex-col items-center text-center lg:hidden">
              <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-[#4adea8] shadow-lg shadow-[#4adea8]/20">
                <img
                  src={logo}
                  alt="Logo de Joki"
                  className="h-full w-full object-cover"
                />
              </div>

              <h1 className="mt-5 text-3xl font-bold">
                Crear cuenta
              </h1>

              <p className="mt-2 text-gray-400">
                Sumate a Joki Training Team.
              </p>
            </div>

            <div className="mb-8 hidden lg:block">
              <span className="inline-flex rounded-full border border-[#4adea8]/30 bg-[#4adea8]/10 px-4 py-2 text-sm font-bold text-[#4adea8]">
                Registro de alumno
              </span>

              <h2 className="mt-5 text-3xl font-bold">
                Crear cuenta
              </h2>

              <p className="mt-2 text-gray-400">
                Completá tus datos para empezar a
                usar la plataforma.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-6"
            >
              <section>
                <h3 className="mb-4 text-lg font-bold text-[#4adea8]">
                  Datos personales
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Nombre *"
                    value={nombre}
                    onChange={(value) => {
                      setNombre(value);
                      limpiarError("nombre");
                    }}
                    placeholder="Juan"
                    error={errores.nombre}
                    autoComplete="given-name"
                  />

                  <Input
                    label="Apellido *"
                    value={apellido}
                    onChange={(value) => {
                      setApellido(value);
                      limpiarError("apellido");
                    }}
                    placeholder="Pérez"
                    error={errores.apellido}
                    autoComplete="family-name"
                  />

                  <div className="md:col-span-2">
                    <Input
                      label="Correo electrónico *"
                      type="email"
                      value={email}
                      onChange={(value) => {
                        setEmail(value);
                        limpiarError("email");
                      }}
                      placeholder="juan@email.com"
                      error={errores.email}
                      autoComplete="email"
                    />
                  </div>

                  <Input
                    label="Celular *"
                    type="tel"
                    value={celular}
                    onChange={(value) => {
                      setCelular(value);
                      limpiarError("celular");
                    }}
                    placeholder="099 123 456"
                    error={errores.celular}
                    autoComplete="tel"
                  />

                  <div>
                    <label
                      htmlFor="genero"
                      className="mb-2 block text-sm text-gray-300"
                    >
                      Género *
                    </label>

                    <select
                      id="genero"
                      value={genero}
                      onChange={(event) => {
                        setGenero(
                          event.target.value,
                        );
                        limpiarError("genero");
                      }}
                      aria-invalid={
                        Boolean(errores.genero)
                      }
                      className={`h-14 w-full rounded-xl border bg-[#12201b] px-4 text-white outline-none transition-all ${
                        errores.genero
                          ? "border-red-500 focus:border-red-400"
                          : "border-[#2d463b] focus:border-[#4adea8]"
                      }`}
                    >
                      <option value="">
                        Seleccionar
                      </option>

                      {generos.map((item) => (
                        <option
                          key={item.id}
                          value={item.id}
                        >
                          {item.nombre}
                        </option>
                      ))}
                    </select>

                    {errores.genero && (
                      <p className="mt-2 text-xs font-medium text-red-400">
                        {errores.genero}
                      </p>
                    )}
                  </div>

                  <Input
                    label="Fecha de nacimiento *"
                    type="date"
                    value={fechaNacimiento}
                    onChange={(value) => {
                      setFechaNacimiento(value);
                      limpiarError(
                        "fechaNacimiento",
                      );
                    }}
                    error={
                      errores.fechaNacimiento
                    }
                    autoComplete="bday"
                  />
                </div>
              </section>

              <section>
                <h3 className="mb-4 text-lg font-bold text-[#4adea8]">
                  Salud
                </h3>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="md:col-span-3">
                    <Input
                      label="Sociedad médica *"
                      value={sociedadMedica}
                      onChange={(value) => {
                        setSociedadMedica(value);
                        limpiarError(
                          "sociedadMedica",
                        );
                      }}
                      placeholder="Ej: Médica Uruguaya"
                      error={
                        errores.sociedadMedica
                      }
                    />
                  </div>

                  <Input
                    label="Estatura en centímetros *"
                    type="number"
                    value={estatura}
                    onChange={(value) => {
                      setEstatura(value);
                      limpiarError("estatura");
                    }}
                    placeholder="175"
                    error={errores.estatura}
                    min="50"
                    max="250"
                    step="1"
                    inputMode="numeric"
                  />

                  <Input
                    label="Peso en kilogramos *"
                    type="number"
                    value={peso}
                    onChange={(value) => {
                      setPeso(value);
                      limpiarError("peso");
                    }}
                    placeholder="70"
                    error={errores.peso}
                    min="20"
                    max="350"
                    step="0.1"
                    inputMode="decimal"
                  />
                </div>
              </section>

              <section>
                <h3 className="mb-4 text-lg font-bold text-[#4adea8]">
                  Seguridad
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <PasswordInput
                    label="Contraseña *"
                    value={password}
                    onChange={(value) => {
                      setPassword(value);
                      limpiarError("password");

                      if (
                        confirmPassword &&
                        value === confirmPassword
                      ) {
                        limpiarError(
                          "confirmPassword",
                        );
                      }
                    }}
                    visible={showPassword}
                    onToggle={() =>
                      setShowPassword(
                        (valorActual) =>
                          !valorActual,
                      )
                    }
                    error={errores.password}
                    autoComplete="new-password"
                  />

                  <PasswordInput
                    label="Confirmar contraseña *"
                    value={confirmPassword}
                    onChange={(value) => {
                      setConfirmPassword(value);
                      limpiarError(
                        "confirmPassword",
                      );
                    }}
                    visible={showConfirmPassword}
                    onToggle={() =>
                      setShowConfirmPassword(
                        (valorActual) =>
                          !valorActual,
                      )
                    }
                    error={
                      errores.confirmPassword
                    }
                    autoComplete="new-password"
                  />
                </div>

                <p className="mt-3 text-xs text-gray-500">
                  La contraseña debe tener al menos
                  8 caracteres.
                </p>
              </section>

              <button
                type="submit"
                disabled={loading}
                className="h-14 w-full rounded-xl bg-[#4adea8] font-bold text-[#12201b] transition-all hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading
                  ? "Creando cuenta..."
                  : "Crear cuenta"}
              </button>

              <p className="text-center text-sm text-gray-400">
                ¿Ya tenés cuenta?{" "}
                <Link
                  to="/"
                  className="font-bold text-[#4adea8] hover:underline"
                >
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

type InputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  autoComplete?: string;
  min?: string;
  max?: string;
  step?: string;
  inputMode?:
    | "none"
    | "text"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal"
    | "search";
};

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  autoComplete,
  min,
  max,
  step,
  inputMode,
}: InputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm text-gray-300">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        autoComplete={autoComplete}
        min={min}
        max={max}
        step={step}
        inputMode={inputMode}
        aria-invalid={Boolean(error)}
        className={`h-14 w-full rounded-xl border bg-[#12201b] px-4 text-white outline-none transition-all ${
          error
            ? "border-red-500 focus:border-red-400"
            : "border-[#2d463b] focus:border-[#4adea8]"
        }`}
      />

      {error && (
        <p className="mt-2 text-xs font-medium text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

type PasswordInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
  error?: string;
  autoComplete?: string;
};

function PasswordInput({
  label,
  value,
  onChange,
  visible,
  onToggle,
  error,
  autoComplete,
}: PasswordInputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm text-gray-300">
        {label}
      </label>

      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder="••••••••"
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          className={`h-14 w-full rounded-xl border bg-[#12201b] px-4 pr-20 text-white outline-none transition-all ${
            error
              ? "border-red-500 focus:border-red-400"
              : "border-[#2d463b] focus:border-[#4adea8]"
          }`}
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-white"
        >
          {visible ? "Ocultar" : "Ver"}
        </button>
      </div>

      {error && (
        <p className="mt-2 text-xs font-medium text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}