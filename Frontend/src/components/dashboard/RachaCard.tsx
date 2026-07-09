import Card from "../ui/Card";

type Props = {
  racha?: number;
};

export default function RachaCard({ racha }: Props) {
  const valor = racha ?? 0;

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[#4adea8] text-sm font-bold uppercase tracking-wide">
            Racha actual
          </p>

          <h3 className="text-5xl font-bold text-white mt-4">
            {valor}
          </h3>

          <p className="text-gray-400 mt-2">
            {valor === 1 ? "asistencia consecutiva" : "asistencias consecutivas"}
          </p>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-2xl">
          🔥
        </div>
      </div>
    </Card>
  );
}