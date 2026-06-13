namespace Joki.CasoUsoCompartida.DTOs.Autenticacion
{
    public class Generar2FAResponse
    {
        public string Secret { get; set; } = string.Empty;

        public string QrCodeBase64 { get; set; } = string.Empty;
    }
}