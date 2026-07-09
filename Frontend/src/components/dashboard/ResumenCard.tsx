import Card from "../ui/Card";
import type { Historial } from "../../types";

type Props = {
  historial?: Historial;
};

export default function ResumenCard({ historial }: Props) {
  const asistencias = historial?.asistencias?.length ?? 0;
  const pagos = historial?.pagos?.length ?? 0;
  const cuotas = historial?.cuotas?.length ?? 0;

  return (
    <Card className="lg:col-span-2">
      <p className="text-[#4adea8] text-sm font-bold uppercase tracking-wide mb-5">
        Tu actividad
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        <Item titulo="Asistencias" valor={asistencias} icono="📅" />
        <Item titulo="Pagos" valor={pagos} icono="💳" />
        <Item titulo="Cuotas" valor={cuotas} icono="📌" />
      </div>
    </Card>
  );
}

function Item({
  titulo,
  valor,
  icono,
}: {
  titulo: string;
  valor: number;
  icono: string;
}) {
  return (
    <div className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-4">
      <p className="text-2xl">{icono}</p>

      <p className="text-3xl font-bold mt-3">{valor}</p>

      <p className="text-sm text-gray-400 mt-1">{titulo}</p>
    </div>
  );
}