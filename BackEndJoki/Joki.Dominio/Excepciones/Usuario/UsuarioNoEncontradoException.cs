
namespace Joki.LogicaNegocio.Excepciones.Usuario
{
    public class UsuarioNoEncontradoException : UsuarioException
    {
        public UsuarioNoEncontradoException()
        {
        }

        public UsuarioNoEncontradoException(string message) : base(message)
        {
        }
    }
}
