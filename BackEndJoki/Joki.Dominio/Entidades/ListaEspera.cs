namespace Joki.LogicaNegocio.Entidades
{
    public class ListaEspera
    {
        public int Id { get; set; }

        public int AlumnoId { get; set; }

        public int ClaseId { get; set; }

        public DateTime FechaSolicitud { get; set; }

        public virtual Alumno Alumno { get; set; } = null!;

        public virtual Clase Clase { get; set; } = null!;

        public ListaEspera()
        {
            FechaSolicitud = DateTime.UtcNow;
        }
    }
}