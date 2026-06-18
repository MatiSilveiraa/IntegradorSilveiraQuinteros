namespace Joki.LogicaNegocio.Entidades
{
    public class CodigoLoginSinPassword
    {
        public int Id { get; set; }

        public int UsuarioId { get; set; }

        public Usuario Usuario { get; set; } = null!;

        public string Codigo { get; set; } = string.Empty;

        public DateTime FechaCreacion { get; set; }

        public DateTime FechaExpiracion { get; set; }

        public bool Usado { get; set; }

        public CodigoLoginSinPassword()
        {
            FechaCreacion = DateTime.UtcNow;
            FechaExpiracion = DateTime.UtcNow.AddMinutes(10);
            Usado = false;
        }
    }
}