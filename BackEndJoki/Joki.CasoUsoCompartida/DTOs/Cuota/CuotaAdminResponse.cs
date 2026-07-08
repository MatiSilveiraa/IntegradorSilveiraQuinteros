namespace Joki.CasoUsoCompartida.DTOs.Cuota
{
    public class CuotaAdminResponse
    {
        public int CuotaId { get; set; }

        public int AlumnoId { get; set; }

        public string AlumnoNombre { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public int Mes { get; set; }

        public int Anio { get; set; }

        public decimal MontoBase { get; set; }

        public decimal Descuento { get; set; }

        public decimal MontoFinal { get; set; }

        public string Estado { get; set; } = string.Empty;

        public DateTime FechaVencimiento { get; set; }

        public DateTime? FechaPago { get; set; }

        public bool BloqueadoPorDeuda { get; set; }

        public bool Bonificada { get; set; }

        public bool Vencida { get; set; }
    }
}