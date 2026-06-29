namespace Joki.CasoUsoCompartida.DTOs.Entrenador
{
    public class AgendaClaseDTO
    {
        public int ClaseId { get; set; }

        public string Grupo { get; set; } = "";

        public TimeSpan HoraInicio { get; set; }

        public TimeSpan HoraFin { get; set; }

        public int CantidadAlumnos { get; set; }

        public int CupoMaximo { get; set; }

        public int CuposDisponibles { get; set; }

        public List<AlumnoAgendaDTO> Alumnos { get; set; } = new();
    }
}