namespace Joki.CasoUsoCompartida.DTOs.Historial
{
    public class HistorialAlumnoResponse
    {
        public IEnumerable<HistorialCuotaResponse> Cuotas { get; set; } =
            new List<HistorialCuotaResponse>();

        public IEnumerable<HistorialPagoResponse> Pagos { get; set; } =
            new List<HistorialPagoResponse>();

        public IEnumerable<HistorialAsistenciaResponse> Asistencias { get; set; } =
            new List<HistorialAsistenciaResponse>();
    }
}