using Joki.LogicaNegocio.Enums;

namespace Joki.LogicaNegocio.Entidades
{
    public class Recompensa
    {
        public int Id { get; set; }
        public string Descripcion { get; set; }
        public TipoRecompensa Tipo { get; set; }

        public virtual ICollection<Desafio> Desafios { get; set; }
        public virtual ICollection<Beneficio> Beneficios { get; set; }

        public Recompensa()
        {
            Descripcion = string.Empty;
            Desafios = new List<Desafio>();
            Beneficios = new List<Beneficio>();
        }
    }
}
