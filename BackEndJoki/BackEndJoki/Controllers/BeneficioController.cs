using System.Security.Claims;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Beneficio;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Joki.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BeneficioController : ControllerBase
    {
        private readonly IObtenerMisBeneficios _obtenerMisBeneficios;

        public BeneficioController(
            IObtenerMisBeneficios obtenerMisBeneficios)
        {
            _obtenerMisBeneficios = obtenerMisBeneficios;
        }

        [Authorize]
        [HttpGet("mis-beneficios")]
        public IActionResult ObtenerMisBeneficios()
        {
            try
            {
                int alumnoId = int.Parse(
                    User.FindFirst(ClaimTypes.NameIdentifier)!
                        .Value);

                var beneficios =
                    _obtenerMisBeneficios.Ejecutar(alumnoId);

                return Ok(beneficios);
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