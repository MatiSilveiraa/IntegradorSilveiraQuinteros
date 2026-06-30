namespace Joki.LogicaNegocio.ValueObjects
{
    public class GrupoDetalleVO
    {
        public int Id { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public string Nivel { get; set; } = string.Empty;

        public string Estado { get; set; } = string.Empty;

        public int CantidadAlumnos { get; set; }

        public int CantidadClases { get; set; }

        public List<AlumnoGrupoVO> Alumnos { get; set; } = new();

        public List<ClaseGrupoVO> Clases { get; set; } = new();
    }
}