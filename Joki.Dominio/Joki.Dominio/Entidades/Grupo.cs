using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.ValueObjects;

namespace Joki.LogicaNegocio.Entidades
{
    public class Grupo
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Nivel { get; set; }
        public int CupoMaximo { get; set; }
        public string DiaSemana { get; set; }
        public string Hora { get; set; }
        public Ubicacion Ubicacion { get; set; }
        public float RadioGeolocalizacion { get; set; }
        public bool EsFijo { get; set; }
        public DateOnly FechaInicio { get; set; }
        public DateOnly FechaFin { get; set; }
        public EstadoGrupo Estado { get; set; }
        public int EntrenadorId { get; set; }

        public virtual Entrenador Entrenador { get; set; }
        public virtual ICollection<SolicitudCupo> SolicitudesCupo { get; set; }
        public virtual ICollection<Inscripcion> Inscripciones { get; set; }
        public virtual ICollection<Clase> Clases { get; set; }

        public Grupo()
        {
            Nombre = string.Empty;
            Nivel = string.Empty;
            DiaSemana = string.Empty;
            Hora = string.Empty;
            Ubicacion = new Ubicacion();
            Estado = EstadoGrupo.ACTIVO;
            SolicitudesCupo = new List<SolicitudCupo>();
            Inscripciones = new List<Inscripcion>();
            Clases = new List<Clase>();
        }
    }
}
