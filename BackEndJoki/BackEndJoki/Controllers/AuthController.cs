using Joki.CasoUsoCompartida.DTOs.Autenticacion;
using Joki.CasoUsoCompartida.DTOs.Usuario;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Autenticacion;
using Joki.Infraestructura.AccesoDatos.Excepciones;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Joki.WebApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System.Security.Claims;

namespace Joki.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private const string MensajeLoginInvalido =
            "El correo o la contraseña son incorrectos.";

        private const string MensajeRecuperacionGenerico =
            "Si existe una cuenta asociada a ese correo, recibirás las instrucciones para recuperar tu contraseña.";

        private const string MensajeLoginSinPasswordGenerico =
            "Si existe una cuenta asociada a ese correo, recibirás un código de acceso.";

        private readonly ILoginUsuario
            _loginUsuario;

        private readonly IJwtGenerator
            _jwtGenerator;

        private readonly ILogoutUsuario
            _logoutUsuario;

        private readonly ISolicitarRecuperacionContrasena
            _solicitarRecuperacion;

        private readonly IRestablecerContrasena
            _restablecerContrasena;

        private readonly ILoginGoogle
            _loginGoogle;

        private readonly IGenerar2FA
            _generar2FA;

        private readonly IConfirmar2FA
            _confirmar2FA;

        private readonly IValidar2FA
            _validar2FA;

        private readonly IRepositorioUsuario
            _repositorioUsuario;

        private readonly ISolicitarLoginSinPassword
            _solicitarLoginSinPassword;

        private readonly IValidarLoginSinPassword
            _validarLoginSinPassword;

        public AuthController(
            ILoginUsuario loginUsuario,
            IJwtGenerator jwtGenerator,
            ILogoutUsuario logoutUsuario,
            ISolicitarRecuperacionContrasena solicitarRecuperacion,
            IRestablecerContrasena restablecerContrasena,
            ILoginGoogle loginGoogle,
            IGenerar2FA generar2FA,
            IConfirmar2FA confirmar2FA,
            IValidar2FA validar2FA,
            IRepositorioUsuario repositorioUsuario,
            ISolicitarLoginSinPassword solicitarLoginSinPassword,
            IValidarLoginSinPassword validarLoginSinPassword)
        {
            _loginUsuario =
                loginUsuario;

            _jwtGenerator =
                jwtGenerator;

            _logoutUsuario =
                logoutUsuario;

            _solicitarRecuperacion =
                solicitarRecuperacion;

            _restablecerContrasena =
                restablecerContrasena;

            _loginGoogle =
                loginGoogle;

            _generar2FA =
                generar2FA;

            _confirmar2FA =
                confirmar2FA;

            _validar2FA =
                validar2FA;

            _repositorioUsuario =
                repositorioUsuario;

            _solicitarLoginSinPassword =
                solicitarLoginSinPassword;

            _validarLoginSinPassword =
                validarLoginSinPassword;
        }

        [EnableRateLimiting("auth")]
        [HttpPost("login")]
        public IActionResult Login(
            [FromBody] LoginRequest request)
        {
            try
            {
                if (request == null ||
                    string.IsNullOrWhiteSpace(request.Email) ||
                    string.IsNullOrWhiteSpace(request.Password))
                {
                    return BadRequest(new
                    {
                        mensaje =
                            "Email y contraseña son obligatorios."
                    });
                }

                DtoDatosUsuario? usuario =
                    _loginUsuario.Ejecutar(request);

                if (usuario == null)
                {
                    return Unauthorized(new
                    {
                        mensaje =
                            MensajeLoginInvalido
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
                    _jwtGenerator.GenerateToken(
                        usuario);

                return Ok(new LoginResponse
                {
                    Requiere2FA = false,
                    Usuario = usuario,
                    Token = token
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new
                {
                    mensaje =
                        "Hubo un problema. Prueba nuevamente"
                });
            }
        }

        [EnableRateLimiting("auth")]
        [HttpPost("login-sin-password/solicitar")]
        public IActionResult SolicitarLoginSinPassword(
            [FromBody] LoginSinPasswordRequest request)
        {
            try
            {
                _solicitarLoginSinPassword.Ejecutar(
                    request);

                return Ok(new
                {
                    mensaje =
                        MensajeLoginSinPasswordGenerico
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
                return Ok(new
                {
                    mensaje =
                        MensajeLoginSinPasswordGenerico
                });
            }
        }

        [EnableRateLimiting("auth")]
        [HttpPost("login-sin-password/validar")]
        public IActionResult ValidarLoginSinPassword(
            [FromBody] ValidarLoginSinPasswordRequest request)
        {
            try
            {
                var usuario =
                    _validarLoginSinPassword.Ejecutar(
                        request);

                if (usuario == null)
                {
                    return Unauthorized(new
                    {
                        mensaje =
                            "Código inválido o expirado"
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
                    _jwtGenerator.GenerateToken(
                        usuario);

                return Ok(new LoginResponse
                {
                    Requiere2FA = false,
                    Usuario = usuario,
                    Token = token
                });
            }
            catch (Exception)
            {
                return Unauthorized(new
                {
                    mensaje =
                        "Código inválido o expirado"
                });
            }
        }

        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            try
            {
                string token =
                    Request.Headers["Authorization"]
                        .ToString()
                        .Replace("Bearer ", "");

                _logoutUsuario.Ejecutar(
                    token);

                return Ok(new
                {
                    mensaje =
                        "Sesión cerrada correctamente"
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
                    mensaje =
                        "Hubo un problema. Prueba nuevamente"
                });
            }
        }

        [EnableRateLimiting("auth")]
        [HttpPost("solicitar-recuperacion")]
        public IActionResult SolicitarRecuperacion(
            [FromBody] SolicitarRecuperacionRequest request)
        {
            try
            {
                _solicitarRecuperacion.Ejecutar(
                    request);

                return Ok(new
                {
                    mensaje =
                        MensajeRecuperacionGenerico
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
                return Ok(new
                {
                    mensaje =
                        MensajeRecuperacionGenerico
                });
            }
        }

        [EnableRateLimiting("auth")]
        [HttpPost("restablecer-contrasena")]
        public IActionResult RestablecerContrasena(
            [FromBody] RestablecerContrasenaRequest request)
        {
            try
            {
                _restablecerContrasena.Ejecutar(
                    request);

                return Ok(new
                {
                    mensaje =
                        "Contraseña restablecida correctamente"
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
                    mensaje =
                        "Hubo un problema. Prueba nuevamente"
                });
            }
        }

        [EnableRateLimiting("auth")]
        [HttpPost("google")]
        public IActionResult LoginGoogle(
            [FromBody] LoginGoogleRequest request)
        {
            try
            {
                var usuario =
                    _loginGoogle.Ejecutar(
                        request);

                if (usuario == null)
                {
                    return Unauthorized(new
                    {
                        mensaje =
                            "No se pudo iniciar sesión con Google"
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
                    _jwtGenerator.GenerateToken(
                        usuario);

                return Ok(new LoginResponse
                {
                    Requiere2FA = false,
                    Usuario = usuario,
                    Token = token
                });
            }
            catch (Exception)
            {
                return Unauthorized(new
                {
                    mensaje =
                        "No se pudo iniciar sesión con Google"
                });
            }
        }

        [Authorize]
        [HttpPost("2fa/setup")]
        public IActionResult Generar2FA()
        {
            try
            {
                int usuarioId =
                    ObtenerUsuarioId();

                var resultado =
                    _generar2FA.Ejecutar(
                        usuarioId);

                return Ok(resultado);
            }
            catch (LogicaNegocioException e)
            {
                return BadRequest(new
                {
                    mensaje = e.Message
                });
            }
            catch (UnauthorizedAccessException e)
            {
                return Unauthorized(new
                {
                    mensaje = e.Message
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new
                {
                    mensaje =
                        "Hubo un problema. Prueba nuevamente"
                });
            }
        }

        [Authorize]
        [HttpPost("2fa/confirmar")]
        public IActionResult Confirmar2FA(
            [FromBody] Confirmar2FARequest request)
        {
            try
            {
                int usuarioId =
                    ObtenerUsuarioId();

                _confirmar2FA.Ejecutar(
                    usuarioId,
                    request);

                return Ok(new
                {
                    mensaje =
                        "2FA activado correctamente"
                });
            }
            catch (LogicaNegocioException e)
            {
                return BadRequest(new
                {
                    mensaje = e.Message
                });
            }
            catch (UnauthorizedAccessException e)
            {
                return Unauthorized(new
                {
                    mensaje = e.Message
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new
                {
                    mensaje =
                        "Hubo un problema. Prueba nuevamente"
                });
            }
        }

        [EnableRateLimiting("auth")]
        [HttpPost("2fa/validar")]
        public IActionResult Validar2FA(
            [FromBody] Validar2FARequest request)
        {
            try
            {
                var usuario =
                    _validar2FA.Ejecutar(
                        request);

                if (usuario == null)
                {
                    return Unauthorized(new
                    {
                        mensaje =
                            "Código 2FA inválido"
                    });
                }

                string token =
                    _jwtGenerator.GenerateToken(
                        usuario);

                return Ok(new
                {
                    usuario,
                    token
                });
            }
            catch (Exception)
            {
                return Unauthorized(new
                {
                    mensaje =
                        "Código 2FA inválido"
                });
            }
        }

        private int ObtenerUsuarioId()
        {
            string? valor =
                User.FindFirst(
                    ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrWhiteSpace(valor) ||
                !int.TryParse(valor, out int usuarioId))
            {
                throw new UnauthorizedAccessException(
                    "El token no contiene un identificador de usuario válido.");
            }

            return usuarioId;
        }
    }
}