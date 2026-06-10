using Joki.CasoUsoCompartida.DTOs.Recompensa;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Recompensa;
using Joki.LogicaNegocio.Excepciones;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Joki.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecompensaController : ControllerBase
    {
        private readonly ICrearRecompensa _crearRecompensa;
        private readonly IObtenerRecompensasPorDesafio _obtenerRecompensasPorDesafio;
        private readonly IActualizarRecompensa _actualizarRecompensa;
        private readonly IEliminarRecompensa _eliminarRecompensa;

        public RecompensaController(
            ICrearRecompensa crearRecompensa,
            IObtenerRecompensasPorDesafio obtenerRecompensasPorDesafio,
            IActualizarRecompensa actualizarRecompensa,
            IEliminarRecompensa eliminarRecompensa)
        {
            _crearRecompensa = crearRecompensa;
            _obtenerRecompensasPorDesafio = obtenerRecompensasPorDesafio;
            _actualizarRecompensa = actualizarRecompensa;
            _eliminarRecompensa = eliminarRecompensa;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public IActionResult Crear(
            CrearRecompensaRequest request)
        {
            try
            {
                _crearRecompensa.Ejecutar(request);

                return Ok(new
                {
                    mensaje = "Recompensa creada correctamente"
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
        [HttpGet("desafio/{desafioId}")]
        public IActionResult ObtenerPorDesafio(int desafioId)
        {
            try
            {
                var recompensas =
                    _obtenerRecompensasPorDesafio.Ejecutar(desafioId);

                return Ok(recompensas);
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
        [HttpPut("{id}")]
        public IActionResult Actualizar(
    int id,
    ActualizarRecompensaRequest request)
        {
            try
            {
                _actualizarRecompensa.Ejecutar(
                    id,
                    request);

                return Ok(new
                {
                    mensaje = "Recompensa actualizada correctamente"
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
        [HttpDelete("{id}")]
        public IActionResult Eliminar(int id)
        {
            try
            {
                _eliminarRecompensa.Ejecutar(id);

                return Ok(new
                {
                    mensaje = "Recompensa eliminada correctamente"
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