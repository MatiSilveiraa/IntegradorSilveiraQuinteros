using System.Runtime.Serialization;

namespace Joki.Infraestructura.AccesoDatos.Excepciones
{
    public abstract class InfraestructuraException : Exception
    {
        private readonly string _message;

        public InfraestructuraException()
        {
            _message = string.Empty;
        }

        public InfraestructuraException(string? message) : base(message)
        {
            _message = message ?? string.Empty;
        }

        protected InfraestructuraException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
            _message = string.Empty;
        }

        public abstract int StatusCode();

        public Error Error()
        {
            return new Error(StatusCode(), _message);
        }
    }
}
