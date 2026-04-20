using Joki.LogicaNegocio.Enums;

namespace Joki.LogicaNegocio.Entidades
{
    public class SolicitudCupo
    {
        public int Id { get; set; }
        public int AlumnoId { get; set; }
        public int GrupoId { get; set; }
        public EstadoSolicitud Estado { get; set; }
        public int Orden { get; set; }
        public DateOnly FechaSolicitud { get; set; }

        public virtual Alumno Alumno { get; set; }
        public virtual Grupo Grupo { get; set; }

        public SolicitudCupo()
        {
            Estado = EstadoSolicitud.PENDIENTE;
            FechaSolicitud = DateOnly.FromDateTime(DateTime.Now);
        }
    }
}
