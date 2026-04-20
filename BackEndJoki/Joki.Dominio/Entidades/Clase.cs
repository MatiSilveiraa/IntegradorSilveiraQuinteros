using Joki.LogicaNegocio.Enums;

namespace Joki.LogicaNegocio.Entidades
{
    public class Clase
    {
        public int Id { get; set; }

        public int GrupoId { get; set; }

        public DateTime Fecha { get; set; }
        public TimeSpan Hora { get; set; }

        public EstadoClase Estado { get; set; }

        public virtual Grupo Grupo { get; set; } = null!;

        public virtual ICollection<Asistencia> Asistencias { get; set; }
        public virtual ICollection<MaterialEjercicio> MaterialesEjercicio { get; set; }

        public Clase()
        {
            Estado = EstadoClase.Programada;
            Asistencias = new List<Asistencia>();
            MaterialesEjercicio = new List<MaterialEjercicio>();
        }
    }
}