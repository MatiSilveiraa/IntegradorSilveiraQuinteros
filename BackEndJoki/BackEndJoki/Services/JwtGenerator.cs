using Joki.CasoUsoCompartida.DTOs.Usuario;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace Joki.WebApi.Services
{
    public class JwtGenerator : IJwtGenerator
    {
        private readonly IConfiguration _configuration;

        public JwtGenerator(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateToken(DtoDatosUsuario usuario)
        {
            var keyStr = _configuration["JwtSettings:SecretKey"];
            if (string.IsNullOrEmpty(keyStr))
                throw new InvalidOperationException("La clave secreta JWT no está configurada.");

            var key = Encoding.UTF8.GetBytes(keyStr);
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Email, usuario.Email),
                new Claim(ClaimTypes.Role, usuario.Rol),
                new Claim(ClaimTypes.Name, $"{usuario.Nombre} {usuario.Apellido}")
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(1),

                Issuer = _configuration["JwtSettings:Issuer"],      // 🔥
                Audience = _configuration["JwtSettings:Audience"],  // 🔥

                SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}