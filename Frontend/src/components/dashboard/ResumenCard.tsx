import Card from "../ui/Card";

type Props = {
  historial?: any;
};

export default function ResumenCard({
  historial,
}: Props) {
  return (
    <Card className="lg:col-span-2">

      <h3 className="text-[#4adea8] text-xs uppercase font-bold mb-4">
        Resumen
      </h3>

      <div className="grid grid-cols-3 gap-4">

        <div>
          <p className="text-gray-400 text-sm">
            Asistencias
          </p>

          <p className="text-2xl font-bold">
            {historial?.asistencias?.length ?? 0}
          </p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">
            Pagos
          </p>

          <p className="text-2xl font-bold">
            {historial?.pagos?.length ?? 0}
          </p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">
            Cuotas
          </p>

          <p className="text-2xl font-bold">
            {historial?.cuotas?.length ?? 0}
          </p>
        </div>

      </div>

    </Card>
  );
}