import ShoppingCartCheckoutOutlinedIcon from "@mui/icons-material/ShoppingCartCheckoutOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

type Props = {
  onPagar: () => void;
  disabled?: boolean;
};

export default function PagoFooter({
  onPagar,
  disabled = false,
}: Props) {
  return (
    <div
      className="
        sticky
        bottom-0
        py-5
        bg-gradient-to-t
        from-[#12201b]
        via-[#12201b]
        to-transparent
      "
    >
      <button
        type="button"
        onClick={onPagar}
        disabled={disabled}
        className={`
          w-full
          h-14
          rounded-2xl
          font-bold
          flex
          items-center
          justify-center
          gap-3
          transition-all
          shadow-lg

          ${
            disabled
              ? "bg-[#1a2b24] border border-[#2d463b] text-gray-400 cursor-not-allowed"
              : "bg-[#4adea8] text-[#12201b] hover:brightness-110 active:scale-95 shadow-[#4adea8]/20"
          }
        `}
      >
        {disabled ? (
          <>
            <CheckCircleOutlineOutlinedIcon />

            Sin pagos pendientes
          </>
        ) : (
          <>
            <ShoppingCartCheckoutOutlinedIcon />

            Pagar con Mercado Pago
          </>
        )}
      </button>
    </div>
  );
}