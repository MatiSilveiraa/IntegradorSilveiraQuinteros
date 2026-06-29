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

        public EntrenadorController(
            IObtenerEntrenadorDashboard obtenerDashboard)
        {
            _obtenerDashboard = obtenerDashboard;
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
    }
}