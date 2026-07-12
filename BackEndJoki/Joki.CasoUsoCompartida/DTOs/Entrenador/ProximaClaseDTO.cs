namespace Joki.CasoUsoCompartida.DTOs.Entrenador
{
    public class ProximaClaseDTO
    {
        public int ClaseId { get; set; }

        public int GrupoId { get; set; }

        public string Grupo { get; set; } = string.Empty;

        public string DiaSemana { get; set; } = string.Empty;

        public TimeSpan HoraInicio { get; set; }

        public TimeSpan HoraFin { get; set; }

        public DateTime FechaProximaClase { get; set; }

        public int CantidadAlumnos { get; set; }

        public int CupoMaximo { get; set; }

        public int CuposDisponibles { get; set; }
    }
}