import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function SecurityNote() {
  return (
    <div
      className="
        flex
        items-center
        justify-center
        gap-2
        text-slate-500
        py-4
      "
    >

      <LockOutlinedIcon
        fontSize="small"
      />

      <p className="text-xs">
        Pago procesado de forma segura
      </p>

    </div>
  );
}