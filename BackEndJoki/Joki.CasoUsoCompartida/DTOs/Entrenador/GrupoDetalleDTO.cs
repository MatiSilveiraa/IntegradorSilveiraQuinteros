namespace Joki.CasoUsoCompartida.DTOs.Entrenador
{
    public class GrupoDetalleDTO
    {
        public int Id { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public string Nivel { get; set; } = string.Empty;

        public string Estado { get; set; } = string.Empty;

        public int CantidadAlumnos { get; set; }

        public int CantidadClases { get; set; }

        public List<AlumnoGrupoDTO> Alumnos { get; set; } = new();

        public List<ClaseGrupoDTO> Clases { get; set; } = new();
    }
}