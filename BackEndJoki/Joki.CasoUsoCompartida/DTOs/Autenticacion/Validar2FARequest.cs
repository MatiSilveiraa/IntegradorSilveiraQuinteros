namespace Joki.CasoUsoCompartida.DTOs.Autenticacion
{
    public class Validar2FARequest
    {
        public string Email { get; set; } = string.Empty;

        public string Codigo { get; set; } = string.Empty;
    }
}