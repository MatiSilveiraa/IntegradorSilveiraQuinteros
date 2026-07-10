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
  const inputClass = `
    mt-2
    w-full
    rounded-xl
    px-4
    py-3
    outline-none
    transition-all
  `;

  const editableClass = editando
    ? `
        bg-[#12201b]
        border
        border-[#4adea8]/50
        text-white
        focus:border-[#4adea8]
        focus:ring-2
        focus:ring-[#4adea8]/20
      `
    : `
        bg-[#1f2d27]
        border
        border-transparent
        text-gray-300
        cursor-default
      `;

  return (
    <section className="bg-[#1a211d] border border-[#2d463b] rounded-3xl p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold">
            Datos personales
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            Información básica asociada a tu cuenta.
          </p>
        </div>

        {editando && (
          <span className="self-start px-3 py-1 rounded-full bg-[#4adea8]/10 border border-[#4adea8]/30 text-[#4adea8] text-xs font-bold">
            Campos editables
          </span>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="text-sm text-gray-400">
            Nombre
          </label>

          <input
            type="text"
            disabled={!editando}
            value={form.nombre}
            onChange={(e) =>
              setForm((actual) => ({
                ...actual,
                nombre: e.target.value,
              }))
            }
            className={`${inputClass} ${editableClass}`}
          />
        </div>

        <div>
          <label className="text-sm text-gray-400">
            Apellido
          </label>

          <input
            type="text"
            disabled={!editando}
            value={form.apellido}
            onChange={(e) =>
              setForm((actual) => ({
                ...actual,
                apellido: e.target.value,
              }))
            }
            className={`${inputClass} ${editableClass}`}
          />
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <label className="text-sm text-gray-400">
              Correo electrónico
            </label>

            <span className="text-xs text-gray-500">
              🔒 No editable
            </span>
          </div>

          <input
            type="email"
            disabled
            value={form.email}
            className={`${inputClass} bg-[#151f1a] border border-[#2d463b] text-gray-500 cursor-not-allowed`}
          />

          <p className="text-xs text-gray-500 mt-2">
            El correo se utiliza para identificar tu cuenta e iniciar sesión.
          </p>
        </div>

        <div>
          <label className="text-sm text-gray-400">
            Celular
          </label>

          <input
            type="tel"
            disabled={!editando}
            value={form.celular ?? ""}
            onChange={(e) =>
              setForm((actual) => ({
                ...actual,
                celular: e.target.value,
              }))
            }
            placeholder={editando ? "Ej: 099123456" : ""}
            className={`${inputClass} ${editableClass}`}
          />
        </div>

        <div>
          <label className="text-sm text-gray-400">
            Fecha de nacimiento
          </label>

          <input
            type="date"
            disabled={!editando}
            value={
              form.fechaNacimiento
                ? form.fechaNacimiento.substring(0, 10)
                : ""
            }
            onChange={(e) =>
              setForm((actual) => ({
                ...actual,
                fechaNacimiento: e.target.value,
              }))
            }
            className={`${inputClass} ${editableClass}`}
          />
        </div>

        <div>
          <label className="text-sm text-gray-400">
            Género
          </label>

          <select
            disabled={!editando}
            value={form.genero ?? ""}
            onChange={(e) =>
              setForm((actual) => ({
                ...actual,
                genero:
                  e.target.value === ""
                    ? undefined
                    : Number(e.target.value),
              }))
            }
            className={`${inputClass} ${editableClass}`}
          >
            <option value="">No especificado</option>
            <option value={0}>Masculino</option>
            <option value={1}>Femenino</option>
            <option value={2}>Otro</option>
          </select>
        </div>
      </div>
    </section>
  );
}