using Joki.LogicaNegocio.Enums;

namespace Joki.LogicaNegocio.Entidades
{
    public class SolicitudReactivacion
    {
        public int Id { get; set; }

        public int AlumnoId { get; set; }

        public Alumno Alumno { get; set; } = null!;

        public DateTime FechaSolicitud { get; set; }

        public EstadoSolicitudReactivacion Estado { get; set; }

        public string? MotivoAlumno { get; set; }

        public string? RespuestaAdmin { get; set; }

        public DateTime? FechaResolucion { get; set; }

        public int? AdminId { get; set; }

        public Usuario? Admin { get; set; }

        public SolicitudReactivacion()
        {
            FechaSolicitud = DateTime.UtcNow;
            Estado = EstadoSolicitudReactivacion.PENDIENTE;
        }
    }
}