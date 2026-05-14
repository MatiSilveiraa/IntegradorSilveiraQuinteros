using Joki.LogicaNegocio.Enums;

namespace Joki.LogicaNegocio.Entidades
{
    public class Asistencia
    {
        public int Id { get; set; }

        public int AlumnoId { get; set; }
        public Alumno Alumno { get; set; }

        public int ClaseId { get; set; }
        public Clase Clase { get; set; }

        public DateTime Fecha { get; set; }

        public bool Presente { get; set; }

        public DateTime FechaRegistro { get; set; }

        public int RegistradoPorId { get; set; }
        public Usuario RegistradoPor { get; set; }
    }
}
