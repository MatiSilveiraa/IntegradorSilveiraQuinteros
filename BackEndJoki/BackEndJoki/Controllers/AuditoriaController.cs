using Joki.CasoUsoCompartida.InterfacesCasosUso.Auditoria;
using Joki.LogicaNegocio.Excepciones;
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
        private readonly IObtenerAuditoriasPorUsuario _obtenerAuditoriasPorUsuario;
        private readonly IObtenerAuditoriasPorEntidad _obtenerAuditoriasPorEntidad;

        public AuditoriaController(
            IObtenerAuditorias obtenerAuditorias,
            IObtenerAuditoriasPorUsuario obtenerAuditoriasPorUsuario,
            IObtenerAuditoriasPorEntidad obtenerAuditoriasPorEntidad)
        {
            _obtenerAuditorias = obtenerAuditorias;
            _obtenerAuditoriasPorUsuario = obtenerAuditoriasPorUsuario;
            _obtenerAuditoriasPorEntidad = obtenerAuditoriasPorEntidad;
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

        [HttpGet("usuario/{usuarioId}")]
        public IActionResult ObtenerPorUsuario(
            int usuarioId,
            [FromQuery] int cantidad = 50)
        {
            try
            {
                var auditorias =
                    _obtenerAuditoriasPorUsuario.Ejecutar(
                        usuarioId,
                        cantidad);

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

        [HttpGet("entidad/{entidad}")]
        public IActionResult ObtenerPorEntidad(
            string entidad,
            [FromQuery] int cantidad = 50)
        {
            try
            {
                var auditorias =
                    _obtenerAuditoriasPorEntidad.Ejecutar(
                        entidad,
                        cantidad);

                return Ok(auditorias);
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