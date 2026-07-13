namespace Joki.CasoUsoCompartida.DTOs.Clase
{
    public class ConflictoEntrenadorResponse
    {
        public int EntrenadorId { get; set; }

        public string Entrenador { get; set; } = string.Empty;

        public int ClaseId { get; set; }

        public string Grupo { get; set; } = string.Empty;

        public string DiaSemana { get; set; } = string.Empty;

        public TimeSpan HoraInicio { get; set; }

        public TimeSpan HoraFin { get; set; }
    }
}