namespace Joki.CasoUsoCompartida.DTOs.Entrenador
{
    public class ClaseDisponibleEntrenadorDTO
    {
        public int ClaseId { get; set; }

        public int GrupoId { get; set; }

        public string Grupo { get; set; } = string.Empty;

        public string DiaSemana { get; set; } = string.Empty;

        public TimeSpan HoraInicio { get; set; }

        public TimeSpan HoraFin { get; set; }

        public DateTime FechaInicio { get; set; }

        public DateTime? FechaFin { get; set; }

        public int CantidadEntrenadores { get; set; }

        public bool TieneConflicto { get; set; }
    }
}