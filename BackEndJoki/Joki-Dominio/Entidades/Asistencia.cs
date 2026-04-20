using Joki.LogicaNegocio.Enums;

namespace Joki.LogicaNegocio.Entidades
{
    public class Asistencia
    {
        public int Id { get; set; }
        public int AlumnoId { get; set; }
        public int ClaseId { get; set; }
        public bool Presente { get; set; }
        public TipoRegistro TipoRegistro { get; set; }

        public virtual Alumno Alumno { get; set; }
        public virtual Clase Clase { get; set; }
    }
}
