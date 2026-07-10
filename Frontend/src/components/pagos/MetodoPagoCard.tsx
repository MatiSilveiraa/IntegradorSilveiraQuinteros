import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

type Props = {
  metodo?: string;
  descripcion?: string;
};

export default function MetodoPagoCard({
  metodo = "Mercado Pago",
  descripcion = "Tarjetas de crédito, débito y medios habilitados.",
}: Props) {
  return (
    <section className="h-full">
      <div className="mb-4">
        <p className="text-[#4adea8] text-sm font-bold uppercase tracking-wide">
          Método de pago
        </p>

        <h2 className="text-2xl font-bold text-white mt-2">
          Pago online
        </h2>

        <p className="text-sm text-gray-400 mt-2">
          El pago se procesa de forma automática.
        </p>
      </div>

      <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-5 h-full">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 shrink-0 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center">
            <PaymentsOutlinedIcon className="text-sky-300" />
          </div>

          <div className="min-w-0">
            <h3 className="text-lg font-bold text-white">
              {metodo}
            </h3>

            <p className="text-sm text-gray-400 mt-1">
              {descripcion}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex items-start gap-3 bg-[#12201b] border border-[#2d463b] rounded-2xl p-4">
            <LockOutlinedIcon
              className="text-[#4adea8] mt-0.5"
              fontSize="small"
            />

            <div>
              <p className="text-sm font-semibold text-white">
                Pago seguro
              </p>

              <p className="text-xs text-gray-500 mt-1">
                La operación se completa en la plataforma de Mercado Pago.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[#12201b] border border-[#2d463b] rounded-2xl p-4">
            <InfoOutlinedIcon
              className="text-gray-400 mt-0.5"
              fontSize="small"
            />

            <div>
              <p className="text-sm font-semibold text-white">
                Pagos manuales
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Los pagos en efectivo o transferencia los registra el
                administrador.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}