namespace Joki.CasoUsoCompartida.DTOs.Entrenador
{
    public class EntrenadorDashboardResponse
    {
        public int Grupos { get; set; }

        public int Alumnos { get; set; }

        public int ClasesHoy { get; set; }

        public int DesafiosActivos { get; set; }

        public int NotificacionesNoLeidas { get; set; }

        public ProximaClaseDTO? ProximaClase { get; set; }

        public List<AgendaClaseDTO> AgendaHoy { get; set; } = new();
    }
}