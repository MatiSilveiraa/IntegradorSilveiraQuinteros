import { useEffect, useState } from "react";

import {
  obtenerDesafios,
  crearDesafio,
  editarDesafio,
  eliminarDesafio,
} from "../services/AdminDesafio.Service";

import type { Desafio } from "../types";

export default function AdminDesafiosPage() {

  const [desafios, setDesafios] =
    useState<Desafio[]>([]);

  const [modalAbierto, setModalAbierto] =
    useState(false);

  const [editando, setEditando] =
    useState<Desafio | null>(null);

  const [form, setForm] =
    useState({
      titulo: "",
      descripcion: "",
      fechaInicio: "",
      fechaFin: "",
    });

  const cargarDatos = async () => {

    try {

      const data =
        await obtenerDesafios();

      setDesafios(data);

    } catch (error) {

      console.error(error);

    }

  };

  useEffect(() => {

    cargarDatos();

  }, []);

  const abrirCrear = () => {

    setEditando(null);

    setForm({
      titulo: "",
      descripcion: "",
      fechaInicio: "",
      fechaFin: "",
    });

    setModalAbierto(true);

  };

  const abrirEditar = (
    desafio: Desafio
  ) => {

    setEditando(desafio);

    setForm({
      titulo: desafio.titulo,
      descripcion:
        desafio.descripcion,
      fechaInicio:
        desafio.fechaInicio.substring(
          0,
          16
        ),
      fechaFin:
        desafio.fechaFin.substring(
          0,
          16
        ),
    });

    setModalAbierto(true);

  };

  const guardar = async () => {

    try {

      if (editando) {

        await editarDesafio(
          editando.id!,
          form
        );

      } else {

        await crearDesafio(
          form
        );

      }

      setModalAbierto(false);

      cargarDatos();

    } catch (error) {

      console.error(error);

    }

  };

  const borrar = async (
    id: number
  ) => {

    if (
      !confirm(
        "¿Eliminar desafío?"
      )
    ) {
      return;
    }

    try {

      await eliminarDesafio(
        id
      );

      cargarDatos();

    } catch (error) {

      console.error(error);

    }

  };

  return (
    <div className="min-h-screen bg-[#12201b] text-white p-6">

      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-8">

          <div>

            <h1 className="text-3xl font-bold">
              Desafíos
            </h1>

            <p className="text-gray-400 mt-1">
              Gestión de desafíos.
            </p>

          </div>

          <button
            onClick={abrirCrear}
            className="
              px-4
              py-2
              rounded-lg
              bg-[#4adea8]
              text-[#12201b]
              font-semibold
            "
          >
            Nuevo desafío
          </button>

        </div>

        <div className="grid gap-4">

          {desafios.map(
            (desafio) => (

              <div
                key={desafio.id}
                className="
                  bg-[#1a2b24]
                  border
                  border-[#2d463b]
                  rounded-2xl
                  p-5
                "
              >

                <div className="flex justify-between">

                  <div>

                    <h3 className="text-xl font-bold">
                      {
                        desafio.titulo
                      }
                    </h3>

                    <p className="text-gray-400 mt-2">
                      {
                        desafio.descripcion
                      }
                    </p>

                    <p className="text-sm text-gray-500 mt-4">
                      {new Date(
                        desafio.fechaInicio
                      ).toLocaleDateString()}
                      {" - "}
                      {new Date(
                        desafio.fechaFin
                      ).toLocaleDateString()}
                    </p>

                  </div>

                  <div className="flex gap-2">

                    <button
                      onClick={() =>
                        abrirEditar(
                          desafio
                        )
                      }
                      className="
                        px-3
                        py-2
                        rounded-lg
                        bg-blue-500/20
                        text-blue-400
                      "
                    >
                      Editar
                    </button>

                    <button
                      onClick={() =>
                        borrar(
                          desafio.id!
                        )
                      }
                      className="
                        px-3
                        py-2
                        rounded-lg
                        bg-red-500/20
                        text-red-400
                      "
                    >
                      Eliminar
                    </button>

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      </div>

      {modalAbierto && (

        <div
          className="
            fixed
            inset-0
            bg-black/60
            flex
            items-center
            justify-center
          "
        >

          <div
            className="
              w-full
              max-w-lg
              bg-[#1a2b24]
              rounded-2xl
              p-6
            "
          >

            <h2 className="text-2xl font-bold mb-5">

              {editando
                ? "Editar desafío"
                : "Nuevo desafío"}

            </h2>

            <div className="space-y-4">

              <input
                value={form.titulo}
                onChange={(e) =>
                  setForm({
                    ...form,
                    titulo:
                      e.target.value,
                  })
                }
                placeholder="Título"
                className="
                  w-full
                  p-3
                  rounded-xl
                  bg-[#12201b]
                "
              />

              <textarea
                value={
                  form.descripcion
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    descripcion:
                      e.target.value,
                  })
                }
                placeholder="Descripción"
                className="
                  w-full
                  p-3
                  rounded-xl
                  bg-[#12201b]
                "
              />

              <input
                type="datetime-local"
                value={
                  form.fechaInicio
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    fechaInicio:
                      e.target.value,
                  })
                }
                className="
                  w-full
                  p-3
                  rounded-xl
                  bg-[#12201b]
                "
              />

              <input
                type="datetime-local"
                value={
                  form.fechaFin
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    fechaFin:
                      e.target.value,
                  })
                }
                className="
                  w-full
                  p-3
                  rounded-xl
                  bg-[#12201b]
                "
              />

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() =>
                  setModalAbierto(
                    false
                  )
                }
                className="
                  px-4
                  py-2
                  rounded-lg
                  bg-gray-700
                "
              >
                Cancelar
              </button>

              <button
                onClick={guardar}
                className="
                  px-4
                  py-2
                  rounded-lg
                  bg-[#4adea8]
                  text-[#12201b]
                  font-semibold
                "
              >
                Guardar
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}