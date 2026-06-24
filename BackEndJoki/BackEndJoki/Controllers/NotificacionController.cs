using Joki.CasoUsoCompartida.InterfacesCasosUso.Notificacion;
using Joki.LogicaNegocio.Excepciones;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Joki.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificacionController : ControllerBase
    {
        private readonly IObtenerMisNotificaciones _obtenerMisNotificaciones;
        private readonly IMarcarNotificacionComoLeida _marcarNotificacionComoLeida;
        private readonly IMarcarTodasNotificacionesComoLeidas _marcarTodasNotificacionesComoLeidas;

        public NotificacionController(
            IObtenerMisNotificaciones obtenerMisNotificaciones,
            IMarcarNotificacionComoLeida marcarNotificacionComoLeida,
            IMarcarTodasNotificacionesComoLeidas marcarTodasNotificacionesComoLeidas)
        {
            _obtenerMisNotificaciones = obtenerMisNotificaciones;
            _marcarNotificacionComoLeida = marcarNotificacionComoLeida;
            _marcarTodasNotificacionesComoLeidas = marcarTodasNotificacionesComoLeidas;
        }

        [Authorize]
        [HttpGet("mis-notificaciones")]
        public IActionResult ObtenerMisNotificaciones()
        {
            try
            {
                int usuarioId = int.Parse(
                    User.FindFirst(ClaimTypes.NameIdentifier)!
                        .Value);

                var notificaciones =
                    _obtenerMisNotificaciones.Ejecutar(usuarioId);

                return Ok(notificaciones);
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
        [HttpPut("{id}/leer")]
        public IActionResult MarcarComoLeida(int id)
        {
            try
            {
                int usuarioId = int.Parse(
                    User.FindFirst(ClaimTypes.NameIdentifier)!
                        .Value);

                _marcarNotificacionComoLeida.Ejecutar(
                    id,
                    usuarioId);

                return Ok(new
                {
                    mensaje = "Notificación marcada como leída"
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

        [Authorize]
        [HttpPut("leer-todas")]
        public IActionResult MarcarTodasComoLeidas()
        {
            try
            {
                int usuarioId = int.Parse(
                    User.FindFirst(ClaimTypes.NameIdentifier)!
                        .Value);

                _marcarTodasNotificacionesComoLeidas
                    .Ejecutar(usuarioId);

                return Ok(new
                {
                    mensaje =
                        "Todas las notificaciones fueron marcadas como leídas"
                });
            }
            catch (Exception)
            {
                return StatusCode(500, new
                {
                    mensaje =
                        "Hubo un problema. Prueba nuevamente"
                });
            }
        }
    }
}