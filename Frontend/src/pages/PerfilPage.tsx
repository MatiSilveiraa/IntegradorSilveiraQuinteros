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
          onEditar={() => setEditando(true)}
        />

        <PerfilStats perfil={perfil} />

        <PerfilAvatar perfil={perfil} />

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
            onCancelar={handleCancelar}
          />
        )}
      </main>
    </AlumnoLayout>
  );
}
