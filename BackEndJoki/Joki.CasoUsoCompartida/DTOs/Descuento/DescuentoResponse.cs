namespace Joki.CasoUsoCompartida.DTOs.Descuento
{
    public class DescuentoResponse
    {
        public int Id { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public string Descripcion { get; set; } = string.Empty;

        public decimal Porcentaje { get; set; }

        public int MesesDuracion { get; set; }

        public string Tipo { get; set; } = string.Empty;

        public string Alcance { get; set; } = string.Empty;

        public bool Activo { get; set; }

        public int? DesafioId { get; set; }
    }
}