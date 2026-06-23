using Joki.CasoUsoCompartida.InterfacesCasosUso.Beneficio;
using Joki.LogicaNegocio.Excepciones;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Joki.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BeneficioController : ControllerBase
    {
        private readonly IObtenerMisBeneficios _obtenerMisBeneficios;
        private readonly IEntregarBeneficioFisico _entregarBeneficioFisico;
        private readonly IObtenerBeneficiosFisicosPendientes _obtenerBeneficiosFisicosPendientes;

        public BeneficioController(
            IObtenerMisBeneficios obtenerMisBeneficios,
            IEntregarBeneficioFisico entregarBeneficioFisico,
            IObtenerBeneficiosFisicosPendientes obtenerBeneficiosFisicosPendientes)
        {
            _obtenerMisBeneficios = obtenerMisBeneficios;
            _entregarBeneficioFisico = entregarBeneficioFisico;
            _obtenerBeneficiosFisicosPendientes = obtenerBeneficiosFisicosPendientes;
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

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/entregar")]
        public IActionResult Entregar(int id)
        {
            try
            {
                int usuarioId = int.Parse(
                    User.FindFirst(ClaimTypes.NameIdentifier)!
                        .Value);

                _entregarBeneficioFisico.Ejecutar(
                    id,
                    usuarioId);

                return Ok(new
                {
                    mensaje = "Beneficio entregado correctamente"
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
        [HttpGet("fisicos-pendientes")]
        public IActionResult ObtenerFisicosPendientes()
        {
            try
            {
                var beneficios =
                    _obtenerBeneficiosFisicosPendientes.Ejecutar();

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