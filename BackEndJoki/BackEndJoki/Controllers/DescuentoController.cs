using Joki.CasoUsoCompartida.DTOs.Descuento;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Descuento;
using Joki.LogicaNegocio.Excepciones;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Joki.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DescuentoController : ControllerBase
    {
        private readonly ICrearDescuento _crearDescuento;
        private readonly IObtenerDescuentos _obtenerDescuentos;
        private readonly IObtenerDescuentoPorId _obtenerDescuentoPorId;
        private readonly IActualizarDescuento _actualizarDescuento;

        public DescuentoController(
            ICrearDescuento crearDescuento,
            IObtenerDescuentos obtenerDescuentos,
            IObtenerDescuentoPorId obtenerDescuentoPorId,
            IActualizarDescuento actualizarDescuento)
        {
            _crearDescuento = crearDescuento;
            _obtenerDescuentos = obtenerDescuentos;
            _obtenerDescuentoPorId = obtenerDescuentoPorId;
            _actualizarDescuento = actualizarDescuento;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public IActionResult Crear(
            CrearDescuentoRequest request)
        {
            try
            {
                int usuarioId = int.Parse(
                    User.FindFirst(ClaimTypes.NameIdentifier)!
                        .Value);

                _crearDescuento.Ejecutar(
                    request,
                    usuarioId);

                return Ok(new
                {
                    mensaje = "Descuento creado correctamente"
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
        [HttpGet]
        public IActionResult ObtenerTodos()
        {
            try
            {
                var descuentos =
                    _obtenerDescuentos.Ejecutar();

                return Ok(descuentos);
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
        [HttpGet("{id}")]
        public IActionResult ObtenerPorId(int id)
        {
            try
            {
                var descuento =
                    _obtenerDescuentoPorId.Ejecutar(id);

                return Ok(descuento);
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
        [HttpPut("{id}")]
        public IActionResult Actualizar(
            int id,
            ActualizarDescuentoRequest request)
        {
            try
            {
                int usuarioId = int.Parse(
                    User.FindFirst(ClaimTypes.NameIdentifier)!
                        .Value);

                _actualizarDescuento.Ejecutar(
                    id,
                    request,
                    usuarioId);

                return Ok(new
                {
                    mensaje = "Descuento actualizado correctamente"
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