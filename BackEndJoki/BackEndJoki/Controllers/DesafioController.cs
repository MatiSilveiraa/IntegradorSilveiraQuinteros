using Joki.CasoUsoCompartida.DTOs.Desafio;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Desafio;
using Joki.LogicaNegocio.Excepciones;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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

        public DesafioController(
            ICrearDesafio crearDesafio,
            IObtenerDesafios obtenerDesafios,
            IActualizarDesafio actualizarDesafio,
            IEliminarDesafio eliminarDesafio,
            IAsignarGanadoresDesafio asignarGanadoresDesafio,
            IObtenerGanadoresDesafio obtenerGanadoresDesafio)
        {
            _crearDesafio = crearDesafio;
            _obtenerDesafios = obtenerDesafios;
            _actualizarDesafio = actualizarDesafio;
            _eliminarDesafio = eliminarDesafio;
            _asignarGanadoresDesafio = asignarGanadoresDesafio;
            _obtenerGanadoresDesafio = obtenerGanadoresDesafio;
        }


        [Authorize(Roles = "Admin")]
        [HttpPost]
        public IActionResult Crear(
            CrearDesafioRequest request)
        {
            try
            {
                _crearDesafio.Ejecutar(request);

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
                _actualizarDesafio.Ejecutar(id, request);

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
                _eliminarDesafio.Ejecutar(id);

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
                _asignarGanadoresDesafio.Ejecutar(request);

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
    }
}