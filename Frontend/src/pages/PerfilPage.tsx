import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";

import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import MedicalInformationOutlinedIcon from "@mui/icons-material/MedicalInformationOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

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

type SeccionPerfil =
  | "resumen"
  | "datos-personales"
  | "informacion-medica"
  | "cuenta"
  | "editar";

export default function PerfilPage() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);

  const [form, setForm] = useState<Perfil>({
    nombre: "",
    apellido: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [seccionActiva, setSeccionActiva] = useState<SeccionPerfil>("resumen");

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

    void cargarPerfil();
  }, []);

  const contenidoRef = useRef<HTMLDivElement>(null);

  const cambiarSeccion = (seccion: SeccionPerfil) => {
    setSeccionActiva(seccion);

    setTimeout(() => {
      contenidoRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  };

  const iniciarEdicion = () => {
    if (!perfil) return;

    setForm({ ...perfil });
    cambiarSeccion("editar");
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
        email: perfil.email,
      };

      await actualizarMiPerfil(datosActualizados);

      setPerfil(datosActualizados);
      setForm(datosActualizados);

      cambiarSeccion("resumen");

      toast.success("Perfil actualizado correctamente");
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.mensaje ?? "No fue posible actualizar el perfil",
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

    setMostrarConfirmacionCancelar(false);
    cambiarSeccion("resumen");

    toast("Se descartaron los cambios");
  };

  if (loading) {
    return <FullScreenLoading />;
  }

  if (!perfil) {
    return null;
  }

  const editando = seccionActiva === "editar";

  return (
    <AlumnoLayout nombre={perfil.nombre}>
      <main className="max-w-5xl mx-auto">
        {/* HERO */}

        <PerfilHero
          nombre={perfil.nombre}
          apellido={perfil.apellido}
          editando={editando}
          onEditar={iniciarEdicion}
        />

        {/* NAVEGACIÓN */}
        <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-3 mb-8">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <BotonSeccion
              activo={seccionActiva === "resumen"}
              icono={<PersonOutlineOutlinedIcon />}
              texto="Resumen"
              onClick={() => cambiarSeccion("resumen")}
            />

            <BotonSeccion
              activo={seccionActiva === "datos-personales"}
              icono={<BadgeOutlinedIcon />}
              texto="Datos personales"
              onClick={() => cambiarSeccion("datos-personales")}
            />

            <BotonSeccion
              activo={seccionActiva === "informacion-medica"}
              icono={<MedicalInformationOutlinedIcon />}
              texto="Información médica"
              onClick={() => cambiarSeccion("informacion-medica")}
            />

            <BotonSeccion
              activo={seccionActiva === "cuenta"}
              icono={<ManageAccountsOutlinedIcon />}
              texto="Cuenta"
              onClick={() => cambiarSeccion("cuenta")}
            />

            <BotonSeccion
              activo={seccionActiva === "editar"}
              icono={<EditOutlinedIcon />}
              texto="Editar perfil"
              onClick={iniciarEdicion}
            />
          </div>
        </div>

        {/* 
  AL HACER CLICK EN UN BOTÓN,
  EL SCROLL BAJA HASTA ACÁ
*/}
        <div ref={contenidoRef} className="scroll-mt-6">
          {seccionActiva === "resumen" && (
            <div className="space-y-8">
              <PerfilStats perfil={perfil} />

              <PerfilAvatar perfil={perfil} editando={false} />
            </div>
          )}

          {seccionActiva === "datos-personales" && (
            <PerfilDatosPersonales
              form={perfil}
              editando={false}
              setForm={setForm}
            />
          )}

          {seccionActiva === "informacion-medica" && (
            <PerfilInformacionMedica
              form={perfil}
              editando={false}
              setForm={setForm}
            />
          )}

          {seccionActiva === "cuenta" && <PerfilCuenta perfil={perfil} />}

          {seccionActiva === "editar" && (
            <div className="space-y-8">
              <PerfilAvatar perfil={form} editando={true} />

              <PerfilDatosPersonales
                form={form}
                editando={true}
                setForm={setForm}
              />

              <PerfilInformacionMedica
                form={form}
                editando={true}
                setForm={setForm}
              />

              <PerfilBotones
                onGuardar={handleGuardar}
                onCancelar={solicitarCancelar}
                guardando={guardando}
              />
            </div>
          )}
        </div>

        {/* RESUMEN */}

        {seccionActiva === "resumen" && (
          <div className="space-y-8">
            <PerfilStats perfil={perfil} />

            <PerfilAvatar perfil={perfil} editando={false} />
          </div>
        )}

        {/* DATOS PERSONALES */}

        {seccionActiva === "datos-personales" && (
          <PerfilDatosPersonales
            form={perfil}
            editando={false}
            setForm={setForm}
          />
        )}

        {/* INFORMACIÓN MÉDICA */}

        {seccionActiva === "informacion-medica" && (
          <PerfilInformacionMedica
            form={perfil}
            editando={false}
            setForm={setForm}
          />
        )}

        {/* CUENTA */}

        {seccionActiva === "cuenta" && <PerfilCuenta perfil={perfil} />}

        {/* EDITAR PERFIL */}

        {seccionActiva === "editar" && (
          <div className="space-y-8">
            <div className="rounded-3xl border border-[#4adea8]/30 bg-[#4adea8]/10 p-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 shrink-0 rounded-2xl border border-[#4adea8]/30 bg-[#12201b] flex items-center justify-center text-[#4adea8]">
                  <EditOutlinedIcon />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#4adea8]">
                    Editar perfil
                  </h2>

                  <p className="text-sm text-gray-300 mt-1">
                    Modificá los datos que necesites y guardá los cambios cuando
                    termines.
                  </p>

                  <p className="text-sm text-gray-400 mt-2">
                    El correo electrónico está asociado a tu cuenta y no puede
                    modificarse desde esta pantalla.
                  </p>
                </div>
              </div>
            </div>

            <PerfilAvatar perfil={form} editando={true} />

            <PerfilDatosPersonales
              form={form}
              editando={true}
              setForm={setForm}
            />

            <PerfilInformacionMedica
              form={form}
              editando={true}
              setForm={setForm}
            />

            <PerfilBotones
              onGuardar={handleGuardar}
              onCancelar={solicitarCancelar}
              guardando={guardando}
            />
          </div>
        )}
      </main>

      {/* MODAL CANCELAR */}

      {mostrarConfirmacionCancelar && (
        <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center px-4">
          <div className="w-full max-w-md rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-7 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl mb-5">
              ⚠️
            </div>

            <h2 className="text-2xl font-bold">¿Descartar los cambios?</h2>

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

function BotonSeccion({
  activo,
  icono,
  texto,
  onClick,
}: {
  activo: boolean;
  icono: React.ReactNode;
  texto: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        min-h-20
        flex
        flex-col
        items-center
        justify-center
        gap-2
        px-3
        py-4
        rounded-2xl
        text-sm
        font-bold
        transition-all
        ${
          activo
            ? "bg-[#4adea8] text-[#12201b]"
            : "bg-[#12201b] border border-[#2d463b] text-gray-300 hover:border-[#4adea8] hover:text-[#4adea8]"
        }
      `}
    >
      {icono}
      <span>{texto}</span>
    </button>
  );
}
