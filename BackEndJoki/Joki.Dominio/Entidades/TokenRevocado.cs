
namespace Joki.LogicaNegocio.Entidades
{
    public class TokenRevocado
    {
        public int Id { get; set; }
        public string Token { get; set; }
        public DateTime FechaRevocacion { get; set; }

        public TokenRevocado()
        {
            Token = string.Empty;
            FechaRevocacion = DateTime.UtcNow;
        }
    }
}
