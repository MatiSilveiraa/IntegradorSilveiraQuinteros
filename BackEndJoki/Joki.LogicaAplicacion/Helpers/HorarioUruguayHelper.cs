namespace Joki.LogicaAplicacion.Helpers
{
    public static class HorarioUruguayHelper
    {
        private const string ZonaLinux =
            "America/Montevideo";

        private const string ZonaWindows =
            "Montevideo Standard Time";

        public static DateTimeOffset ObtenerAhora()
        {
            var zonaUruguay =
                ObtenerZonaHorariaUruguay();

            return TimeZoneInfo.ConvertTime(
                DateTimeOffset.UtcNow,
                zonaUruguay);
        }

        private static TimeZoneInfo ObtenerZonaHorariaUruguay()
        {
            try
            {
                // Linux y algunos entornos de Azure.
                return TimeZoneInfo.FindSystemTimeZoneById(
                    ZonaLinux);
            }
            catch (TimeZoneNotFoundException)
            {
                // Windows y Azure App Service sobre Windows.
                return TimeZoneInfo.FindSystemTimeZoneById(
                    ZonaWindows);
            }
            catch (InvalidTimeZoneException)
            {
                return TimeZoneInfo.FindSystemTimeZoneById(
                    ZonaWindows);
            }
        }
    }
}