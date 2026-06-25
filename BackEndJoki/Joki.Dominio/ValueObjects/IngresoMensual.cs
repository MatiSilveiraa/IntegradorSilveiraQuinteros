namespace Joki.LogicaNegocio.ValueObjects
{
    public class IngresoMensual
    {
        public int Mes { get; init; }

        public int Anio { get; init; }

        public decimal Total { get; init; }

        public IngresoMensual()
        {
        }

        public IngresoMensual(
            int mes,
            int anio,
            decimal total)
        {
            Mes = mes;
            Anio = anio;
            Total = total;
        }
    }
}