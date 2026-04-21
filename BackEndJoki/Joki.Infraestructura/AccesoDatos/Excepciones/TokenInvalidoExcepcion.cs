
namespace Joki.Infraestructura.AccesoDatos.Excepciones
{
    [Serializable]
    public class TokenInvalidoException : InfraestructuraException
    {
        public TokenInvalidoException()
        {
        }

        public TokenInvalidoException(string? message) : base(message)
        {
        }

        public override int StatusCode()
        {
            return 401;
        }
    }
}
