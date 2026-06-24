import { useNavigate } from "react-router-dom";

interface Props {
  motivo: string | null;
}

export default function BlockedAccountAlert({ motivo }: Props) {
  const navigate = useNavigate();

  if (!motivo) {
    return null;
  }

  const esImpago = motivo === "deuda";

  return (
    <div
      className="
        mb-6
        rounded-2xl
        p-5
        border
        bg-red-500/10
        border-red-500/30
      "
    >
      <h3 className="font-bold text-red-400 text-lg">
        {esImpago
          ? "Cuenta bloqueada por deuda"
          : "Cuenta bloqueada por inasistencias"}
      </h3>

      <p className="mt-2 text-gray-300">
        {esImpago
          ? "Tienes cuotas pendientes de pago. No podrás realizar nuevas inscripciones hasta regularizar tu situación."
          : "Tu cuenta fue bloqueada por inasistencias. Debes solicitar una reactivación."}
      </p>

      <button
        onClick={() =>
          navigate(esImpago ? "/alumno/pagos" : "/alumno/reactivacion")
        }
        className="
          mt-4
          px-5
          py-3
          rounded-xl
          bg-red-500
          text-white
          font-bold
        "
      >
        {esImpago ? "Ir a Pagos" : "Solicitar Reactivación"}
      </button>
    </div>
  );
}
