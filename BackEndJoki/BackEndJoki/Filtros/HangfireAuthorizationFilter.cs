using Hangfire.Dashboard;
using Microsoft.Extensions.Options;
using System.Net.Http.Headers;
using System.Text;
using Joki.CasoUsoCompartida.Configuracion;

namespace Joki.WebApi.Filtros
{
    public class HangfireAuthorizationFilter : IDashboardAuthorizationFilter
    {
        private readonly HangfireSettings _settings;

        public HangfireAuthorizationFilter(
            IOptions<HangfireSettings> settings)
        {
            _settings = settings.Value;
        }

        public bool Authorize(DashboardContext context)
        {
            var httpContext =
                context.GetHttpContext();

            string? header =
                httpContext.Request.Headers["Authorization"];

            if (string.IsNullOrEmpty(header))
            {
                httpContext.Response.Headers["WWW-Authenticate"] =
                    "Basic realm=\"Hangfire Dashboard\"";

                httpContext.Response.StatusCode = 401;

                return false;
            }

            var authHeader =
                AuthenticationHeaderValue.Parse(header);

            var credentialBytes =
                Convert.FromBase64String(authHeader.Parameter!);

            var credentials =
                Encoding.UTF8.GetString(credentialBytes)
                    .Split(':', 2);

            var usuario = credentials[0];

            var password = credentials[1];

            return usuario == _settings.Usuario &&
                   password == _settings.Password;
        }
    }
}