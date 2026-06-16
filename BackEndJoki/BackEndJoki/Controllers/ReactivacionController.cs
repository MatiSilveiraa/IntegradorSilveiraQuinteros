using Joki.CasoUsoCompartida.DTOs.Reactivacion;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Reactivacion;
using Joki.LogicaNegocio.Excepciones;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Joki.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReactivacionController : ControllerBase
    {
        private readonly ISolicitarReactivacionCuenta _solicitarReactivacion;
        private readonly IObtenerSolicitudesReactivacionPendientes _obtenerPendientes;
        private readonly IResolverSolicitudReactivacion _resolverSolicitud;

        public ReactivacionController(
            ISolicitarReactivacionCuenta solicitarReactivacion,
            IObtenerSolicitudesReactivacionPendientes obtenerPendientes,
            IResolverSolicitudReactivacion resolverSolicitud)
        {
            _solicitarReactivacion = solicitarReactivacion;
            _obtenerPendientes = obtenerPendientes;
            _resolverSolicitud = resolverSolicitud;
        }

        [Authorize]
        [HttpPost("solicitar")]
        public IActionResult Solicitar(
            SolicitarReactivacionRequest request)
        {
            try
            {
                int alumnoId = int.Parse(
                    User.FindFirst(ClaimTypes.NameIdentifier)!
                        .Value);

                _solicitarReactivacion.Ejecutar(
                    alumnoId,
                    request);

                return Ok(new
                {
                    mensaje = "Solicitud de reactivación enviada correctamente"
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
        [HttpGet("pendientes")]
        public IActionResult ObtenerPendientes()
        {
            try
            {
                var solicitudes =
                    _obtenerPendientes.Ejecutar();

                return Ok(solicitudes);
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
        [HttpPut("{id}/resolver")]
        public IActionResult Resolver(
            int id,
            ResolverSolicitudReactivacionRequest request)
        {
            try
            {
                int adminId = int.Parse(
                    User.FindFirst(ClaimTypes.NameIdentifier)!
                        .Value);

                _resolverSolicitud.Ejecutar(
                    id,
                    adminId,
                    request);

                return Ok(new
                {
                    mensaje = request.Aprobar
                        ? "Solicitud aprobada correctamente"
                        : "Solicitud rechazada correctamente"
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