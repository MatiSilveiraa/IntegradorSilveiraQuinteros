
namespace Joki.CasoUsoCompartida.DTOs.Alumno
{
    public class RegistrarAlumnoResponse
    {
        public int UsuarioId { get; set; }
        public string Mensaje { get; set; }

        public RegistrarAlumnoResponse()
        {
            Mensaje = string.Empty;
        }
    }
}
