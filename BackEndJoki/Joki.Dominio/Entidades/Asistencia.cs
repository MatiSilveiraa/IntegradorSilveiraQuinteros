using Joki.LogicaNegocio.Enums;

namespace Joki.LogicaNegocio.Entidades
{
    public class Asistencia
    {
        public int Id { get; set; }

        public int AlumnoId { get; set; }
        public Alumno Alumno { get; set; } = null!;

        public int ClaseId { get; set; }
        public Clase Clase { get; set; } = null!;

        public DateTime Fecha { get; set; }

        public bool Presente { get; set; }

        public DateTime FechaRegistro { get; set; }

        public int RegistradoPorId { get; set; }
        public Usuario RegistradoPor { get; set; } = null!;

        public decimal? Latitud { get; set; }

        public decimal? Longitud { get; set; }

        public decimal? DistanciaMetros { get; set; }

        public bool RegistradaPorGeolocalizacion { get; set; }
    }
}