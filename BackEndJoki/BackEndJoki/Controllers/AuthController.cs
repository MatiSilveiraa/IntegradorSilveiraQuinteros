using Joki.CasoUsoCompartida.DTOs.Autenticacion;
using Joki.CasoUsoCompartida.DTOs.Usuario;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Autenticacion;
using Joki.Infraestructura.AccesoDatos.Excepciones;
using Joki.WebApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace Joki.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ILoginUsuario _loginUsuario;
        private readonly IJwtGenerator _jwtGenerator;

        public AuthController(ILoginUsuario loginUsuario, IJwtGenerator jwtGenerator)
        {
            _loginUsuario = loginUsuario;
            _jwtGenerator = jwtGenerator;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            try
            {
                if (request == null)
                {
                    throw new BadRequestException("Debe enviar los datos de login.");
                }

                if (string.IsNullOrWhiteSpace(request.Email) ||
                    string.IsNullOrWhiteSpace(request.Password))
                {
                    throw new BadRequestException("Email y contraseña son obligatorios.");
                }

                DtoDatosUsuario? usuario = _loginUsuario.Ejecutar(request);

                if (usuario == null)
                {
                    throw new TokenInvalidoException("Credenciales incorrectas.");
                }

                string token = _jwtGenerator.GenerateToken(usuario);

                return StatusCode(200, new { usuario, token });
            }
            catch (InfraestructuraException e)
            {
                return StatusCode(e.StatusCode(), e.Error());
            }
            catch (Exception)
            {
                Error error = new Error(500, "Hubo un problema. Prueba nuevamente");
                return StatusCode(500, error);
            }
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