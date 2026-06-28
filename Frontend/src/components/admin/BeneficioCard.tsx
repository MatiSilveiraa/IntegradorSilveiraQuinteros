import type { BeneficioPendienteAdmin } from "../../types";

type Props = {
  beneficio: BeneficioPendienteAdmin;
};

export default function BeneficioCard({ beneficio }: Props) {
  const estado = beneficio.estado.toUpperCase();

  const progreso =
    beneficio.mesesDuracion > 0
      ? Math.min(
          100,
          Math.round(
            (beneficio.mesesAplicados / beneficio.mesesDuracion) * 100
          )
        )
      : 0;

  const obtenerBadgeEstado = () => {
    if (estado === "CANCELADO") {
      return {
        texto: "Cancelado",
        clase: "bg-red-500/10 text-red-400 border-red-500/30",
      };
    }

    if (estado === "OTORGADO") {
      return {
        texto: "Completado",
        clase: "bg-[#4adea8]/10 text-[#4adea8] border-[#4adea8]/30",
      };
    }

    if (beneficio.mesesAplicados > 0) {
      return {
        texto: "En uso",
        clase: "bg-[#4adea8]/10 text-[#4adea8] border-[#4adea8]/30",
      };
    }

    return {
      texto: "Pendiente",
      clase: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30",
    };
  };

  const obtenerInfo = () => {
    if (estado === "CANCELADO") {
      return {
        titulo: "Beneficio cancelado",
        descripcion: "Este beneficio fue cancelado y ya no volverá a aplicarse.",
        clase: "border-red-500/30 bg-red-500/10 text-red-400",
      };
    }

    if (estado === "OTORGADO") {
      return {
        titulo: "Beneficio completado",
        descripcion: "Este beneficio ya fue aplicado en su totalidad.",
        clase: "border-[#4adea8]/30 bg-[#4adea8]/10 text-[#4adea8]",
      };
    }

    if (beneficio.mesesAplicados > 0) {
      return {
        titulo: "Beneficio en uso",
        descripcion:
          "Este beneficio ya comenzó a aplicarse y continuará aplicándose automáticamente hasta completar su duración.",
        clase: "border-[#4adea8]/30 bg-[#4adea8]/10 text-[#4adea8]",
      };
    }

    return {
      titulo: "Aplicación automática",
      descripcion:
        "Este beneficio se aplicará automáticamente cuando se genere la próxima cuota mensual. El administrador no necesita realizar ninguna acción.",
      clase: "border-sky-500/30 bg-sky-500/10 text-sky-300",
    };
  };

  const badgeEstado = obtenerBadgeEstado();
  const info = obtenerInfo();

  return (
    <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6 hover:border-[#4adea8]/40 transition-all">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${
              beneficio.cuotaGratis
                ? "bg-blue-500/10 text-blue-300"
                : "bg-[#4adea8]/10 text-[#4adea8]"
            }`}
          >
            {beneficio.cuotaGratis ? "🎁 Cuota gratis" : "💸 Descuento"}
          </span>

          <h2 className="text-xl font-bold">
            {beneficio.nombreAlumno} {beneficio.apellidoAlumno}
          </h2>
        </div>

        <span
          className={`px-3 py-1 rounded-full border text-xs font-semibold whitespace-nowrap ${badgeEstado.clase}`}
        >
          {badgeEstado.texto}
        </span>
      </div>

      <p className="text-gray-300 mb-5">
        Beneficio generado automáticamente por desafío o regla del sistema.
      </p>

      <div className="mb-5 bg-[#12201b] border border-[#2d463b] rounded-2xl p-4">
        <p className="text-sm text-gray-400">
          {beneficio.cuotaGratis ? "Beneficio" : "Descuento"}
        </p>

        <p
          className={`text-2xl font-bold mt-1 ${
            beneficio.cuotaGratis ? "text-blue-300" : "text-[#4adea8]"
          }`}
        >
          {beneficio.cuotaGratis ? "Cuota gratis" : `${beneficio.descuento}%`}
        </p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Meses aplicados</span>

          <span className="font-semibold">
            {beneficio.mesesAplicados} / {beneficio.mesesDuracion} meses
          </span>
        </div>

        <div className="w-full h-3 rounded-full bg-[#12201b] border border-[#2d463b] overflow-hidden">
          <div
            className="h-full bg-[#4adea8]"
            style={{
              width: `${progreso}%`,
            }}
          />
        </div>
      </div>

      <div className={`rounded-2xl border p-4 ${info.clase}`}>
        <p className="text-sm font-bold">{info.titulo}</p>

        <p className="text-sm text-gray-300 mt-2 leading-relaxed">
          {info.descripcion}
        </p>
      </div>
    </div>
  );
}