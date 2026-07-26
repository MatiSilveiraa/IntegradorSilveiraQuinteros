using Joki.CasoUsoCompartida.DTOs.Grupo;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Grupo;
using Joki.Infraestructura.AccesoDatos.Excepciones;
using Joki.LogicaNegocio.Excepciones;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Joki.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GrupoController : ControllerBase
    {
        private readonly ICrearGrupo _crearGrupo;

        private readonly IObtenerGrupos _obtenerGrupos;

        private readonly IObtenerGrupoPorId _obtenerGrupoPorId;

        private readonly IEditarGrupo _editarGrupo;

        private readonly IEliminarGrupo _eliminarGrupo;

        public GrupoController(
            ICrearGrupo crearGrupo,
            IObtenerGrupos obtenerGrupos,
            IObtenerGrupoPorId obtenerGrupoPorId,
            IEditarGrupo editarGrupo,
            IEliminarGrupo eliminarGrupo)
        {
            _crearGrupo = crearGrupo;

            _obtenerGrupos = obtenerGrupos;

            _obtenerGrupoPorId = obtenerGrupoPorId;

            _editarGrupo = editarGrupo;

            _eliminarGrupo = eliminarGrupo;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public IActionResult Crear(
            [FromBody] CrearGrupoRequest request)
        {
            try
            {
                if (!TryObtenerUsuarioId(
                    out int usuarioId))
                {
                    return Unauthorized(new
                    {
                        mensaje =
                            "No se pudo identificar al usuario autenticado."
                    });
                }

                var response =
                    _crearGrupo.Ejecutar(
                        request,
                        usuarioId);

                return StatusCode(
                    StatusCodes.Status201Created,
                    response);
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
            catch (Exception e)
            {
                Console.WriteLine(
                    $"Error al crear grupo: {e}");

                Error error =
                    new Error(
                        500,
                        "Hubo un problema al crear el grupo. Prueba nuevamente.");

                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    error);
            }
        }

        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                var grupos =
                    _obtenerGrupos.Ejecutar();

                return Ok(grupos);
            }
            catch (Exception e)
            {
                Console.WriteLine(
                    $"Error al obtener grupos: {e}");

                Error error =
                    new Error(
                        500,
                        "Hubo un problema al obtener los grupos.");

                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    error);
            }
        }

        [HttpGet("{id:int}")]
        public IActionResult ObtenerPorId(
            int id)
        {
            try
            {
                var grupo =
                    _obtenerGrupoPorId.Ejecutar(id);

                return Ok(grupo);
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
                Console.WriteLine(
                    $"Error al obtener grupo {id}: {e}");

                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        mensaje =
                            "Hubo un problema al obtener el grupo."
                    });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id:int}")]
        public IActionResult Editar(
            int id,
            [FromBody] EditarGrupoRequest request)
        {
            try
            {
                if (!TryObtenerUsuarioId(
                    out int usuarioId))
                {
                    return Unauthorized(new
                    {
                        mensaje =
                            "No se pudo identificar al usuario autenticado."
                    });
                }

                var grupo =
                    _editarGrupo.Ejecutar(
                        id,
                        request,
                        usuarioId);

                return Ok(grupo);
            }
            catch (LogicaNegocioException e)
            {
                if (e.Message ==
                    "El grupo solicitado no existe.")
                {
                    return NotFound(new
                    {
                        mensaje = e.Message
                    });
                }

                return BadRequest(new
                {
                    mensaje = e.Message
                });
            }
            catch (Exception e)
            {
                Console.WriteLine(
                    $"Error al editar grupo {id}: {e}");

                Error error =
                    new Error(
                        500,
                        "Hubo un problema al editar el grupo.");

                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    error);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id:int}")]
        public IActionResult Eliminar(
            int id)
        {
            try
            {
                if (!TryObtenerUsuarioId(
                    out int usuarioId))
                {
                    return Unauthorized(new
                    {
                        mensaje =
                            "No se pudo identificar al usuario autenticado."
                    });
                }

                _eliminarGrupo.Ejecutar(
                    id,
                    usuarioId);

                return Ok(new
                {
                    mensaje =
                        "Grupo eliminado correctamente."
                });
            }
            catch (LogicaNegocioException e)
            {
                if (e.Message ==
                    "El grupo solicitado no existe.")
                {
                    return NotFound(new
                    {
                        mensaje = e.Message
                    });
                }

                if (e.Message ==
                    "No se puede eliminar el grupo porque tiene clases asociadas.")
                {
                    return Conflict(new
                    {
                        mensaje = e.Message
                    });
                }

                return BadRequest(new
                {
                    mensaje = e.Message
                });
            }
            catch (Exception e)
            {
                Console.WriteLine(
                    $"Error al eliminar grupo {id}: {e}");

                Error error =
                    new Error(
                        500,
                        "Hubo un problema al eliminar el grupo.");

                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    error);
            }
        }

        private bool TryObtenerUsuarioId(
            out int usuarioId)
        {
            usuarioId = 0;

            string? usuarioIdTexto =
                User.FindFirst(
                    ClaimTypes.NameIdentifier)?.Value
                ?? User.FindFirst("usuarioId")?.Value
                ?? User.FindFirst("id")?.Value
                ?? User.FindFirst("sub")?.Value;

            return int.TryParse(
                usuarioIdTexto,
                out usuarioId);
        }
    }
}