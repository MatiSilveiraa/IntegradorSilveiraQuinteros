using Joki.LogicaNegocio.Enums;

namespace Joki.LogicaNegocio.Entidades
{
    public class Recompensa
    {
        public int Id { get; set; }

        public string Descripcion { get; set; }

        public TipoRecompensa Tipo { get; set; }

        public int DesafioId { get; set; }
        public virtual Desafio Desafio { get; set; } = null!;

        public virtual ICollection<Beneficio> Beneficios { get; set; }

        public Recompensa()
        {
            Descripcion = string.Empty;
            Beneficios = new List<Beneficio>();
        }
    }
}