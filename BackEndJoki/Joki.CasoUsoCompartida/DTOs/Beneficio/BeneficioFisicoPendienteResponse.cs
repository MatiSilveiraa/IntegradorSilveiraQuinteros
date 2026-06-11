namespace Joki.CasoUsoCompartida.DTOs.Beneficio
{
    public class BeneficioFisicoPendienteResponse
    {
        public int BeneficioId { get; set; }

        public int AlumnoId { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public string Apellido { get; set; } = string.Empty;

        public string Descripcion { get; set; } = string.Empty;
    }
}