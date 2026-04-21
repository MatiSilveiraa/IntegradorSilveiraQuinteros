
namespace Joki.Infraestructura.AccesoDatos.Excepciones
{
    [Serializable]
    public class NotFoundException : InfraestructuraException
    {
        public NotFoundException()
        {
        }

        public NotFoundException(string? message) : base(message)
        {
        }

        public override int StatusCode()
        {
            return 404;
        }
    }
}
