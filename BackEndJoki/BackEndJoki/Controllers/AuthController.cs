using Joki.CasoUsoCompartida.DTOs.Autenticacion;
using Joki.CasoUsoCompartida.DTOs.Usuario;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Autenticacion;
using Joki.Infraestructura.AccesoDatos.Excepciones;
using Joki.LogicaNegocio.Excepciones;
using Joki.WebApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Joki.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ILoginUsuario _loginUsuario;
        private readonly IJwtGenerator _jwtGenerator;
        private readonly ILogoutUsuario _logoutUsuario;
        private readonly ISolicitarRecuperacionContrasena _solicitarRecuperacion;
        private readonly IRestablecerContrasena _restablecerContrasena;
        private readonly ILoginGoogle _loginGoogle;

        public AuthController(ILoginUsuario loginUsuario, IJwtGenerator jwtGenerator, ILogoutUsuario logoutUsuario, ISolicitarRecuperacionContrasena solicitarRecuperacion, IRestablecerContrasena restablecerContrasena, ILoginGoogle loginGoogle)
        {
            _loginUsuario = loginUsuario;
            _jwtGenerator = jwtGenerator;
            _logoutUsuario = logoutUsuario;
            _solicitarRecuperacion = solicitarRecuperacion;
            _restablecerContrasena = restablecerContrasena;
            _loginGoogle = loginGoogle;
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

        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            try
            {
                string token = Request.Headers["Authorization"]
                    .ToString()
                    .Replace("Bearer ", "");

                _logoutUsuario.Ejecutar(token);

                return Ok(new
                {
                    mensaje = "Sesión cerrada correctamente"
                });
            }
            catch (LogicaNegocioException e)
            {
                return BadRequest(new { mensaje = e.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new
                {
                    mensaje = "Hubo un problema. Prueba nuevamente"
                });
            }
        }

        [HttpPost("solicitar-recuperacion")]
        public IActionResult SolicitarRecuperacion(
    SolicitarRecuperacionRequest request)
        {
            try
            {
                _solicitarRecuperacion.Ejecutar(request);

                return Ok(new
                {
                    mensaje = "Código de recuperación generado correctamente"
                });
            }
            catch (LogicaNegocioException e)
            {
                return BadRequest(new
                {
                    mensaje = e.Message
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new
                {
                    mensaje = "Hubo un problema. Prueba nuevamente"
                });
            }
        }

        [HttpPost("restablecer-contrasena")]
        public IActionResult RestablecerContrasena(
            RestablecerContrasenaRequest request)
        {
            try
            {
                _restablecerContrasena.Ejecutar(request);

                return Ok(new
                {
                    mensaje = "Contraseña restablecida correctamente"
                });
            }
            catch (LogicaNegocioException e)
            {
                return BadRequest(new
                {
                    mensaje = e.Message
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new
                {
                    mensaje = "Hubo un problema. Prueba nuevamente"
                });
            }
        }

        [HttpPost("google")]
        public IActionResult LoginGoogle(
    LoginGoogleRequest request)
        {
            var usuario =
                _loginGoogle.Ejecutar(request);

            if (usuario == null)
            {
                return Unauthorized(new
                {
                    mensaje = "No se pudo iniciar sesión con Google"
                });
            }

            var token =
                _jwtGenerator.GenerateToken(usuario);

            return Ok(new
            {
                token,
                usuario
            });
        }
    }
}