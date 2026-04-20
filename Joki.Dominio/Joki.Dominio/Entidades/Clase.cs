 namespace Joki.LogicaNegocio.Entidades
{
    public class Clase
    {
        public int Id { get; set; }
        public int GrupoId { get; set; }
        public DateTime Hora { get; set; }
        public DateOnly Fecha { get; set; }
        public string Estado { get; set; }

        public virtual Grupo Grupo { get; set; }
        public virtual ICollection<Asistencia> Asistencias { get; set; }
        public virtual ICollection<MaterialEjercicio> MaterialesEjercicio { get; set; }

        public Clase()
        {
            Estado = string.Empty;
            Asistencias = new List<Asistencia>();
            MaterialesEjercicio = new List<MaterialEjercicio>();
        }
    }
}
