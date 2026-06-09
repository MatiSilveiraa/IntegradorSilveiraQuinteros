namespace Joki.CasoUsoCompartida.DTOs.Descuento
{
    public class CrearDescuentoRequest
    {
        public string Nombre { get; set; } = string.Empty;

        public string Descripcion { get; set; } = string.Empty;

        public decimal Porcentaje { get; set; }

        public int MesesDuracion { get; set; }

        public string Tipo { get; set; } = string.Empty;

        public string Alcance { get; set; } = string.Empty;

        public int? DesafioId { get; set; }

        public List<int> AlumnosIds { get; set; } =
            new List<int>();
    }
}