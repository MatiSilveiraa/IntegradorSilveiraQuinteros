import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

export default function WarningCard() {
  return (
    <div
      className="
        border
        border-orange-500/30
        bg-orange-500/5
        rounded-2xl
        p-4
      "
    >
      <div className="flex gap-3">

        <WarningAmberOutlinedIcon
          className="text-orange-400"
        />

        <div>

          <h3 className="text-orange-300 font-semibold">
            Superposición horaria
          </h3>

          <p className="text-orange-200/70 text-sm mt-1">
            Este grupo coincide con tu clase
            de Yoga Flow los miércoles a las 19:00.
          </p>

        </div>

      </div>
    </div>
  );
}