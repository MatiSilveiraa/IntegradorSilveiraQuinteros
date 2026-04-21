
namespace Joki.Infraestructura.AccesoDatos.Excepciones
{
    public class Error
    {
        public int Codigo { get; set; }
        public string Mensaje { get; set; }

        public Error(int codigo, string mensaje)
        {
            Codigo = codigo;
            Mensaje = mensaje;
        }
    }
}
