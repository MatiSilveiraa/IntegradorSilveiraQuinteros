namespace Joki.CasoUsoCompartida.DTOs.Historial
{
    public class HistorialCuotaResponse
    {
        public int Id { get; set; }

        public int Mes { get; set; }

        public int Anio { get; set; }

        public decimal MontoFinal { get; set; }

        public string Estado { get; set; } = string.Empty;
    }
}