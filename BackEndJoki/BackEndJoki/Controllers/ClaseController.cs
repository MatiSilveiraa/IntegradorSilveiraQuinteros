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
                int usuarioId =
                    ObtenerUsuarioIdAutenticado();

                var resultado =
                    _crearClase.Ejecutar(
                        request,
                        usuarioId);

                /*
                 * Si hay entrenadores con clases superpuestas,
                 * todavía no se crea la clase.
                 *
                 * El frontend debe mostrar un modal y reenviar
                 * el mismo request con:
                 *
                 * ForzarAsignacion = true
                 */
                if (resultado.RequiereConfirmacion)
                {
                    return Conflict(resultado);
                }

                return StatusCode(
                    StatusCodes.Status201Created,
                    resultado);
            }
            catch (UnauthorizedAccessException e)
            {
                return Unauthorized(new
                {
                    mensaje = e.Message
                });
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
            catch (Exception)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        mensaje =
                            "Ocurrió un error al crear la clase."
                    });
            }
        }

        [HttpGet]
        public IActionResult ObtenerTodas()
        {
            try
            {
                var clases =
                    _obtenerClases.Ejecutar();

                return Ok(clases);
            }
            catch (Exception)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        mensaje =
                            "Ocurrió un error al cargar las clases."
                    });
            }
        }

        [HttpGet("{id:int}")]
        public IActionResult ObtenerPorId(
            int id)
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
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        mensaje =
                            "Ocurrió un error al cargar la clase."
                    });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{id:int}/inscriptos")]
        public IActionResult ObtenerInscriptos(
            int id)
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
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        mensaje =
                            "Ocurrió un error al cargar los inscriptos de la clase."
                    });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        public IActionResult Editar(
            int id,
            [FromBody] EditarClaseRequest request)
        {
            try
            {
                int usuarioId =
                    ObtenerUsuarioIdAutenticado();

                var resultado =
                    _editarClase.Ejecutar(
                        id,
                        request,
                        usuarioId);

                /*
                 * Si hay superposición de entrenadores,
                 * el backend devuelve 409 y no guarda los cambios.
                 *
                 * El frontend debe reenviar el request con:
                 *
                 * ForzarAsignacion = true
                 */
                if (resultado.RequiereConfirmacion)
                {
                    return Conflict(resultado);
                }

                return Ok(resultado);
            }
            catch (UnauthorizedAccessException e)
            {
                return Unauthorized(new
                {
                    mensaje = e.Message
                });
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
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        mensaje = ex.Message,
                        detalle = ex.InnerException?.Message,
                        stack = ex.StackTrace
                    });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}/estado")]
        public IActionResult CambiarEstado(
            int id,
            [FromBody] CambiarEstadoClaseRequest request)
        {
            try
            {
                int usuarioId =
                    ObtenerUsuarioIdAutenticado();

                _cambiarEstadoClase.Ejecutar(
                    id,
                    request,
                    usuarioId);

                return Ok(new
                {
                    mensaje =
                        "Estado de clase actualizado correctamente"
                });
            }
            catch (UnauthorizedAccessException e)
            {
                return Unauthorized(new
                {
                    mensaje = e.Message
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
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        mensaje =
                            "Ocurrió un error al cambiar el estado de la clase."
                    });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public IActionResult Eliminar(
            int id)
        {
            try
            {
                int usuarioId =
                    ObtenerUsuarioIdAutenticado();

                _eliminarClase.Ejecutar(
                    id,
                    usuarioId);

                return Ok(new
                {
                    mensaje =
                        "Clase eliminada correctamente"
                });
            }
            catch (UnauthorizedAccessException e)
            {
                return Unauthorized(new
                {
                    mensaje = e.Message
                });
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
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        mensaje =
                            "Ocurrió un error al eliminar la clase."
                    });
            }
        }

        private int ObtenerUsuarioIdAutenticado()
        {
            string? valor =
                User.FindFirst(
                    ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrWhiteSpace(valor) ||
                !int.TryParse(
                    valor,
                    out int usuarioId))
            {
                throw new UnauthorizedAccessException(
                    "El token no contiene un identificador de usuario válido.");
            }

            return usuarioId;
        }
    }
}