namespace Joki.CasoUsoCompartida.DTOs.Recompensa
{
    public class CrearRecompensaRequest
    {
        public int DesafioId { get; set; }

        public string Descripcion { get; set; } = string.Empty;

        public string Tipo { get; set; } = string.Empty;

        public string? PremioFisico { get; set; }

        public int? DescuentoId { get; set; }

        public bool OtorgaCuotaGratis { get; set; }
    }
}