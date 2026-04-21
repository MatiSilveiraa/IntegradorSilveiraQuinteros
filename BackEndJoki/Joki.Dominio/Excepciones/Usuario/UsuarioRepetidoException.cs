
namespace Joki.LogicaNegocio.Excepciones.Usuario
{
    public class UsuarioRepetidoException : UsuarioException
    {
        public UsuarioRepetidoException()
        {
        }

        public UsuarioRepetidoException(string message) : base(message)
        {
        }
    }
}
