using Joki.LogicaNegocio.Enums;

namespace Joki.LogicaNegocio.Entidades
{
    public class SolicitudCupo
    {
        public int Id { get; set; }

        public int AlumnoId { get; set; }
        public int ClaseId { get; set; }

        public EstadoSolicitud Estado { get; set; }

        public int Orden { get; set; }

        public DateTime FechaSolicitud { get; set; }

        public virtual Alumno Alumno { get; set; } = null!;

        public virtual Clase Clase { get; set; } = null!;

        public SolicitudCupo()
        {
            Estado = EstadoSolicitud.PENDIENTE;

            FechaSolicitud = DateTime.UtcNow;
        }
    }
}