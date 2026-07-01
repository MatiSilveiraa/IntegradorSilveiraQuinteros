import type { Descuento } from "../../types";

type TipoRecompensa =
  | "PRODUCTO_REGALO"
  | "DESCUENTO_CUOTA"
  | "CUOTA_GRATIS";

type FormRecompensa = {
  descripcion: string;
  tipo: TipoRecompensa;
  premioFisico: string;
  descuentoId: string;
};

type Props = {
  form: FormRecompensa;
  descuentoSeleccionado?: Descuento;
};

export default function VistaPreviaRecompensa({
  form,
  descuentoSeleccionado,
}: Props) {
  if (form.tipo === "PRODUCTO_REGALO") {
    return (
      <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 p-4">
        <p className="text-sky-300 font-bold">
          Vista previa: premio físico
        </p>

        <p className="text-sm text-gray-300 mt-2">
          Los ganadores recibirán:{" "}
          <strong>
            {form.premioFisico || "premio físico sin definir"}
          </strong>
          .
        </p>
      </div>
    );
  }

  if (form.tipo === "DESCUENTO_CUOTA") {
    return (
      <div className="rounded-2xl border border-[#4adea8]/30 bg-[#4adea8]/10 p-4">
        <p className="text-[#4adea8] font-bold">
          Vista previa: descuento
        </p>

        {descuentoSeleccionado ? (
          <p className="text-sm text-gray-300 mt-2">
            Los ganadores recibirán un descuento de{" "}
            <strong>{descuentoSeleccionado.porcentaje}%</strong> durante{" "}
            <strong>
              {descuentoSeleccionado.mesesDuracion} mes
              {descuentoSeleccionado.mesesDuracion > 1 ? "es" : ""}
            </strong>
            .
          </p>
        ) : (
          <p className="text-sm text-gray-300 mt-2">
            Seleccioná un descuento para ver la vista previa.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-4">
      <p className="text-purple-300 font-bold">
        Vista previa: cuota gratis
      </p>

      <p className="text-sm text-gray-300 mt-2">
        Los ganadores recibirán una cuota gratis.
      </p>
    </div>
  );
}