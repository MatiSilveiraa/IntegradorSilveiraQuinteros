using System.Security.Claims;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Historial;
using Joki.LogicaNegocio.Excepciones;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Joki.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HistorialController : ControllerBase
    {
        private readonly IObtenerMiHistorial _obtenerMiHistorial;

        public HistorialController(
            IObtenerMiHistorial obtenerMiHistorial)
        {
            _obtenerMiHistorial = obtenerMiHistorial;
        }

        [Authorize(Roles = "Alumno")]
        [HttpGet("mi-historial")]
        public IActionResult ObtenerMiHistorial()
        {
            try
            {
                int alumnoId = int.Parse(
                    User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

                var historial =
                    _obtenerMiHistorial.Ejecutar(alumnoId);

                return Ok(historial);
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

        [Authorize(Roles = "Admin")]
        [HttpGet("alumno/{alumnoId}")]
        public IActionResult ObtenerHistorialAlumno(int alumnoId)
        {
            try
            {
                var historial =
                    _obtenerMiHistorial.Ejecutar(alumnoId);

                return Ok(historial);
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
    }
}