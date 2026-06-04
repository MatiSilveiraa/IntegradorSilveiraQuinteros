
namespace Joki.CasoUsoCompartida.DTOs.Autenticacion
{
    public class RestablecerContrasenaRequest
    {
        public string Email { get; set; } = string.Empty;

        public string Codigo { get; set; } = string.Empty;

        public string NuevaContrasena { get; set; } = string.Empty;
    }
}
