namespace Joki.CasoUsoCompartida.DTOs.Autenticacion
{
    public class ValidarLoginSinPasswordRequest
    {
        public string Email { get; set; } = string.Empty;

        public string Codigo { get; set; } = string.Empty;
    }
}