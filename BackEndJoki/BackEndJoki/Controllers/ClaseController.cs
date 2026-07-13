using Joki.CasoUsoCompartida.DTOs.Clase;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Clase;
using Joki.Infraestructura.AccesoDatos.Excepciones;
using Joki.LogicaNegocio.Excepciones;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Joki.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClaseController : ControllerBase
    {
        private readonly ICrearClase _crearClase;
        private readonly IEditarClase _editarClase;
        private readonly IEliminarClase _eliminarClase;
        private readonly IObtenerClase _obtenerClase;
        private readonly IObtenerClases _obtenerClases;
        private readonly ICambiarEstadoClase _cambiarEstadoClase;
        private readonly IObtenerInscriptosClase _obtenerInscriptosClase;

        public ClaseController(
            ICrearClase crearClase,
            IEditarClase editarClase,
            IEliminarClase eliminarClase,
            IObtenerClase obtenerClase,
            IObtenerClases obtenerClases,
            ICambiarEstadoClase cambiarEstadoClase,
            IObtenerInscriptosClase obtenerInscriptosClase)
        {
            _crearClase = crearClase;
            _editarClase = editarClase;
            _eliminarClase = eliminarClase;
            _obtenerClase = obtenerClase;
            _obtenerClases = obtenerClases;
            _cambiarEstadoClase = cambiarEstadoClase;
            _obtenerInscriptosClase = obtenerInscriptosClase;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public IActionResult Crear(
            [FromBody] CrearClaseRequest request)
        {
            try
            {
                int usuarioId = int.Parse(
                    User.FindFirst(ClaimTypes.NameIdentifier)!
                        .Value);

                var response =
                    _crearClase.Ejecutar(
                        request,
                        usuarioId);

                return StatusCode(201, response);
            }
            catch (InfraestructuraException e)
            {
                return StatusCode(
                    e.StatusCode(),
                    e.Error());
            }
            catch (LogicaNegocioException e)
            {
                return BadRequest(new
                {
                    mensaje = e.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = ex.Message,
                    inner = ex.InnerException?.Message,
                    stack = ex.StackTrace
                });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{id}/inscriptos")]
        public IActionResult ObtenerInscriptos(int id)
        {
            try
            {
                var inscriptos =
                    _obtenerInscriptosClase.Ejecutar(id);

                return Ok(inscriptos);
            }
            catch (LogicaNegocioException e)
            {
                return NotFound(new
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

        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                var clases =
                    _obtenerClases.Ejecutar();

                return Ok(clases);
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

        [HttpGet("{id}")]
        public IActionResult ObtenerPorId(int id)
        {
            try
            {
                var clase =
                    _obtenerClase.Ejecutar(id);

                return Ok(clase);
            }
            catch (LogicaNegocioException e)
            {
                return NotFound(new
                {
                    mensaje = e.Message
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

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public IActionResult Editar(
            int id,
            [FromBody] EditarClaseRequest request)
        {
            try
            {
                int usuarioId = int.Parse(
                    User.FindFirst(ClaimTypes.NameIdentifier)!
                        .Value);

                var clase =
                    _editarClase.Ejecutar(
                        id,
                        request,
                        usuarioId);

                return Ok(clase);
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
                    mensaje =
                        "Hubo un problema. Prueba nuevamente"
                });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/estado")]
        public IActionResult CambiarEstado(
    int id,
    [FromBody] CambiarEstadoClaseRequest request)
        {
            try
            {
                int usuarioId = int.Parse(
                    User.FindFirst(ClaimTypes.NameIdentifier)!
                        .Value);

                _cambiarEstadoClase.Ejecutar(
                    id,
                    request,
                    usuarioId);

                return Ok(new
                {
                    mensaje = "Estado de clase actualizado correctamente"
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
                int usuarioId = int.Parse(
                    User.FindFirst(ClaimTypes.NameIdentifier)!
                        .Value);

                _eliminarClase.Ejecutar(
                    id,
                    usuarioId);

                return Ok(new
                {
                    mensaje =
                        "Clase eliminada correctamente"
                });
            }
            catch (LogicaNegocioException e)
            {
                return NotFound(new
                {
                    mensaje = e.Message
                });
            }
            catch (Exception e)
            {
                return StatusCode(500, new
                {
                    mensaje = e.Message,
                    detalle = e.InnerException?.Message
                });
            }
        }
    }
}