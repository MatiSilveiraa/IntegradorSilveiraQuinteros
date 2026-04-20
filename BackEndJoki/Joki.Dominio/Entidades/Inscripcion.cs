namespace Joki.LogicaNegocio.Entidades
{
    public class Inscripcion
    {
        public int Id { get; set; }

        public int AlumnoId { get; set; }
        public int GrupoId { get; set; }

        public DateTime FechaInscripcion { get; set; }

        public virtual Alumno Alumno { get; set; } = null!;
        public virtual Grupo Grupo { get; set; } = null!;

        public Inscripcion()
        {
            FechaInscripcion = DateTime.UtcNow;
        }
    }
}