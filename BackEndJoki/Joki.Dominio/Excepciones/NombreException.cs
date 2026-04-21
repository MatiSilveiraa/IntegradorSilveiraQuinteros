
using Joki.LogicaNegocio.Excepciones.Usuario;

namespace Joki.LogicaNegocio.Excepciones
{
    public class NombreException : LogicaNegocioException
    {
        public NombreException()
        {
        }

        public NombreException(string message) : base(message)
        {
        }
    }
}
