using Joki.CasoUsoCompartida.InterfacesCasosUso.Auditoria;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Joki.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AuditoriaController : ControllerBase
    {
        private readonly IObtenerAuditorias _obtenerAuditorias;

        public AuditoriaController(
            IObtenerAuditorias obtenerAuditorias)
        {
            _obtenerAuditorias = obtenerAuditorias;
        }

        [HttpGet]
        public IActionResult Obtener(
            [FromQuery] int cantidad = 50)
        {
            try
            {
                var auditorias =
                    _obtenerAuditorias.Ejecutar(cantidad);

                return Ok(auditorias);
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