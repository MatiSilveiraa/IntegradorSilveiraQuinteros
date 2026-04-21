
namespace Joki.Infraestructura.AccesoDatos.Excepciones
{
    [Serializable]
    public class TokenPermisoException : InfraestructuraException
    {
        public TokenPermisoException()
        {
        }

        public TokenPermisoException(string? message) : base(message)
        {
        }

        public override int StatusCode()
        {
            return 403;
        }
    }
}
