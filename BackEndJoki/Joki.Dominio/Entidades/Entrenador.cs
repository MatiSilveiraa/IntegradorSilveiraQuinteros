namespace Joki.LogicaNegocio.Entidades
{
    public class Entrenador : Usuario
    {
        public virtual ICollection<Grupo> Grupos { get; set; }
        public virtual ICollection<ClaseEntrenador> Clases { get; set; }

        public Entrenador()
        {
            Grupos = new List<Grupo>();
            Clases = new List<ClaseEntrenador>();
        }
    }
}
