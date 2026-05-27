namespace Joki.CasoUsoCompartida.DTOs.Pago
{
    public class PagoResponse
    {
        public int Id { get; set; }

        public int CuotaId { get; set; }

        public string MedioPago { get; set; } = string.Empty;

        public DateTime FechaPago { get; set; }

        public decimal Monto { get; set; }

        public string? ReferenciaExterna { get; set; }
    }
}