using Joki.CasoUsoCompartida.DTOs.Autenticacion;
using Joki.CasoUsoCompartida.DTOs.Usuario;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Autenticacion;
using Joki.Infraestructura.AccesoDatos.Excepciones;
using Joki.LogicaNegocio.Excepciones;
using Joki.WebApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Joki.LogicaNegocio.InterfacesRepositorio;

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
        private readonly IGenerar2FA _generar2FA;
        private readonly IConfirmar2FA _confirmar2FA;
        private readonly IValidar2FA _validar2FA;
        private readonly IRepositorioUsuario _repositorioUsuario;

        public AuthController(ILoginUsuario loginUsuario, IJwtGenerator jwtGenerator, ILogoutUsuario logoutUsuario,
            ISolicitarRecuperacionContrasena solicitarRecuperacion, IRestablecerContrasena restablecerContrasena, ILoginGoogle loginGoogle,
            IGenerar2FA generar2FA, IConfirmar2FA confirmar2FA, IValidar2FA validar2FA, IRepositorioUsuario repositorioUsuario)
        {
            _loginUsuario = loginUsuario;
            _jwtGenerator = jwtGenerator;
            _logoutUsuario = logoutUsuario;
            _solicitarRecuperacion = solicitarRecuperacion;
            _restablecerContrasena = restablecerContrasena;
            _loginGoogle = loginGoogle;
            _generar2FA = generar2FA;
            _confirmar2FA = confirmar2FA;
            _validar2FA = validar2FA;
            _repositorioUsuario = repositorioUsuario;
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

                var usuarioEntidad =
     _repositorioUsuario.ObtenerPorEmail(
         usuario.Email);

                if (usuarioEntidad != null &&
                    usuarioEntidad.TwoFactorEnabled)
                {
                    return Ok(new LoginResponse
                    {
                        Requiere2FA = true,
                        Email = usuario.Email
                    });
                }

                string token =
                    _jwtGenerator.GenerateToken(usuario);

                return Ok(new LoginResponse
                {
                    Requiere2FA = false,
                    Usuario = usuario,
                    Token = token
                });
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

            var usuarioEntidad =
                _repositorioUsuario.ObtenerPorEmail(
                    usuario.Email);

            if (usuarioEntidad != null &&
                usuarioEntidad.TwoFactorEnabled)
            {
                return Ok(new LoginResponse
                {
                    Requiere2FA = true,
                    Email = usuario.Email
                });
            }

            string token =
                _jwtGenerator.GenerateToken(usuario);

            return Ok(new LoginResponse
            {
                Requiere2FA = false,
                Usuario = usuario,
                Token = token
            });
        }

        [Authorize]
        [HttpPost("2fa/setup")]
        public IActionResult Generar2FA()
        {
            try
            {
                int usuarioId = int.Parse(
                    User.FindFirst(ClaimTypes.NameIdentifier)!
                        .Value);

                var resultado =
                    _generar2FA.Ejecutar(usuarioId);

                return Ok(resultado);
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

        [Authorize]
        [HttpPost("2fa/confirmar")]
        public IActionResult Confirmar2FA(
    Confirmar2FARequest request)
        {
            try
            {
                int usuarioId = int.Parse(
                    User.FindFirst(ClaimTypes.NameIdentifier)!
                        .Value);

                _confirmar2FA.Ejecutar(
                    usuarioId,
                    request);

                return Ok(new
                {
                    mensaje = "2FA activado correctamente"
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

        [HttpPost("2fa/validar")]
        public IActionResult Validar2FA(
    Validar2FARequest request)
        {
            var usuario =
                _validar2FA.Ejecutar(request);

            if (usuario == null)
            {
                return Unauthorized(new
                {
                    mensaje = "Código 2FA inválido"
                });
            }

            string token =
                _jwtGenerator.GenerateToken(usuario);

            return Ok(new
            {
                usuario,
                token
            });
        }
    }
}