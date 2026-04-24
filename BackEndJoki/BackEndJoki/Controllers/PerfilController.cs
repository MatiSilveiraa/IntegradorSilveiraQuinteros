using Joki.CasoUsoCompartida.DTOs.Perfil;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Perfil;
using Joki.LogicaNegocio.Excepciones;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BackEndJoki.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PerfilController : ControllerBase
    {
        private readonly IObtenerPerfilUsuario _obtenerPerfil;
        private readonly IActualizarPerfilUsuario _actualizarPerfil;

        public PerfilController(
            IObtenerPerfilUsuario obtenerPerfil, 
            IActualizarPerfilUsuario actualizarPerfil)
        {
            _obtenerPerfil = obtenerPerfil;
            _actualizarPerfil = actualizarPerfil;
        }

        private int ObtenerIdUsuarioAutenticado()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                              ?? User.FindFirst("id")?.Value;
                              
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int usuarioId))
            {
                throw new UnauthorizedAccessException("El token no contiene un identificador de usuario válido.");
            }
            return usuarioId;
        }

        [HttpGet("mi-perfil")]
        public IActionResult ObtenerMiPerfil()
        {
            try
            {
                int usuarioId = ObtenerIdUsuarioAutenticado();
                var perfil = _obtenerPerfil.Ejecutar(usuarioId);
                return Ok(perfil);
            }
            catch (UnauthorizedAccessException e)
            {
                return Unauthorized(new { mensaje = e.Message });
            }
            catch (InvalidOperationException e)
            {
                return NotFound(new { mensaje = e.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { mensaje = "Ocurrió un error al cargar el perfil." });
            }
        }

        [HttpPut("mi-perfil")]
        public IActionResult ActualizarMiPerfil([FromBody] ActualizarPerfilRequest request)
        {
            try
            {
                int usuarioId = ObtenerIdUsuarioAutenticado();
                var perfilActualizado = _actualizarPerfil.Ejecutar(usuarioId, request);

                return Ok(new
                {
                    mensaje = "Perfil actualizado con éxito.",
                    perfil = perfilActualizado
                });
            }
            catch (UnauthorizedAccessException e)
            {
                return Unauthorized(new { mensaje = e.Message });
            }
            catch (ArgumentException e)
            {
                return BadRequest(new { mensaje = e.Message });
            }
            catch (InvalidOperationException e)
            {
                return BadRequest(new { mensaje = e.Message });
            }
            catch (LogicaNegocioException e)
            {
                return StatusCode(e.Error().Code, new { mensaje = e.Error().Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { mensaje = "Ocurrió un error al actualizar el perfil." });
            }
        }
    }
}
