import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

export default function SuccessCard() {
  return (
    <div
      className="
        border
        border-[#4adea8]/30
        rounded-2xl
        p-4
        bg-[#12201b]
      "
    >
      <div className="flex justify-between gap-4">

        <div>

          <div className="flex items-center gap-2">

            <CheckCircleOutlinedIcon
              className="text-[#4adea8]"
            />

            <h3 className="font-bold text-white">
              ¡Inscripción Exitosa!
            </h3>

          </div>

          <p className="text-gray-400 text-sm mt-2">
            Te has unido al grupo de
            Entrenamiento Funcional A.
          </p>

        </div>

        <button
          className="
            bg-[#4adea8]
            text-[#12201b]
            font-semibold
            px-4
            rounded-xl
          "
        >
          Ver mis clases
        </button>

      </div>
    </div>
  );
}