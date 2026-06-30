public class RegistrarAsistenciaDTO
{
    public int ClaseId { get; set; }

    public List<AsistenciaAlumnoDTO> Asistencias { get; set; } = new();
}