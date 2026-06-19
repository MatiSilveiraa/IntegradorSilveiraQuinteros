import { useEffect, useState } from "react";
import {
  obtenerMiPerfil,
  actualizarMiPerfil,
} from "../services/Perfil.service";
import AlumnoLayout from "../components/layout/AlumnoLayout";
import toast from "react-hot-toast";

import type { Perfil } from "../types";
import { useNavigate } from "react-router-dom";
import FullScreenLoading from "../components/FullScreenSpinner";

export default function PerfilPage() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);

  const [form, setForm] = useState<Perfil>({
    nombre: "",
    apellido: "",
    email: "",
  });

  useEffect(() => {
  const cargarPerfil = async () => {
    try {
      const data =
        await obtenerMiPerfil();

      setPerfil(data);
      setForm(data);
    } catch (error) {
      console.error(error);

      toast.error(
        "No fue posible cargar el perfil"
      );
    } finally {
      setLoading(false);
    }
  };

  cargarPerfil();
}, []);

  const handleGuardar = async () => {
    try {
      await actualizarMiPerfil(form);

      setPerfil(form);

      setEditando(false);

      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      console.error(error);

      toast.error("No fue posible actualizar el perfil");
    }
  };

  const handleCancelar = () => {
    if (perfil) {
      setForm(perfil);
    }

    setEditando(false);

    toast("Edición cancelada");
  };

  if (loading) {
  return <FullScreenLoading />;
}
  return (
  <AlumnoLayout nombre={perfil?.nombre}>
    <main className="max-w-4xl mx-auto">
      {/* HERO */}

      <div
        className="
          rounded-3xl
          border
          border-[#4adea8]/20
          bg-gradient-to-r
          from-[#1a2b24]
          to-[#163129]
          p-8
          mb-8
        "
      >
        <span
          className="
            inline-block
            px-3
            py-1
            rounded-full
            bg-[#4adea8]
            text-[#12201b]
            text-xs
            font-bold
          "
        >
          PERFIL
        </span>

        <h1 className="text-4xl font-bold mt-4">
          {perfil?.nombre} {perfil?.apellido}
        </h1>

        <p className="text-gray-300 mt-2">
          Gestiona tu información personal y médica.
        </p>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">
          Mi Perfil
        </h2>

        {!editando && (
          <button
            onClick={() =>
              setEditando(true)
            }
            className="
              px-5
              py-3
              rounded-xl
              bg-[#4adea8]
              text-[#12201b]
              font-bold
            "
          >
            Editar Perfil
          </button>
        )}
      </div>

      {/* AVATAR */}

      <div className="flex flex-col items-center mb-8">
        <div
          className="
            w-28
            h-28
            rounded-full
            border-4
            border-[#4adea8]
            bg-[#1a211d]
            flex
            items-center
            justify-center
          "
        >
          <span className="text-4xl font-bold text-[#4adea8]">
            {`${perfil?.nombre?.charAt(0) ?? ""}${
              perfil?.apellido?.charAt(0) ?? ""
            }`}
          </span>
        </div>

        <h2 className="mt-4 text-2xl font-bold">
          {perfil?.nombre} {perfil?.apellido}
        </h2>

        <p className="text-gray-400">
          {perfil?.email}
        </p>
      </div>

      {/* DATOS PERSONALES */}

      <div
        className="
          bg-[#1a211d]
          border
          border-[#2d463b]
          rounded-2xl
          p-6
          mb-6
        "
      >
        <h2 className="text-xl font-bold mb-5">
          Datos Personales
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm text-gray-400">
              Nombre
            </label>

            <input
              disabled={!editando}
              value={form.nombre || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  nombre:
                    e.target.value,
                })
              }
              className="
                mt-2
                w-full
                rounded-xl
                bg-[#2d463b]
                px-4
                py-3
                text-white
              "
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">
              Apellido
            </label>

            <input
              disabled={!editando}
              value={
                form.apellido || ""
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  apellido:
                    e.target.value,
                })
              }
              className="
                mt-2
                w-full
                rounded-xl
                bg-[#2d463b]
                px-4
                py-3
                text-white
              "
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">
              Email
            </label>

            <input
              disabled
              value={form.email || ""}
              className="
                mt-2
                w-full
                rounded-xl
                bg-[#1f2d27]
                px-4
                py-3
                text-gray-400
              "
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">
              Celular
            </label>

            <input
              disabled={!editando}
              value={form.celular || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  celular:
                    e.target.value,
                })
              }
              className="
                mt-2
                w-full
                rounded-xl
                bg-[#2d463b]
                px-4
                py-3
                text-white
              "
            />
          </div>
        </div>
      </div>

      {/* INFORMACIÓN MÉDICA */}

      <div
        className="
          bg-[#1a211d]
          border
          border-[#2d463b]
          rounded-2xl
          p-6
          mb-6
        "
      >
        <h2 className="text-xl font-bold mb-5">
          Información Médica
        </h2>

        <label className="text-sm text-gray-400">
          Sociedad Médica
        </label>

        <input
          disabled={!editando}
          value={
            form.sociedadMedica || ""
          }
          onChange={(e) =>
            setForm({
              ...form,
              sociedadMedica:
                e.target.value,
            })
          }
          className="
            mt-2
            w-full
            rounded-xl
            bg-[#2d463b]
            px-4
            py-3
            text-white
          "
        />
      </div>

      {/* INFORMACIÓN DE CUENTA */}

      <div
        className="
          bg-[#1a211d]
          border
          border-[#2d463b]
          rounded-2xl
          p-6
        "
      >
        <h2 className="text-xl font-bold mb-5">
          Información de Cuenta
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div
            className="
              bg-[#12201b]
              rounded-xl
              p-4
            "
          >
            <p className="text-gray-400 text-sm">
              Racha actual
            </p>

            <h3 className="text-3xl font-bold mt-2">
              {
                perfil?.rachaAsistenciaMensual
              }
            </h3>
          </div>

          <div
            className="
              bg-[#12201b]
              rounded-xl
              p-4
            "
          >
            <p className="text-gray-400 text-sm">
              Estado
            </p>

            <h3
              className={`text-2xl font-bold mt-2 ${
                perfil?.bloqueadoPorInasistencias ||
                perfil?.bloqueadoPorImpago
                  ? "text-red-400"
                  : "text-[#4adea8]"
              }`}
            >
              {perfil?.bloqueadoPorInasistencias ||
              perfil?.bloqueadoPorImpago
                ? "Bloqueado"
                : "Activo"}
            </h3>
          </div>
        </div>

        {(perfil?.bloqueadoPorInasistencias ||
          perfil?.bloqueadoPorImpago) && (
          <button
            onClick={() =>
              navigate(
                "/alumno/reactivacion"
              )
            }
            className="
              w-full
              py-4
              rounded-xl
              bg-amber-500
              text-black
              font-bold
              hover:opacity-90
              transition-all
            "
          >
            Solicitar Reactivación
          </button>
        )}
      </div>

      {/* BOTONES */}

      {editando && (
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleGuardar}
            className="
              flex-1
              bg-[#4adea8]
              text-[#12201b]
              py-4
              rounded-xl
              font-bold
            "
          >
            Guardar cambios
          </button>

          <button
            onClick={handleCancelar}
            className="
              flex-1
              border
              border-[#2d463b]
              py-4
              rounded-xl
            "
          >
            Cancelar
          </button>
        </div>
      )}
    </main>
  </AlumnoLayout>
)
}