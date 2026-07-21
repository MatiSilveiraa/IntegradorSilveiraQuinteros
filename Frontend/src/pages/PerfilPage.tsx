import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import AlumnoLayout from "../components/layout/DashboardLayout";
import FullScreenLoading from "../components/FullScreenSpinner";

import PerfilHero from "../components/perfil/PerfilHero";
import PerfilStats from "../components/perfil/PerfilStats";
import PerfilAvatar from "../components/perfil/PerfilAvatar";
import PerfilDatosPersonales from "../components/perfil/PerfilDatosPersonales";
import PerfilInformacionMedica from "../components/perfil/PerfilInformacionMedica";
import PerfilBotones from "../components/perfil/PerfilBotones";

import {
  obtenerMiPerfil,
  actualizarMiPerfil,
} from "../services/Perfil.service";

import type { Perfil } from "../types";

export default function PerfilPage() {
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState<Perfil | null>(null);

  const [form, setForm] = useState<Perfil>({
    nombre: "",
    apellido: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [editando, setEditando] = useState(false);

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

    if (!form.nombre.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }

    if (!form.apellido.trim()) {
      toast.error("El apellido es obligatorio");
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
      setEditando(false);

      toast.success("Perfil actualizado correctamente");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.mensaje ??
          "No fue posible actualizar el perfil",
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
    setEditando(false);

    toast("Se descartaron los cambios");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const formatearFecha = (fecha?: string | null) => {
    if (!fecha) return "No especificada";

    const fechaNormalizada = fecha.substring(0, 10);
    const partes = fechaNormalizada.split("-");

    if (partes.length !== 3) {
      return fecha;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  };

  const formatearGenero = (genero?: number | string | null) => {
    if (
      genero === undefined ||
      genero === null ||
      genero === ""
    ) {
      return "No especificado";
    }

    const valor = Number(genero);

    if (valor === 0) return "Masculino";
    if (valor === 1) return "Femenino";
    if (valor === 2) return "Otro";

    return "No especificado";
  };

  if (loading) {
    return <FullScreenLoading />;
  }

  if (!perfil) {
    return null;
  }

  const bloqueado =
    perfil.bloqueadoPorDeuda ||
    perfil.bloqueadoPorInasistencias;

  return (
    <AlumnoLayout nombre={perfil.nombre}>
      <main className="max-w-5xl mx-auto">
        <PerfilHero
          nombre={perfil.nombre}
          apellido={perfil.apellido}
          editando={editando}
          onEditar={iniciarEdicion}
        />

        {!editando && (
          <>
            <div className="flex justify-end mb-6">
              <button
                type="button"
                onClick={iniciarEdicion}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-5
                  py-3
                  rounded-xl
                  bg-[#4adea8]
                  text-[#12201b]
                  font-bold
                  hover:brightness-110
                  active:scale-95
                  transition-all
                "
              >
                <EditOutlinedIcon fontSize="small" />
                Editar perfil
              </button>
            </div>

            <div className="grid gap-8 xl:grid-cols-[320px_1fr] xl:items-start">
              <PerfilAvatar perfil={perfil} editando={false} />

              <div className="space-y-8">
                <PerfilStats perfil={perfil} />

                <section className="rounded-3xl border border-[#2d463b] bg-[#1a211d] p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold">
                      Mi información
                    </h2>

                    <p className="mt-1 text-sm text-gray-400">
                      Datos personales y de contacto asociados a tu perfil.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <DatoPerfil
                      titulo="Nombre completo"
                      valor={`${perfil.nombre} ${perfil.apellido}`}
                    />

                    <DatoPerfil
                      titulo="Correo electrónico"
                      valor={perfil.email}
                    />

                    <DatoPerfil
                      titulo="Celular"
                      valor={perfil.celular || "No especificado"}
                    />

                    <DatoPerfil
                      titulo="Fecha de nacimiento"
                      valor={formatearFecha(perfil.fechaNacimiento)}
                    />

                    <DatoPerfil
                      titulo="Género"
                      valor={formatearGenero(perfil.genero)}
                    />

                    <DatoPerfil
                      titulo="Sociedad médica"
                      valor={
                        perfil.sociedadMedica || "No especificada"
                      }
                    />
                  </div>
                </section>

                {bloqueado && (
                  <section className="rounded-3xl border border-amber-500/30 bg-amber-500/10 p-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-500/30 bg-[#12201b] text-amber-400">
                        <ReportProblemOutlinedIcon />
                      </div>

                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-amber-300">
                          Tu cuenta está bloqueada
                        </h2>

                        <p className="mt-2 text-gray-300">
                          Tenés una deuda pendiente o acumulaste
                          inasistencias. Para volver a inscribirte a clases,
                          tenés que solicitar la reactivación de tu cuenta.
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            navigate("/alumno/reactivacion")
                          }
                          className="
                            mt-5
                            inline-flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-amber-500
                            px-5
                            py-3
                            font-bold
                            text-black
                            hover:brightness-110
                            sm:w-auto
                            transition-all
                          "
                        >
                          Solicitar reactivación
                          <ArrowForwardRoundedIcon fontSize="small" />
                        </button>
                      </div>
                    </div>
                  </section>
                )}
              </div>
            </div>
          </>
        )}

        {editando && (
          <div className="space-y-8">
            <section className="rounded-3xl border border-[#4adea8]/30 bg-[#4adea8]/10 p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#4adea8]/30 bg-[#12201b] text-[#4adea8]">
                  <EditOutlinedIcon />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#4adea8]">
                    Editando tu perfil
                  </h2>

                  <p className="mt-1 text-sm text-gray-300">
                    Modificá los datos necesarios y guardá los cambios
                    cuando termines.
                  </p>

                  <p className="mt-2 text-sm text-gray-400">
                    El correo electrónico está asociado a tu cuenta y no
                    puede modificarse desde esta pantalla.
                  </p>
                </div>
              </div>
            </section>

            <PerfilDatosPersonales
              form={form}
              editando
              setForm={setForm}
            />

            <PerfilInformacionMedica
              form={form}
              editando
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

      {mostrarConfirmacionCancelar && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-3xl border border-[#2d463b] bg-[#1a2b24] p-7 shadow-2xl">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-2xl">
              ⚠️
            </div>

            <h2 className="text-2xl font-bold">
              ¿Descartar los cambios?
            </h2>

            <p className="mt-3 leading-relaxed text-gray-400">
              Las modificaciones realizadas no se guardarán.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setMostrarConfirmacionCancelar(false)
                }
                className="
                  rounded-xl
                  border
                  border-[#2d463b]
                  bg-[#12201b]
                  px-5
                  py-3
                  transition-all
                  hover:border-[#4adea8]
                "
              >
                Seguir editando
              </button>

              <button
                type="button"
                onClick={confirmarCancelar}
                className="
                  rounded-xl
                  bg-amber-500
                  px-5
                  py-3
                  font-bold
                  text-black
                  transition-all
                  hover:brightness-110
                "
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

function DatoPerfil({
  titulo,
  valor,
}: {
  titulo: string;
  valor: string;
}) {
  return (
    <div className="rounded-2xl border border-[#2d463b] bg-[#12201b] p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {titulo}
      </p>

      <p className="mt-2 break-words font-semibold text-gray-100">
        {valor}
      </p>
    </div>
  );
}