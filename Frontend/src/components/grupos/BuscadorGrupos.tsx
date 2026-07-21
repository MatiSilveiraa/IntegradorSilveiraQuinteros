import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";

type Props = {
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
};

export default function BuscadorGrupos({
  value,
  onChange,
}: Props) {
  return (
    <div className="relative">

      <SearchOutlinedIcon
        className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-gray-400
        "
      />

      <input
        value={value}
        onChange={onChange}
        placeholder="Buscar por nombre, nivel, día u horario"
        className="
          w-full
          h-14
          pl-12
          pr-12
          rounded-xl
          bg-[#1a2b24]
          border
          border-[#2d463b]
          text-white
        "
      />

      <button
        className="
          absolute
          right-4
          top-1/2
          -translate-y-1/2
          text-gray-400
        "
      >
        <TuneOutlinedIcon />
      </button>

    </div>
  );
}