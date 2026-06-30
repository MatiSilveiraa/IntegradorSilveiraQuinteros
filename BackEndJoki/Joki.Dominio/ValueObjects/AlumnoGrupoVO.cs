namespace Joki.LogicaNegocio.ValueObjects
{
    public class AlumnoGrupoVO
    {
        public int Id { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public string Apellido { get; set; } = string.Empty;

        public decimal? Peso { get; set; }

        public decimal? Estatura { get; set; }

        public decimal? IMC { get; set; }

        public bool Bloqueado { get; set; }
    }
}