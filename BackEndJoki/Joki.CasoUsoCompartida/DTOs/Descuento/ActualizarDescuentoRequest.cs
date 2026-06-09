namespace Joki.CasoUsoCompartida.DTOs.Descuento
{
    public class ActualizarDescuentoRequest
    {
        public string Nombre { get; set; } = string.Empty;

        public string Descripcion { get; set; } = string.Empty;

        public decimal Porcentaje { get; set; }

        public int MesesDuracion { get; set; }

        public bool Activo { get; set; }
    }
}