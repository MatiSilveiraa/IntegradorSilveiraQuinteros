import Card from "../ui/Card";

type Props = {
  cuota?: any;
};

export default function CuotaCard({
  cuota,
}: Props) {
  return (
    <Card>

      <h3 className="text-[#4adea8] text-xs uppercase font-bold">
        Cuota
      </h3>

      <p className="text-2xl font-bold text-white mt-3">
        {cuota?.estado || "Sin cuota"}
      </p>

    </Card>
  );
}