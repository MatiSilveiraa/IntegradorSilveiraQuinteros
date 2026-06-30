public class AlumnoGrupoDTO
{
    public int Id { get; set; }

    public string Nombre { get; set; } = "";

    public string Apellido { get; set; } = "";

    public bool Bloqueado { get; set; }

    public decimal? Peso { get; set; }

    public decimal? Estatura { get; set; }

    public decimal? IMC { get; set; }
}