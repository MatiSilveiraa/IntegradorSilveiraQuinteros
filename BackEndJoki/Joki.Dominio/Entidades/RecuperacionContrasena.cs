namespace Joki.LogicaNegocio.Entidades
{
    public class RecuperacionContrasena
    {
        public int Id { get; set; }

        public int UsuarioId { get; set; }

        public virtual Usuario Usuario { get; set; } = null!;

        public string Codigo { get; set; } = string.Empty;

        public DateTime FechaCreacion { get; set; }

        public DateTime FechaExpiracion { get; set; }

        public bool Usado { get; set; }
    }
}
