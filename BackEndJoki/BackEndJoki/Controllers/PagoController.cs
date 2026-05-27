using Joki.CasoUsoCompartida.DTOs.Pago;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Pago;
using Joki.LogicaNegocio.Excepciones;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Joki.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PagoController : ControllerBase
    {
        private readonly IRegistrarPago _registrarPago;
        private readonly IObtenerPagosPorCuota _obtenerPagosPorCuota;

        public PagoController(
            IRegistrarPago registrarPago,
            IObtenerPagosPorCuota obtenerPagosPorCuota)
        {
            _registrarPago = registrarPago;
            _obtenerPagosPorCuota = obtenerPagosPorCuota;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public IActionResult RegistrarPago(
            RegistrarPagoRequest request)
        {
            try
            {
                _registrarPago.Ejecutar(request);

                return Ok(new
                {
                    mensaje = "Pago registrado correctamente"
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

        [Authorize(Roles = "Admin")]
        [HttpGet("cuota/{cuotaId}")]
        public IActionResult ObtenerPorCuota(int cuotaId)
        {
            try
            {
                var pagos =
                    _obtenerPagosPorCuota.Ejecutar(cuotaId);

                return Ok(pagos);
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