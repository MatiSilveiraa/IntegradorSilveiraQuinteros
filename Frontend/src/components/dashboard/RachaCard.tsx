import Card from "../ui/Card";

type Props = {
  racha?: number;
};

export default function RachaCard({
  racha,
}: Props) {
  return (
    <Card>

      <h3 className="text-[#4adea8] text-xs uppercase font-bold">
        Racha actual
      </h3>

      <p className="text-3xl font-bold text-white mt-3">
        {racha ?? 0}
      </p>

      <p className="text-gray-400 text-sm">
        días consecutivos
      </p>

    </Card>
  );
}