namespace Joki.LogicaNegocio.Entidades
{
    public class Alumno : Usuario
    {
        public float Peso { get; set; }
        public float Estatura { get; set; }
        public float IMC { get; set; }

        public virtual ICollection<SolicitudCupo> SolicitudesCupo { get; set; }
        public virtual ICollection<Inscripcion> Inscripciones { get; set; }
        public virtual ICollection<Asistencia> Asistencias { get; set; }
        public virtual ICollection<Cuota> Cuotas { get; set; }
        public virtual ICollection<ParticipacionDesafio> ParticipacionesDesafio { get; set; }
        public virtual ICollection<Beneficio> Beneficios { get; set; }

        public Alumno()
        {
            SolicitudesCupo = new List<SolicitudCupo>();
            Inscripciones = new List<Inscripcion>();
            Asistencias = new List<Asistencia>();
            Cuotas = new List<Cuota>();
            ParticipacionesDesafio = new List<ParticipacionDesafio>();
            Beneficios = new List<Beneficio>();
        }
    }
}
