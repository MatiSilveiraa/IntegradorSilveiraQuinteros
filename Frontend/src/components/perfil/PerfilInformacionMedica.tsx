import type { Perfil } from "../../types";

type Props = {
  form: Perfil;
  editando: boolean;
  setForm: React.Dispatch<React.SetStateAction<Perfil>>;
};

export default function PerfilInformacionMedica({
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

  const estadoClass = editando
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
      <div className="mb-6">
        <h2 className="text-xl font-bold">
          Información médica
        </h2>

        <p className="text-sm text-gray-400 mt-1">
          Datos de contacto médico utilizados ante una eventual emergencia.
        </p>
      </div>

      <div>
        <label className="text-sm text-gray-400">
          Sociedad médica
        </label>

        <input
          type="text"
          disabled={!editando}
          value={form.sociedadMedica ?? ""}
          onChange={(e) =>
            setForm((actual) => ({
              ...actual,
              sociedadMedica: e.target.value,
            }))
          }
          placeholder={editando ? "Ej: ASSE, CAMCEL, Médica Uruguaya" : ""}
          className={`${inputClass} ${estadoClass}`}
        />
      </div>
    </section>
  );
}