namespace Joki.CasoUsoCompartida.DTOs.Historial
{
    public class HistorialAsistenciaResponse
    {
        public int Id { get; set; }

        public int ClaseId { get; set; }

        public DateTime Fecha { get; set; }

        public bool Presente { get; set; }

        public string Estado { get; set; } = string.Empty;
    }
}