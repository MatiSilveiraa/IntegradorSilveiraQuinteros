namespace Joki.CasoUsoCompartida.DTOs.Historial
{
    public class HistorialPagoResponse
    {
        public int Id { get; set; }

        public int CuotaId { get; set; }

        public string MedioPago { get; set; } = string.Empty;

        public DateTime FechaPago { get; set; }

        public decimal Monto { get; set; }

        public string Estado { get; set; } = string.Empty;

        public string? ReferenciaExterna { get; set; }
    }
}