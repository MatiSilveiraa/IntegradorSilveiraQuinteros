import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";

type Props = {
  descripcion?: string;
};

export default function MetodoPagoCard({
  descripcion = "Podés utilizar tarjetas, dinero disponible en tu cuenta y otros medios habilitados por Mercado Pago.",
}: Props) {
  return (
    <section className="h-full">
      <div className="mb-4">
        <p className="text-[#4adea8] text-xs sm:text-sm font-bold uppercase tracking-[0.14em]">
          Método de pago
        </p>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
          Pagá de forma segura
        </h2>

        <p className="text-sm text-gray-400 mt-2 leading-relaxed">
          La operación se procesa directamente en Mercado Pago.
        </p>
      </div>

      <article className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-4 sm:p-5 h-full shadow-lg shadow-black/10 transition-all duration-300 hover:border-sky-400/40 hover:shadow-xl">
        <div className="relative overflow-hidden rounded-3xl bg-white min-h-32 sm:min-h-36 p-6 sm:p-8 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-sky-100 opacity-80" />

          <img
            src="/Mercado_Pago.svg.webp"
            alt="Mercado Pago"
            className="relative z-10 max-h-16 sm:max-h-20 w-full max-w-72 object-contain"
          />
        </div>

        <p className="text-sm text-gray-400 mt-5 leading-relaxed">
          {descripcion}
        </p>

        <div className="mt-5 space-y-3">
          <BeneficioPago
            icono={
              <LockOutlinedIcon
                className="text-[#4adea8]"
                fontSize="small"
              />
            }
            titulo="Pago 100% seguro"
            descripcion="Joki no almacena los datos de tu tarjeta."
          />

          <BeneficioPago
            icono={
              <CreditCardOutlinedIcon
                className="text-sky-400"
                fontSize="small"
              />
            }
            titulo="Diferentes medios"
            descripcion="Tarjetas, saldo disponible y medios habilitados."
          />

          <BeneficioPago
            icono={
              <BoltOutlinedIcon
                className="text-amber-300"
                fontSize="small"
              />
            }
            titulo="Confirmación automática"
            descripcion="La cuota se actualiza cuando el pago es aprobado."
          />

          <BeneficioPago
            icono={
              <InfoOutlinedIcon
                className="text-purple-300"
                fontSize="small"
              />
            }
            titulo="Pago por cuota"
            descripcion="Elegí individualmente una cuota pendiente o vencida."
          />
        </div>
      </article>
    </section>
  );
}

function BeneficioPago({
  icono,
  titulo,
  descripcion,
}: {
  icono: React.ReactNode;
  titulo: string;
  descripcion: string;
}) {
  return (
    <div className="flex items-start gap-3 bg-[#12201b] border border-[#2d463b] rounded-2xl p-4 transition-all duration-300 hover:border-[#4adea8]/30">
      <div className="w-10 h-10 shrink-0 rounded-xl bg-[#1a2b24] border border-[#2d463b] flex items-center justify-center">
        {icono}
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-white">
          {titulo}
        </p>

        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
          {descripcion}
        </p>
      </div>
    </div>
  );
}