public class ClaseEntrenadorDTO
{
    public int Id { get; set; }

    public string Grupo { get; set; } = "";

    public string DiaSemana { get; set; } = "";

    public TimeSpan HoraInicio { get; set; }

    public TimeSpan HoraFin { get; set; }

    public int CupoMaximo { get; set; }

    public int CantidadAlumnos { get; set; }

    public string Estado { get; set; } = "";
}
