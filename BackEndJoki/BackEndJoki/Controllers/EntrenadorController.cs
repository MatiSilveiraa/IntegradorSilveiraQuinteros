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
        private readonly IObtenerDetalleClase _obtenerDetalleClase;

        public EntrenadorController(
            IObtenerEntrenadorDashboard obtenerDashboard,
            IObtenerGruposEntrenador obtenerGruposEntrenador,
            IObtenerDetalleGrupo obtenerDetalleGrupo,
            IObtenerDetalleClase obtenerDetalleClase)
        {
            _obtenerDashboard = obtenerDashboard;
            _obtenerGruposEntrenador = obtenerGruposEntrenador;
            _obtenerDetalleGrupo = obtenerDetalleGrupo;
            _obtenerDetalleClase = obtenerDetalleClase;
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

        [HttpGet("clases/{id}")]
        public IActionResult ObtenerDetalleClase(int id)
        {
            try
            {
                int entrenadorId = int.Parse(
                    User.FindFirst(ClaimTypes.NameIdentifier)!
                        .Value);

                var clase = _obtenerDetalleClase
                    .Ejecutar(id, entrenadorId);

                if (clase == null)
                {
                    return NotFound(new
                    {
                        mensaje = "Clase no encontrada"
                    });
                }

                return Ok(clase);
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