namespace Joki.CasoUsoCompartida.DTOs.Reactivacion
{
    public class SolicitudReactivacionResponse
    {
        public int Id { get; set; }

        public int AlumnoId { get; set; }

        public string NombreAlumno { get; set; } = string.Empty;

        public DateTime FechaSolicitud { get; set; }

        public string Estado { get; set; } = string.Empty;

        public string? MotivoAlumno { get; set; }
    }
}