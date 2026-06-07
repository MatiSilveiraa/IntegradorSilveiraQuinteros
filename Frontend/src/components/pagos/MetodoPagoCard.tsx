import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";

type Props = {
  metodo?: string;
  descripcion?: string;
};

export default function MetodoPagoCard({
  metodo = "Mercado Pago",
  descripcion = "Tarjetas de crédito o débito",
}: Props) {
  return (
    <div>

      <h2 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">
        Método de pago
      </h2>

      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-1">

        <button
          className="
            w-full
            flex
            items-center
            gap-4
            p-4
            rounded-lg
            hover:bg-slate-700/30
            transition-colors
            group
          "
        >

          <div
            className="
              size-12
              rounded-lg
              bg-sky-500
              flex
              items-center
              justify-center
              shrink-0
              shadow-lg
              shadow-sky-500/20
            "
          >
            <PaymentsOutlinedIcon
              className="text-white"
            />
          </div>

          <div className="flex-1 text-left">

            <p className="font-semibold text-slate-100">
              {metodo}
            </p>

            <p className="text-xs text-slate-400">
              {descripcion}
            </p>

          </div>

          <ChevronRightOutlinedIcon
            className="
              text-[#4adea8]
              group-hover:translate-x-1
              transition-transform
            "
          />

        </button>

      </div>

    </div>
  );
}