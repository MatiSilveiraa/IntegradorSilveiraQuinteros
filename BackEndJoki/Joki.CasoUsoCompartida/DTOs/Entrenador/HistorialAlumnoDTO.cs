public class HistorialAlumnoDTO
{
    public int AlumnoId { get; set; }

    public string Nombre { get; set; } = "";

    public string Apellido { get; set; } = "";

    public int Asistencias { get; set; }

    public int Inasistencias { get; set; }

    public decimal PorcentajeAsistencia { get; set; }

    public List<HistorialClaseDTO> Historial { get; set; } = new();
}