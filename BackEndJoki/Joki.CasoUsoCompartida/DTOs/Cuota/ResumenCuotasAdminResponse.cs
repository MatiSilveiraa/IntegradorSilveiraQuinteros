namespace Joki.CasoUsoCompartida.DTOs.Cuota
{
    public class ResumenCuotasAdminResponse
    {
        public int TotalCuotas { get; set; }

        public int Pendientes { get; set; }

        public int Pagadas { get; set; }

        public int Vencidas { get; set; }

        public decimal Recaudado { get; set; }

        public decimal MontoPendiente { get; set; }
    }
}