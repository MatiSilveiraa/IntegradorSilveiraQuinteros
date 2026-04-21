
namespace Joki.LogicaNegocio.Excepciones.Usuario
{
    public class EmailException : UsuarioException
    {
        public EmailException()
        {
        }

        public EmailException(string message) : base(message)
        {
        }
    }
}
