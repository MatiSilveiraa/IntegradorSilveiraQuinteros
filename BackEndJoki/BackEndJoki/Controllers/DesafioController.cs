using Joki.CasoUsoCompartida.DTOs.Desafio;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Desafio;
using Joki.LogicaNegocio.Excepciones;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Joki.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DesafioController : ControllerBase
    {
        private readonly ICrearDesafio _crearDesafio;
        private readonly IObtenerDesafios _obtenerDesafios;
        private readonly IActualizarDesafio _actualizarDesafio;
        private readonly IEliminarDesafio _eliminarDesafio;
        private readonly IAsignarGanadoresDesafio _asignarGanadoresDesafio;
        private readonly IObtenerGanadoresDesafio _obtenerGanadoresDesafio;
        private readonly IParticiparDesafio _participarDesafio;
        private readonly IObtenerParticipantesDesafio _obtenerParticipantesDesafio;
        private readonly IObtenerMisDesafios _obtenerMisDesafios;

        public DesafioController(
            ICrearDesafio crearDesafio,
            IObtenerDesafios obtenerDesafios,
            IActualizarDesafio actualizarDesafio,
            IEliminarDesafio eliminarDesafio,
            IAsignarGanadoresDesafio asignarGanadoresDesafio,
            IObtenerGanadoresDesafio obtenerGanadoresDesafio,
            IParticiparDesafio participarDesafio,
            IObtenerParticipantesDesafio obtenerParticipantesDesafio,
            IObtenerMisDesafios obtenerMisDesafios)
        {
            _crearDesafio = crearDesafio;
            _obtenerDesafios = obtenerDesafios;
            _actualizarDesafio = actualizarDesafio;
            _eliminarDesafio = eliminarDesafio;
            _asignarGanadoresDesafio = asignarGanadoresDesafio;
            _obtenerGanadoresDesafio = obtenerGanadoresDesafio;
            _participarDesafio = participarDesafio;
            _obtenerParticipantesDesafio = obtenerParticipantesDesafio;
            _obtenerMisDesafios = obtenerMisDesafios;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public IActionResult Crear(
            CrearDesafioRequest request)
        {
            try
            {
                int usuarioId = int.Parse(
                    User.FindFirst(ClaimTypes.NameIdentifier)!
                        .Value);

                _crearDesafio.Ejecutar(
                    request,
                    usuarioId);

                return Ok(new
                {
                    mensaje = "Desafío creado correctamente"
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
        [HttpGet]
        public IActionResult ObtenerTodos()
        {
            try
            {
                var desafios =
                    _obtenerDesafios.Ejecutar();

                return Ok(desafios);
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
            ActualizarDesafioRequest request)
        {
            try
            {
                int usuarioId = int.Parse(
                    User.FindFirst(ClaimTypes.NameIdentifier)!
                        .Value);

                _actualizarDesafio.Ejecutar(
                    id,
                    request,
                    usuarioId);

                return Ok(new
                {
                    mensaje = "Desafío actualizado correctamente"
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

                _eliminarDesafio.Ejecutar(
                    id,
                    usuarioId);

                return Ok(new
                {
                    mensaje = "Desafío eliminado correctamente"
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
        [HttpPost("ganadores")]
        public IActionResult AsignarGanadores(
            AsignarGanadoresRequest request)
        {
            try
            {
                int usuarioId = int.Parse(
                    User.FindFirst(ClaimTypes.NameIdentifier)!
                        .Value);

                _asignarGanadoresDesafio.Ejecutar(
                    request,
                    usuarioId);

                return Ok(new
                {
                    mensaje = "Ganadores asignados correctamente"
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
        [HttpGet("{id}/ganadores")]
        public IActionResult ObtenerGanadores(int id)
        {
            try
            {
                var ganadores =
                    _obtenerGanadoresDesafio.Ejecutar(id);

                return Ok(ganadores);
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
        [HttpPost("{id}/participar")]
        public IActionResult Participar(int id)
        {
            try
            {
                int alumnoId = int.Parse(
                    User.FindFirst(ClaimTypes.NameIdentifier)!
                        .Value);

                _participarDesafio.Ejecutar(
                    id,
                    alumnoId);

                return Ok(new
                {
                    mensaje = "Participación registrada correctamente"
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
        [HttpGet("{id}/participantes")]
        public IActionResult ObtenerParticipantes(int id)
        {
            try
            {
                var participantes =
                    _obtenerParticipantesDesafio.Ejecutar(id);

                return Ok(participantes);
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
        [HttpGet("mis-desafios")]
        public IActionResult ObtenerMisDesafios()
        {
            try
            {
                int alumnoId = int.Parse(
                    User.FindFirst(ClaimTypes.NameIdentifier)!
                        .Value);

                var desafios =
                    _obtenerMisDesafios.Ejecutar(alumnoId);

                return Ok(desafios);
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