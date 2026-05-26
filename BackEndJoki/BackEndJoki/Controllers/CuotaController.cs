using Joki.CasoUsoCompartida.InterfacesCasosUso.Cuota;
using Joki.LogicaNegocio.Excepciones;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Joki.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CuotaController : ControllerBase
    {
        private readonly IObtenerCuotaActualAlumno _obtenerCuotaActualAlumno;

        public CuotaController(
            IObtenerCuotaActualAlumno obtenerCuotaActualAlumno)
        {
            _obtenerCuotaActualAlumno = obtenerCuotaActualAlumno;
        }

        [Authorize(Roles = "Alumno")]
        [HttpGet("mi-cuota")]
        public IActionResult ObtenerMiCuota()
        {
            try
            {
                int alumnoId = int.Parse(
                    User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

                var cuota =
                    _obtenerCuotaActualAlumno.Ejecutar(alumnoId);

                return Ok(cuota);
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
