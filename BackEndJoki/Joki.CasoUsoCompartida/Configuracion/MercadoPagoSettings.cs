namespace Joki.CasoUsoCompartida.Configuracion
{
    public class MercadoPagoSettings
    {
        public string AccessToken { get; set; } = string.Empty;

        public string SuccessUrl { get; set; } = string.Empty;

        public string FailureUrl { get; set; } = string.Empty;

        public string PendingUrl { get; set; } = string.Empty;

        public string WebhookUrl { get; set; } = string.Empty;
    }
}
