using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.ValueObjects;

namespace Joki.LogicaNegocio.Entidades
{
    public class Clase
    {
        public int Id { get; set; }

        public int GrupoId { get; set; }

        public virtual Grupo Grupo { get; set; } = null!;

        public DiaSemana DiaSemana { get; set; }

        public TimeSpan HoraInicio { get; set; }

        public TimeSpan HoraFin { get; set; }

        public Ubicacion Ubicacion { get; set; }

        public decimal RadioGeolocalizacion { get; set; }

        public bool EsFija { get; set; }

        public DateTime FechaInicio { get; set; }

        public DateTime? FechaFin { get; set; }

        public int CupoMaximo { get; set; }

        public EstadoClase Estado { get; set; }

        public virtual ICollection<Asistencia> Asistencias { get; set; }

        public virtual ICollection<Inscripcion> Inscripciones { get; set; }

        public virtual ICollection<MaterialEjercicio> MaterialesEjercicio { get; set; }
        public virtual ICollection<SolicitudCupo> SolicitudesCupo { get; set; }

        public Clase()
        {
            Ubicacion = new Ubicacion();

            Estado = EstadoClase.Programada;

            Asistencias = new List<Asistencia>();

            Inscripciones = new List<Inscripcion>();

            MaterialesEjercicio = new List<MaterialEjercicio>();
            SolicitudesCupo = new List<SolicitudCupo>();
        }

        public bool TieneCupoDisponible()
        {
            return Inscripciones.Count < CupoMaximo;
        }

        public bool TieneConflictoHorarioCon(Clase otraClase)
        {
            if (DiaSemana != otraClase.DiaSemana)
            {
                return false;
            }

            return HoraInicio < otraClase.HoraFin &&
                   HoraFin > otraClase.HoraInicio;
        }
    }
}