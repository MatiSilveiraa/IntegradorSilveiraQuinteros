
namespace Joki.CasoUsoCompartida.DTOs.Cuota
{
    public class CuotaResponse
    {
        public int Id { get; set; }

        public int AlumnoId { get; set; }

        public int Mes { get; set; }

        public int Anio { get; set; }

        public decimal MontoBase { get; set; }

        public decimal Descuento { get; set; }

        public decimal MontoFinal { get; set; }

        public string Estado { get; set; } = string.Empty;
    }
}
