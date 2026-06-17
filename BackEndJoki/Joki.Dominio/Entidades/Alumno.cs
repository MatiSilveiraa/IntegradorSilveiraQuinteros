namespace Joki.LogicaNegocio.Entidades
{
    public class Alumno : Usuario
    {
        public Decimal? Peso { get; set; }
        public Decimal? Estatura { get; set; }
        public Decimal? IMC { get; set; }
        public bool BloqueadoPorInasistencias { get; set; }
        public bool BloqueadoPorDeuda { get; set; }
        public int RachaAsistenciaMensual { get; set; }
        public int MesRachaAsistencia { get; set; }
        public int AnioRachaAsistencia { get; set; }
        public bool DescuentoRachaGenerado { get; set; }
        public virtual ICollection<SolicitudReactivacion> SolicitudesReactivacion { get; set; }
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
            SolicitudesReactivacion = new List<SolicitudReactivacion>();
        }
    }
}
