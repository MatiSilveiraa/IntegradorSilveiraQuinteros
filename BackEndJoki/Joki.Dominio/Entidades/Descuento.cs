using Joki.LogicaNegocio.Enums;

namespace Joki.LogicaNegocio.Entidades
{
    public class Descuento
    {
        public int Id { get; set; }

        public string Nombre { get; set; }

        public string Descripcion { get; set; }

        public decimal Porcentaje { get; set; }

        public int MesesDuracion { get; set; }

        public bool Activo { get; set; }

        public TipoDescuento Tipo { get; set; }

        public AlcanceDescuento Alcance { get; set; }

        public int? DesafioId { get; set; }

        public virtual Desafio? Desafio { get; set; }

        public Descuento()
        {
            Nombre = string.Empty;
            Descripcion = string.Empty;
            Activo = true;
            MesesDuracion = 1;
        }
    }
}