namespace Joki.CasoUsoCompartida.DTOs.Beneficio
{
    public class MiBeneficioResponse
    {
        public int Id { get; set; }
        public string Tipo { get; set; } = string.Empty;


        public string Descripcion { get; set; } = string.Empty;

        public string Estado { get; set; } = string.Empty;

        public int MesesDuracion { get; set; }

        public int MesesAplicados { get; set; }

        public bool CuotaGratis { get; set; }

        public int? DescuentoId { get; set; }

        public decimal? PorcentajeDescuento { get; set; }

        public int? RecompensaId { get; set; }
    }
}