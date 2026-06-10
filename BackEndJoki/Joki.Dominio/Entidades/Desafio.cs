namespace Joki.LogicaNegocio.Entidades
{
    public class Desafio
    {
        public int Id { get; set; }

        public string Titulo { get; set; }
        public string Descripcion { get; set; }

        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public bool Activo { get; set; }

        public virtual ICollection<ParticipacionDesafio> Participaciones { get; set; }
        public virtual ICollection<Recompensa> Recompensas { get; set; }

        public Desafio()
        {
            Titulo = string.Empty;
            Descripcion = string.Empty;
            Activo = true;
            Participaciones = new List<ParticipacionDesafio>();
            Recompensas = new List<Recompensa>();   
        }
    }
}