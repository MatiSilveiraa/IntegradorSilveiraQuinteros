import Card from "../ui/Card";

export default function NovedadesCard() {
  return (
    <Card className="lg:col-span-2">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[#4adea8] text-sm font-bold uppercase tracking-wide">
            Novedades
          </p>

          <h3 className="text-2xl font-bold mt-4 text-white">
            Próximamente novedades de Joki
          </h3>

          <p className="text-gray-400 mt-2">
            Acá vas a ver avisos importantes, cambios de clases y beneficios.
          </p>
        </div>

        <div className="hidden md:flex w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 items-center justify-center text-2xl">
          🔔
        </div>
      </div>
    </Card>
  );
}