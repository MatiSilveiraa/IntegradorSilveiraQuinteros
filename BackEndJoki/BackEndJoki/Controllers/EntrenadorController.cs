using System.Security.Claims;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Entrenador;
using Joki.LogicaNegocio.Excepciones;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Joki.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Entrenador")]
    public class EntrenadorController : ControllerBase
    {
        private readonly IObtenerEntrenadorDashboard _obtenerDashboard;
        private readonly IObtenerGruposEntrenador _obtenerGruposEntrenador;
        private readonly IObtenerDetalleGrupo _obtenerDetalleGrupo;

        public EntrenadorController(
            IObtenerEntrenadorDashboard obtenerDashboard,
            IObtenerGruposEntrenador obtenerGruposEntrenador,
            IObtenerDetalleGrupo obtenerDetalleGrupo)
        {
            _obtenerDashboard = obtenerDashboard;
            _obtenerGruposEntrenador = obtenerGruposEntrenador;
            _obtenerDetalleGrupo = obtenerDetalleGrupo;
        }

        [HttpGet("dashboard")]
        public IActionResult Dashboard()
        {
            try
            {
                int entrenadorId = int.Parse(
                    User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

                var dashboard =
                    _obtenerDashboard.Ejecutar(entrenadorId);

                return Ok(dashboard);
            }
            catch (LogicaNegocioException e)
            {
                return BadRequest(new
                {
                    mensaje = e.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = ex.Message,
                    inner = ex.InnerException?.Message,
                    stack = ex.StackTrace
                });
            }
        }

        [Authorize(Roles = "Entrenador")]
        [HttpGet("grupos")]
        public IActionResult ObtenerGrupos()
        {
            try
            {
                int entrenadorId =
                    int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

                var grupos = _obtenerGruposEntrenador.Ejecutar(entrenadorId);

                return Ok(grupos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = ex.Message
                });
            }
        }

        [Authorize(Roles = "Entrenador")]
        [HttpGet("grupos/{id}")]
        public IActionResult ObtenerDetalleGrupo(int id)
        {
            try
            {
                int entrenadorId = int.Parse(
                    User.FindFirst(ClaimTypes.NameIdentifier)!
                        .Value);

                var grupo = _obtenerDetalleGrupo
                    .Ejecutar(id, entrenadorId);

                if (grupo == null)
                {
                    return NotFound(new
                    {
                        mensaje = "Grupo no encontrado"
                    });
                }

                return Ok(grupo);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = ex.Message
                });
            }
        }
    }
}