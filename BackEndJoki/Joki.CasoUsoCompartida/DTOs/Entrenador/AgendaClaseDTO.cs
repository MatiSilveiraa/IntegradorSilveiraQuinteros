namespace Joki.CasoUsoCompartida.DTOs.Entrenador
{
    public class AgendaClaseDTO
    {
        public int ClaseId { get; set; }

        public DateTime FechaOcurrencia { get; set; }

        public string Grupo { get; set; } = string.Empty;

        public TimeSpan HoraInicio { get; set; }

        public TimeSpan HoraFin { get; set; }

        public int CantidadAlumnos { get; set; }

        public int CupoMaximo { get; set; }

        public int CuposDisponibles { get; set; }

        public int Presentes { get; set; }

        public int Ausentes { get; set; }

        public int SinRegistrar { get; set; }

        public string EstadoAsistencia { get; set; } = string.Empty;

        public List<AlumnoAgendaDTO> Alumnos { get; set; } = new();
    }
}