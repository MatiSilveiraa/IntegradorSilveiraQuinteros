namespace Joki.CasoUsoCompartida.DTOs.Entrenador
{
    public class GrupoEntrenadorDTO
    {
        public int Id { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public string Nivel { get; set; } = string.Empty;

        public string Estado { get; set; } = string.Empty;

        public int CantidadAlumnos { get; set; }

        public int CantidadClases { get; set; }

        public int? ClaseId { get; set; }

        public string? ProximoDia { get; set; }

        public TimeSpan? ProximaHoraInicio { get; set; }

        public TimeSpan? ProximaHoraFin { get; set; }

        public DateTime? FechaProximaClase { get; set; }

        public int? CupoMaximo { get; set; }

        public int? Inscriptos { get; set; }

        public int? CuposDisponibles { get; set; }
    }
}