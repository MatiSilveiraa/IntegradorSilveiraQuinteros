using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;

namespace Joki.Pruebas.Autorizacion
{
    public class AuthorizeTests : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly HttpClient _client;

        public AuthorizeTests(CustomWebApplicationFactory factory)
        {
            _client = factory.CreateClient();
        }

        // 🔧 LOGIN ROBUSTO
        private async Task<string> Login(string email, string password)
        {
            var response = await _client.PostAsJsonAsync("/api/auth/login", new
            {
                email,
                password
            });

            var json = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Login falló ({email}): {json}");
            }

            var doc = JsonDocument.Parse(json);

            if (!doc.RootElement.TryGetProperty("token", out var tokenElement))
            {
                throw new Exception($"No vino token en response: {json}");
            }

            return tokenElement.GetString()!;
        }

        // =========================
        // ❌ SIN TOKEN → 401
        // =========================
        [Fact]
        public async Task Entrenador_SinToken_DebeRetornar401()
        {
            var response = await _client.GetAsync("/api/entrenador");

            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        // =========================
        // ❌ ALUMNO → NO ENTRA A ENTRENADOR → 403
        // =========================
        [Fact]
        public async Task Alumno_NoDebeAccederAEntrenador()
        {
            var token = await Login("juan@test.com", "Juan#123");

            _client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", token);

            var response = await _client.GetAsync("/api/entrenador");

            Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
        }

        // =========================
        // ✅ ENTRENADOR → ACCEDE → 200
        // =========================
        [Fact]
        public async Task Entrenador_DebeAcceder()
        {
            var token = await Login("entrenador@joki.com", "Entrenador#123");

            _client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", token);

            var response = await _client.GetAsync("/api/entrenador");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        // =========================
        // ❌ ENTRENADOR → NO ES ADMIN → 403
        // =========================
        [Fact]
        public async Task Entrenador_NoDebeAccederAdmin()
        {
            var token = await Login("entrenador@joki.com", "Entrenador#123");

            _client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", token);

            var response = await _client.GetAsync("/api/administrador");

            Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
        }

        // =========================
        // ✅ ADMIN → ACCEDE → 200
        // =========================
        [Fact(Skip = "Requiere base de datos disponible; pendiente ajustar a InMemory")]
        public async Task Admin_DebeAcceder()
        {
            var token = await Login("admin@joki.com", "Admin#123");

            _client.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", token);

            var response = await _client.GetAsync("/api/administrador");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }
    }
}