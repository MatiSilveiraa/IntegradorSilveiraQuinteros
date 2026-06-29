namespace Joki.CasoUsoCompartida.DTOs.Entrenador
{
    public class ProximaClaseDTO
    {
        public int ClaseId { get; set; }

        public string Grupo { get; set; } = "";

        public TimeSpan HoraInicio { get; set; }

        public TimeSpan HoraFin { get; set; }
    }
}