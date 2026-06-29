using Joki.LogicaNegocio.ValueObjects;

public class AgendaClaseVO
{
    public int ClaseId { get; set; }

    public int GrupoId { get; set; }

    public string Grupo { get; set; } = string.Empty;

    public TimeSpan HoraInicio { get; set; }

    public TimeSpan HoraFin { get; set; }

    public int CantidadAlumnos { get; set; }

    public int CupoMaximo { get; set; }

    public int CuposDisponibles { get; set; }

    public List<AlumnoAgendaVO> Alumnos { get; set; } = new();
}