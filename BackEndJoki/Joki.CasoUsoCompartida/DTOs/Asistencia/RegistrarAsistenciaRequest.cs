namespace Joki.CasoUsoCompartida.DTOs.Asistencia
{
    public class RegistrarAsistenciaRequest
    {
        public int AlumnoId { get; set; }

        public int ClaseId { get; set; }

        public bool Presente { get; set; }
    }
}
