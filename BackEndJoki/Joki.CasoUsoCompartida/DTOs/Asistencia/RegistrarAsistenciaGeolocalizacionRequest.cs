namespace Joki.CasoUsoCompartida.DTOs.Asistencia
{
    public class RegistrarAsistenciaGeolocalizacionRequest
    {
        public int ClaseId { get; set; }

        public decimal Latitud { get; set; }

        public decimal Longitud { get; set; }
    }
}