
namespace Joki.Infraestructura.AccesoDatos.Excepciones
{
    public class NoContentException : InfraestructuraException
    {
        public NoContentException()
        {
        }

        public NoContentException(string? message) : base(message)
        {
        }

        public override int StatusCode()
        {
            return 204;
        }
    }
}
