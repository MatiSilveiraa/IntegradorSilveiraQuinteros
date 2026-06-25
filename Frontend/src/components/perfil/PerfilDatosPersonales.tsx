import type { Perfil } from "../../types";

type Props = {
  form: Perfil;
  editando: boolean;
  setForm: React.Dispatch<React.SetStateAction<Perfil>>;
};

export default function PerfilDatosPersonales({
  form,
  editando,
  setForm,
}: Props) {
  return (
    <div
      className="
        bg-[#1a211d]
        border
        border-[#2d463b]
        rounded-2xl
        p-6
        mb-8
      "
    >
      <h2 className="text-xl font-bold mb-6">
        Datos Personales
      </h2>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="text-sm text-gray-400">
            Nombre
          </label>

          <input
            disabled={!editando}
            value={form.nombre}
            onChange={(e) =>
              setForm({
                ...form,
                nombre: e.target.value,
              })
            }
            className="
              mt-2
              w-full
              rounded-xl
              bg-[#2d463b]
              border
              border-transparent
              focus:border-[#4adea8]
              focus:ring-2
              focus:ring-[#4adea8]/30
              transition-all
              px-4
              py-3
            "
          />
        </div>

        <div>
          <label className="text-sm text-gray-400">
            Apellido
          </label>

          <input
            disabled={!editando}
            value={form.apellido}
            onChange={(e) =>
              setForm({
                ...form,
                apellido: e.target.value,
              })
            }
            className="
              mt-2
              w-full
              rounded-xl
              bg-[#2d463b]
              border
              border-transparent
              focus:border-[#4adea8]
              focus:ring-2
              focus:ring-[#4adea8]/30
              transition-all
              px-4
              py-3
            "
          />
        </div>

        <div>
          <label className="text-sm text-gray-400">
            Email
          </label>

          <input
            disabled
            value={form.email}
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
            value={form.celular ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                celular: e.target.value,
              })
            }
            className="
              mt-2
              w-full
              rounded-xl
              bg-[#2d463b]
              border
              border-transparent
              focus:border-[#4adea8]
              focus:ring-2
              focus:ring-[#4adea8]/30
              transition-all
              px-4
              py-3
            "
          />
        </div>
      </div>
    </div>
  );
}