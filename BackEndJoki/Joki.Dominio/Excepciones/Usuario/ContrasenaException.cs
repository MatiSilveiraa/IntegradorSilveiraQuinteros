namespace Joki.LogicaNegocio.Excepciones.Usuario
{
    public class ContrasenaException : UsuarioException
    {
        public ContrasenaException()
        {
        }

        public ContrasenaException(string message) : base(message)
        {
        }
    }
}
