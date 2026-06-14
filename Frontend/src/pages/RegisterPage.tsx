import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { obtenerGeneros } from "../services/enums.service";
import { register } from "../services/Auth.service";

import type { ApiError, Grupo } from "../types";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [preview, setPreview] =
    useState<string | null>(null);

  const [generos, setGeneros] = useState([]);

  const [genero, setGenero] = useState("");

  const [nombre, setNombre] = useState("");

  const [apellido, setApellido] = useState("");

  const [email, setEmail] = useState("");

  const [celular, setCelular] = useState("");

  const [sociedadMedica, setSociedadMedica] =
    useState("");

  const [estatura, setEstatura] = useState("");

  const [peso, setPeso] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [fechaNacimiento, setFechaNacimiento] =
    useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    cargarGeneros();
  }, []);

  const cargarGeneros = async () => {
    try {
      const data = await obtenerGeneros();

      setGeneros(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    try {
      if (
        !nombre ||
        !apellido ||
        !email ||
        !password ||
        !confirmPassword
      ) {
        setError(
          "Completa los campos obligatorios"
        );

        return;
      }

      if (!email.includes("@")) {
        setError("Correo inválido");

        return;
      }

      if (password.length < 8) {
        setError(
          "La contraseña debe tener mínimo 8 caracteres"
        );

        return;
      }

      if (password !== confirmPassword) {
        setError(
          "Las contraseñas no coinciden"
        );

        return;
      }

      const usuario = {
        nombre,
        apellido,
        email,
        contrasena: password,
        peso: peso ? Number(peso) : 0,
        estatura: estatura
          ? Number(estatura)
          : 0,
        celular,
        fechaNacimiento:
          fechaNacimiento || null,
        genero: Number(genero),
        sociedadMedica,
      };

      const response = await register(usuario);

      console.log(response);

      setError("");

      alert("Usuario registrado correctamente");
    } catch (error: ApiError) {
      console.log(error);

      if (
        error.response?.data?.mensaje
      ) {
        setError(
          error.response.data.mensaje
        );
      } else {
        setError(
          "Ocurrió un error al registrar"
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1511] text-white">
      <header className="bg-black/70 backdrop-blur-md border-b border-[#1f2a25] h-16 flex items-center px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-[#4adea8]/30">
            <img
              src={logo}
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className="font-bold text-xl">
            Joki Training Team
          </h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-5 py-8">
        <div className="mb-8">
          <h2 className="text-4xl text-center font-extrabold leading-tight">
            Únete al Team
          </h2>

          <p className="text-gray-400 text-center mt-3">
            Completa tus datos para comenzar
            tu transformación con Joki
            Training Team.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          <section className="bg-[#1a211d] border border-[#2f3632] rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[#6cfbc3] text-xl">
                👤
              </span>

              <h3 className="text-[#6cfbc3] font-bold text-2xl">
                Datos Personales
              </h3>
            </div>

            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <label
                  htmlFor="profileImage"
                  className="cursor-pointer"
                >
                  <div className="w-28 h-28 rounded-full border-2 border-dashed border-[#6cfbc3]/50 bg-[#2f3632] flex items-center justify-center overflow-hidden">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl">
                        📷
                      </span>
                    )}
                  </div>
                </label>

                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file =
                      e.target.files?.[0];

                    if (file) {
                      const imageUrl =
                        URL.createObjectURL(
                          file
                        );

                      setPreview(imageUrl);
                    }
                  }}
                />

                <label
                  htmlFor="profileImage"
                  className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[#6cfbc3] text-black font-bold flex items-center justify-center cursor-pointer"
                >
                  ✎
                </label>
              </div>

              <span className="text-sm text-gray-400 mt-3">
                Foto de perfil
              </span>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block mb-2 font-medium">
                  Nombre *
                </label>

                <input
                  type="text"
                  placeholder="Ej. Juan"
                  value={nombre}
                  onChange={(e) =>
                    setNombre(e.target.value)
                  }
                  className="w-full h-14 rounded-2xl bg-[#121916] border border-[#3c4a42] px-4 text-white outline-none focus:border-[#6cfbc3]"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Apellido *
                </label>

                <input
                  type="text"
                  placeholder="Ej. Pérez"
                  value={apellido}
                  onChange={(e) =>
                    setApellido(
                      e.target.value
                    )
                  }
                  className="w-full h-14 rounded-2xl bg-[#121916] border border-[#3c4a42] px-4 text-white outline-none focus:border-[#6cfbc3]"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Correo electrónico *
                </label>

                <input
                  type="email"
                  placeholder="juan.perez@ejemplo.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full h-14 rounded-2xl bg-[#121916] border border-[#3c4a42] px-4 text-white outline-none focus:border-[#6cfbc3]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium">
                    Género
                  </label>

                  <select
                    value={genero}
                    onChange={(e) =>
                      setGenero(
                        e.target.value
                      )
                    }
                    className="w-full h-14 rounded-2xl bg-[#121916] border border-[#3c4a42] px-4 text-white outline-none"
                  >
                    <option value="">
                      Seleccionar
                    </option>

                    {generos.map(
                      (g: Grupo) => (
                        <option
                          key={g.id}
                          value={g.id}
                        >
                          {g.nombre}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Nacimiento
                  </label>

                  <input
                    type="date"
                    value={fechaNacimiento}
                    onChange={(e) =>
                      setFechaNacimiento(
                        e.target.value
                      )
                    }
                    className="w-full h-14 rounded-2xl bg-[#121916] border border-[#3c4a42] px-4 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Celular *
                </label>

                <div className="flex gap-3">
                  <div className="w-24 h-14 rounded-2xl bg-[#2f3632] border border-[#3c4a42] flex items-center justify-center text-gray-300">
                    +598
                  </div>

                  <input
                    type="tel"
                    placeholder="099 123 456"
                    value={celular}
                    onChange={(e) =>
                      setCelular(
                        e.target.value
                      )
                    }
                    className="flex-1 h-14 rounded-2xl bg-[#121916] border border-[#3c4a42] px-4 text-white outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[#1a211d] border border-[#2f3632] rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[#6cfbc3] text-xl">
                🛡️
              </span>

              <h3 className="text-[#6cfbc3] font-bold text-2xl">
                Información de Salud
              </h3>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block mb-2 font-medium">
                  Sociedad médica
                </label>

                <input
                  type="text"
                  placeholder="Ej. Médica Uruguaya"
                  value={sociedadMedica}
                  onChange={(e) =>
                    setSociedadMedica(
                      e.target.value
                    )
                  }
                  className="w-full h-14 rounded-2xl bg-[#121916] border border-[#3c4a42] px-4 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium">
                    Estatura (cm)
                  </label>

                  <input
                    type="number"
                    placeholder="175"
                    value={estatura}
                    onChange={(e) =>
                      setEstatura(
                        e.target.value
                      )
                    }
                    className="w-full h-14 rounded-2xl bg-[#121916] border border-[#3c4a42] px-4 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">
                    Peso (kg)
                  </label>

                  <input
                    type="number"
                    placeholder="70"
                    value={peso}
                    onChange={(e) =>
                      setPeso(e.target.value)
                    }
                    className="w-full h-14 rounded-2xl bg-[#121916] border border-[#3c4a42] px-4 text-white outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[#1a211d] border border-[#2f3632] rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[#6cfbc3] text-xl">
                🔒
              </span>

              <h3 className="text-[#6cfbc3] font-bold text-2xl">
                Seguridad
              </h3>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block mb-2 font-medium">
                  Contraseña *
                </label>

                <div className="relative">
                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    className="w-full h-14 rounded-2xl bg-[#121916] border border-[#3c4a42] px-4 pr-14 text-white outline-none"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-4 top-4"
                  >
                    👁️
                  </button>
                </div>

                <p className="text-xs text-gray-400 mt-2">
                  Mínimo 8 caracteres.
                </p>
              </div>

              <div>
                <label className="block mb-2 font-medium">
                  Confirmar contraseña *
                </label>

                <div className="relative">
                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    className="w-full h-14 rounded-2xl bg-[#121916] border border-[#3c4a42] px-4 pr-14 text-white outline-none"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-4 top-4"
                  >
                    👁️
                  </button>
                </div>
              </div>
            </div>
          </section>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-2xl p-4 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full h-16 rounded-2xl bg-[#4adea8] text-[#003826] font-bold text-xl shadow-lg shadow-[#4adea8]/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Crear cuenta
            </button>
          </div>

          <div className="text-center">
            <span className="text-gray-400">
              ¿Ya tengo cuenta?
            </span>

            <Link
              to="/"
              className="ml-2 text-[#6cfbc3] font-bold underline"
            >
              Inicia sesión
            </Link>
          </div>
        </form>

        <div className="flex flex-col items-center mt-16 opacity-40">
          <div className="w-14 h-1 bg-gray-600 rounded-full mb-6"></div>

          <p className="text-xs tracking-[0.3em] text-gray-500">
            JOKI TRAINING TEAM © 2024
          </p>
        </div>
      </main>
    </div>
  );
} 