import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";

export default function SecurityNote() {
  return (
    <section className="mt-8">
      <div className="bg-[#1a2b24] border border-[#2d463b] rounded-2xl p-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#12201b] border border-[#2d463b] flex items-center justify-center">
            <LockOutlinedIcon className="text-[#4adea8]" />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-white flex items-center gap-2">
              Pago seguro

              <VerifiedUserOutlinedIcon
                fontSize="small"
                className="text-[#4adea8]"
              />
            </h3>

            <p className="text-sm text-gray-400 mt-2 leading-relaxed">
              Todos los pagos online se procesan mediante Mercado Pago.
              Joki no almacena información de tarjetas ni datos bancarios.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}