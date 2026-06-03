import Card from "../ui/Card";

export default function NovedadesCard() {
  return (
    <Card className="lg:col-span-2">

      <h3 className="text-[#4adea8] text-xs uppercase font-bold">
        Novedades
      </h3>

      <p className="text-xl font-bold mt-3 text-white">
        Próximamente novedades de Joki Training Team
      </p>

      <p className="text-gray-400 mt-2">
        Aquí aparecerán anuncios y eventos.
      </p>

    </Card>
  );
}