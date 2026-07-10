import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import AlumnoLayout from "../components/layout/DashboardLayout";
import FullScreenLoading from "../components/FullScreenSpinner";

import PerfilHero from "../components/perfil/PerfilHero";
import PerfilStats from "../components/perfil/PerfilStats";
import PerfilAvatar from "../components/perfil/PerfilAvatar";
import PerfilDatosPersonales from "../components/perfil/PerfilDatosPersonales";
import PerfilInformacionMedica from "../components/perfil/PerfilInformacionMedica";
import PerfilCuenta from "../components/perfil/PerfilCuenta";
import PerfilBotones from "../components/perfil/PerfilBotones";

import {
  obtenerMiPerfil,
  actualizarMiPerfil,
} from "../services/Perfil.service";

import type { Perfil } from "../types";

export default function PerfilPage() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [form, setForm] = useState<Perfil>({
    nombre: "",
    apellido: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mostrarConfirmacionCancelar, setMostrarConfirmacionCancelar] =
    useState(false);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        setLoading(true);

        const data = await obtenerMiPerfil();

        setPerfil(data);
        setForm(data);
      } catch (error) {
        console.error(error);
        toast.error("No fue posible cargar el perfil");
      } finally {
        setLoading(false);
      }
    };

    cargarPerfil();
  }, []);

  const iniciarEdicion = () => {
    if (!perfil) return;

    setForm({ ...perfil });
    setEditando(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleGuardar = async () => {
    if (!perfil) return;

    if (!form.nombre.trim() || !form.apellido.trim()) {
      toast.error("Nombre y apellido son obligatorios");
      return;
    }

    try {
      setGuardando(true);

      const datosActualizados: Perfil = {
        ...form,

        // El email original se conserva siempre.
        email: perfil.email,
      };

      await actualizarMiPerfil(datosActualizados);

      setPerfil(datosActualizados);
      setForm(datosActualizados);
      setEditando(false);

      toast.success("Perfil actualizado correctamente");
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.mensaje ??
          "No fue posible actualizar el perfil"
      );
    } finally {
      setGuardando(false);
    }
  };

  const solicitarCancelar = () => {
    setMostrarConfirmacionCancelar(true);
  };

  const confirmarCancelar = () => {
    if (perfil) {
      setForm({ ...perfil });
    }

    setEditando(false);
    setMostrarConfirmacionCancelar(false);

    toast("Se descartaron los cambios");
  };

  if (loading) {
    return <FullScreenLoading />;
  }

  if (!perfil) {
    return null;
  }

  return (
    <AlumnoLayout nombre={perfil.nombre}>
      <main className="max-w-5xl mx-auto">
        <PerfilHero
          nombre={perfil.nombre}
          apellido={perfil.apellido}
          editando={editando}
          onEditar={iniciarEdicion}
        />

        {editando && (
          <div className="mb-8 rounded-3xl border border-[#4adea8]/30 bg-[#4adea8]/10 p-5">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 shrink-0 rounded-2xl border border-[#4adea8]/30 bg-[#12201b] flex items-center justify-center text-[#4adea8] text-xl">
                ✎
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#4adea8]">
                  Estás editando tu perfil
                </h2>

                <p className="text-sm text-gray-300 mt-1">
                  Modificá los campos que necesites y guardá los cambios cuando
                  termines.
                </p>

                <p className="text-sm text-gray-400 mt-2">
                  El correo electrónico está asociado a tu cuenta y no puede
                  modificarse desde esta pantalla.
                </p>
              </div>
            </div>
          </div>
        )}

        <PerfilStats perfil={perfil} />

        <PerfilAvatar
          perfil={editando ? form : perfil}
          editando={editando}
        />

        <PerfilDatosPersonales
          form={form}
          editando={editando}
          setForm={setForm}
        />

        <PerfilInformacionMedica
          form={form}
          editando={editando}
          setForm={setForm}
        />

        <PerfilCuenta perfil={perfil} />

        {editando && (
          <PerfilBotones
            onGuardar={handleGuardar}
            onCancelar={solicitarCancelar}
            guardando={guardando}
          />
        )}
      </main>

      {mostrarConfirmacionCancelar && (
        <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center px-4">
          <div className="w-full max-w-md rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-7 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl mb-5">
              ⚠️
            </div>

            <h2 className="text-2xl font-bold">
              ¿Descartar los cambios?
            </h2>

            <p className="text-gray-400 mt-3 leading-relaxed">
              Las modificaciones realizadas no se guardarán.
            </p>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-7">
              <button
                type="button"
                onClick={() => setMostrarConfirmacionCancelar(false)}
                className="px-5 py-3 rounded-xl border border-[#2d463b] bg-[#12201b] hover:border-[#4adea8] transition-all"
              >
                Seguir editando
              </button>

              <button
                type="button"
                onClick={confirmarCancelar}
                className="px-5 py-3 rounded-xl bg-amber-500 text-black font-bold hover:brightness-110 transition-all"
              >
                Descartar cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </AlumnoLayout>
  );
}