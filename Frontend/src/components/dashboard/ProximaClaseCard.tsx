import Card from "../ui/Card";

type Props = {
  clase?: any;
};

export default function ProximaClaseCard({
  clase,
}: Props) {
  return (
    <Card className="lg:col-span-2">

      <span className="text-[#4adea8] text-xs font-bold uppercase">
        Próxima clase
      </span>

      {clase ? (
        <>
          <h2 className="text-2xl font-bold mt-2">
            {clase.nombre}
          </h2>

          <p className="text-gray-400 mt-2">
            {clase.hora}
          </p>
        </>
      ) : (
        <p className="text-gray-400 mt-4">
          No tienes clases programadas.
        </p>
      )}

    </Card>
  );
}