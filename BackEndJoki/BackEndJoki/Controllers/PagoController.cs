using Joki.CasoUsoCompartida.Configuracion;
using Joki.CasoUsoCompartida.DTOs.Pago;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Pago;
using Joki.LogicaNegocio.Excepciones;
using MercadoPago.Client.Payment;
using MercadoPago.Config;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Joki.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PagoController : ControllerBase
    {
        private readonly IRegistrarPago _registrarPago;
        private readonly IObtenerPagosPorCuota _obtenerPagosPorCuota;
        private readonly ICrearPagoMercadoPago _crearPagoMercadoPago;
        private readonly IConfirmarPagoMercadoPago _confirmarPagoMercadoPago;
        private readonly MercadoPagoSettings _mercadoPagoSettings;

        public PagoController(
            IRegistrarPago registrarPago,
            IObtenerPagosPorCuota obtenerPagosPorCuota,
            ICrearPagoMercadoPago crearPagoMercadoPago,
            IConfirmarPagoMercadoPago confirmarPagoMercadoPago,
            IOptions<MercadoPagoSettings> mercadoPagoSettings)
        {
            _registrarPago = registrarPago;
            _obtenerPagosPorCuota = obtenerPagosPorCuota;
            _crearPagoMercadoPago = crearPagoMercadoPago;
            _confirmarPagoMercadoPago = confirmarPagoMercadoPago;
            _mercadoPagoSettings = mercadoPagoSettings.Value;
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

        [Authorize]
        [HttpPost("mercadopago/{cuotaId}")]
        public IActionResult CrearPagoMercadoPago(int cuotaId)
        {
            try
            {
                var resultado =
                    _crearPagoMercadoPago.Ejecutar(cuotaId);

                return Ok(resultado);
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

        [HttpPut("mercadopago/confirmar/{referenciaExterna}")]
        public IActionResult ConfirmarPagoMercadoPago(string referenciaExterna)
        {
            try
            {
                _confirmarPagoMercadoPago
                    .Ejecutar(referenciaExterna);

                return Ok(new
                {
                    mensaje = "Pago confirmado correctamente"
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

        [HttpPost("mercadopago/webhook")]
        public IActionResult WebhookMercadoPago()
        {
            try
            {
                string? paymentId =
                    Request.Query["data.id"].FirstOrDefault();

                if (string.IsNullOrEmpty(paymentId))
                {
                    paymentId =
                        Request.Query["id"].FirstOrDefault();
                }

                if (string.IsNullOrEmpty(paymentId))
                {
                    return Ok();
                }

                MercadoPagoConfig.AccessToken =
                    _mercadoPagoSettings.AccessToken;

                var client = new PaymentClient();

                var payment =
                    client.Get(long.Parse(paymentId));

                if (payment.Status == "approved" &&
                    !string.IsNullOrEmpty(payment.ExternalReference))
                {
                    _confirmarPagoMercadoPago.Ejecutar(
                        payment.ExternalReference);
                }

                return Ok();
            }
            catch (Exception)
            {
                return Ok();
            }
        }
    }
}