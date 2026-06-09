namespace Joki.LogicaNegocio.Entidades
{
    public class ConfiguracionCuota
    {
        public int Id { get; set; }

        public decimal MontoMensual { get; set; }

        public DateTime FechaDesde { get; set; }

        public bool Activa { get; set; }

        public ConfiguracionCuota()
        {
            FechaDesde = DateTime.UtcNow;
            Activa = true;
        }
    }
}