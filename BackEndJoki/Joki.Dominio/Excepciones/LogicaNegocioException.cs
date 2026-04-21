using Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaNegocio.Excepciones
{
    public class LogicaNegocioException : Exception
    {
        private readonly string _message;

        public LogicaNegocioException()
        {
            _message = string.Empty;
        }

        public LogicaNegocioException(string message) : base(message)
        {
            _message = message;
        }

        public Error Error()
        {
            return new Error(400, _message);
        }
    }
}
