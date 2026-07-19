import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";

export default function SecurityNote() {
  return (
    <section className="mt-6">
      <div className="bg-[#1a2b24] border border-[#2d463b] rounded-2xl px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 shrink-0 rounded-xl bg-[#12201b] border border-[#2d463b] flex items-center justify-center">
            <LockOutlinedIcon
              className="text-[#4adea8]"
              sx={{ fontSize: 18 }}
            />
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold text-sm text-white flex items-center gap-2">
              Pago seguro

              <VerifiedUserOutlinedIcon
                sx={{ fontSize: 16 }}
                className="text-[#4adea8]"
              />
            </h3>

            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Mercado Pago procesa la operación. Joki no almacena datos bancarios.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
