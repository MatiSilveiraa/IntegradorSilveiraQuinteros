import ShoppingCartCheckoutOutlinedIcon from "@mui/icons-material/ShoppingCartCheckoutOutlined";

type Props = {
  onPagar: () => void;
  disabled?: boolean;
};

export default function PagoFooter({
  onPagar,
  disabled,
}: Props) {

  return (
    <div
      className="
        sticky
        bottom-0
        p-4
        bg-gradient-to-t
        from-[#12201b]
        via-[#12201b]
        to-transparent
      "
    >

      <button
        onClick={onPagar}
        disabled={disabled}
        className="
          w-full
          bg-[#4adea8]
          hover:bg-[#4adea8]/90
          text-[#12201b]
          font-bold
          py-4
          rounded-xl
          flex
          items-center
          justify-center
          gap-2
          transition-all
          active:scale-95
          shadow-lg
          shadow-[#4adea8]/20
          disabled:opacity-50
        "
      >

        <ShoppingCartCheckoutOutlinedIcon />

        Ir a pagar

      </button>

    </div>
  );
}