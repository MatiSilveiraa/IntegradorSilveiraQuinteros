using Joki.CasoUsoCompartida.DTOs.ConfiguracionCuota;
using Joki.CasoUsoCompartida.InterfacesCasosUso.ConfiguracionCuota;
using Joki.LogicaNegocio.Excepciones;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Joki.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConfiguracionCuotaController : ControllerBase
    {
        private readonly IObtenerConfiguracionCuota _obtenerConfiguracionCuota;
        private readonly IActualizarConfiguracionCuota _actualizarConfiguracionCuota;

        public ConfiguracionCuotaController(
            IObtenerConfiguracionCuota obtenerConfiguracionCuota,
            IActualizarConfiguracionCuota actualizarConfiguracionCuota)
        {
            _obtenerConfiguracionCuota = obtenerConfiguracionCuota;
            _actualizarConfiguracionCuota = actualizarConfiguracionCuota;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public IActionResult Obtener()
        {
            try
            {
                var configuracion =
                    _obtenerConfiguracionCuota.Ejecutar();

                return Ok(configuracion);
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
        [HttpPut]
        public IActionResult Actualizar(
            ActualizarConfiguracionCuotaRequest request)
        {
            try
            {
                int usuarioId = int.Parse(
                    User.FindFirst(ClaimTypes.NameIdentifier)!
                        .Value);

                _actualizarConfiguracionCuota.Ejecutar(
                    request,
                    usuarioId);

                return Ok(new
                {
                    mensaje = "Configuración de cuota actualizada correctamente"
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
    }
}