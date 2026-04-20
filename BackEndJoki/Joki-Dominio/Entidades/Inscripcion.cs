namespace Joki.LogicaNegocio.Entidades
{
    public class Inscripcion
    {
        public int Id { get; set; }
        public int AlumnoId { get; set; }
        public int GrupoId { get; set; }
        public DateOnly FechaInscripcion { get; set; }

        public virtual Alumno Alumno { get; set; }
        public virtual Grupo Grupo { get; set; }

        public Inscripcion()
        {
            FechaInscripcion = DateOnly.FromDateTime(DateTime.Now);
        }
    }
}
