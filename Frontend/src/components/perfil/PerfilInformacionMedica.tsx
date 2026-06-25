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
        Información Médica
      </h2>

      <label className="text-sm text-gray-400">
        Sociedad Médica
      </label>

      <input
        disabled={!editando}
        value={form.sociedadMedica ?? ""}
        onChange={(e) =>
          setForm({
            ...form,
            sociedadMedica: e.target.value,
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
  );
}