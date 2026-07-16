using System.Security.Claims;
using Joki.CasoUsoCompartida
    .InterfacesCasosUso.Entrenador;
using Joki.LogicaNegocio.Excepciones;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Joki.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Entrenador")]
    public class EntrenadorController :
        ControllerBase
    {
        private readonly IObtenerEntrenadorDashboard
            _obtenerDashboard;

        private readonly IObtenerGruposEntrenador
            _obtenerGruposEntrenador;

        private readonly IObtenerDetalleGrupo
            _obtenerDetalleGrupo;

        private readonly IObtenerDetalleClase
            _obtenerDetalleClase;

        private readonly IUnirseAClase
            _unirseAClase;

        private readonly ISalirDeClase
            _salirDeClase;

        private readonly IObtenerClasesDisponiblesEntrenador
            _obtenerClasesDisponibles;

        private readonly IObtenerMisClasesEntrenador
            _obtenerMisClases;

        public EntrenadorController(
            IObtenerEntrenadorDashboard obtenerDashboard,
            IObtenerGruposEntrenador obtenerGruposEntrenador,
            IObtenerDetalleGrupo obtenerDetalleGrupo,
            IObtenerDetalleClase obtenerDetalleClase,
            IUnirseAClase unirseAClase,
            ISalirDeClase salirDeClase,
            IObtenerClasesDisponiblesEntrenador
                obtenerClasesDisponibles,
            IObtenerMisClasesEntrenador obtenerMisClases)
        {
            _obtenerDashboard =
                obtenerDashboard;

            _obtenerGruposEntrenador =
                obtenerGruposEntrenador;

            _obtenerDetalleGrupo =
                obtenerDetalleGrupo;

            _obtenerDetalleClase =
                obtenerDetalleClase;

            _unirseAClase =
                unirseAClase;

            _salirDeClase =
                salirDeClase;

            _obtenerClasesDisponibles =
                obtenerClasesDisponibles;

            _obtenerMisClases =
                obtenerMisClases;
        }

        [HttpGet("dashboard")]
        public IActionResult Dashboard()
        {
            try
            {
                int entrenadorId =
                    ObtenerUsuarioIdAutenticado();

                return Ok(
                    _obtenerDashboard.Ejecutar(
                        entrenadorId));
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
                return StatusCode(500, new
                {
                    mensaje =
                        "Ocurrió un error al cargar el dashboard."
                });
            }
        }

        [HttpGet("grupos")]
        public IActionResult ObtenerGrupos()
        {
            try
            {
                int entrenadorId =
                    ObtenerUsuarioIdAutenticado();

                return Ok(
                    _obtenerGruposEntrenador.Ejecutar(
                        entrenadorId));
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
                return StatusCode(500, new
                {
                    mensaje =
                        "Ocurrió un error al cargar los grupos."
                });
            }
        }

        [HttpGet("grupos/{id:int}")]
        public IActionResult ObtenerDetalleGrupo(
            int id)
        {
            try
            {
                int entrenadorId =
                    ObtenerUsuarioIdAutenticado();

                var grupo =
                    _obtenerDetalleGrupo.Ejecutar(
                        id,
                        entrenadorId);

                if (grupo == null)
                {
                    return NotFound(new
                    {
                        mensaje =
                            "El grupo no existe o no está asignado al entrenador."
                    });
                }

                return Ok(grupo);
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
                return StatusCode(500, new
                {
                    mensaje =
                        "Ocurrió un error al cargar el grupo."
                });
            }
        }

        [HttpGet("clases/{id:int}")]
        public IActionResult ObtenerDetalleClase(
    int id,
    [FromQuery] DateTime? fecha = null)
        {
            try
            {
                int entrenadorId =
                    ObtenerUsuarioIdAutenticado();

                var clase =
                    _obtenerDetalleClase.Ejecutar(
                        id,
                        entrenadorId,
                        fecha);

                if (clase == null)
                {
                    return NotFound(new
                    {
                        mensaje =
                            "La clase no existe o no está asignada al entrenador."
                    });
                }

                return Ok(clase);
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
                return StatusCode(500, new
                {
                    mensaje =
                        "Ocurrió un error al cargar la clase."
                });
            }
        }

        [HttpGet("mis-clases")]
        public IActionResult ObtenerMisClases()
        {
            try
            {
                int entrenadorId =
                    ObtenerUsuarioIdAutenticado();

                var clases =
                    _obtenerMisClases.Ejecutar(
                        entrenadorId);

                return Ok(clases);
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
                return StatusCode(500, new
                {
                    mensaje =
                        "Ocurrió un error al cargar tus clases."
                });
            }
        }

        [HttpGet("clases-disponibles")]
        public IActionResult ObtenerClasesDisponibles()
        {
            try
            {
                int entrenadorId =
                    ObtenerUsuarioIdAutenticado();

                var clases =
                    _obtenerClasesDisponibles.Ejecutar(
                        entrenadorId);

                return Ok(clases);
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
                return StatusCode(500, new
                {
                    mensaje =
                        "Ocurrió un error al cargar las clases disponibles."
                });
            }
        }

        [HttpPost("clases/{id:int}/unirme")]
        public IActionResult UnirmeAClase(
            int id,
            [FromQuery] bool forzar = false)
        {
            try
            {
                int entrenadorId =
                    ObtenerUsuarioIdAutenticado();

                var resultado =
                    _unirseAClase.Ejecutar(
                        id,
                        entrenadorId,
                        forzar);

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
            catch (Exception)
            {
                return StatusCode(500, new
                {
                    mensaje =
                        "Ocurrió un error al unirse a la clase."
                });
            }
        }

        [HttpDelete("clases/{id:int}/salir")]
        public IActionResult SalirDeClase(
            int id)
        {
            try
            {
                int entrenadorId =
                    ObtenerUsuarioIdAutenticado();

                _salirDeClase.Ejecutar(
                    id,
                    entrenadorId);

                return Ok(new
                {
                    mensaje =
                        "Dejaste de estar asociado a la clase."
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
                return StatusCode(500, new
                {
                    mensaje =
                        "Ocurrió un error al salir de la clase."
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