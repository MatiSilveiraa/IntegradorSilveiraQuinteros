namespace Joki.CasoUsoCompartida.Configuracion
{
    public class DemoSettings
    {
        public bool Habilitado { get; set; }

        public string CodigoPasswordless { get; set; } =
            string.Empty;

        public string CodigoRecuperacion { get; set; } =
            string.Empty;

        public string CodigoAlternativo2FA { get; set; } =
            string.Empty;

        public List<string> EmailsPermitidos { get; set; } =
            new List<string>();
    }
}