using Joki.CasoUsoCompartida.DTOs.Usuario;
using Joki.WebApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace Joki.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IJwtGenerator _jwtGenerator;

        public AuthController(IJwtGenerator jwtGenerator)
        {
            _jwtGenerator = jwtGenerator;
        }

        [HttpGet("test-token")]
        public IActionResult GenerarTokenDePrueba()
        {
            var usuarioSimulado = new DtoDatosUsuario(
                Id: 1,
                Nombre: "Matias",
                Apellido: "Silveira",
                Email: "matias@test.com",
                Rol: "Entrenador" 
            );

   
            var token = _jwtGenerator.GenerateToken(usuarioSimulado);
            return Ok(new
            {
                Mensaje = "Token generado exitosamente",
                Token = token
            });
        }
    }
}