namespace Joki.CasoUsoCompartida.DTOs.Beneficio
{
    public class BeneficioPendienteAdminResponse
    {
        public int BeneficioId { get; set; }

        public int AlumnoId { get; set; }

        public string NombreAlumno { get; set; } = string.Empty;

        public string ApellidoAlumno { get; set; } = string.Empty;

        public string Descripcion { get; set; } = string.Empty;

        public string Estado { get; set; } = string.Empty;

        public int MesesAplicados { get; set; }

        public int MesesDuracion { get; set; }

        public bool CuotaGratis { get; set; }

        public decimal? Descuento { get; set; }
    }
}