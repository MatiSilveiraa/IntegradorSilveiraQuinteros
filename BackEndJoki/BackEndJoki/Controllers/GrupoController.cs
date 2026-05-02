using Joki.CasoUsoCompartida.DTOs.Grupo;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Grupo;
using Joki.Infraestructura.AccesoDatos.Excepciones;
using Joki.LogicaNegocio.Excepciones;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
        public IActionResult Crear([FromBody] CrearGrupoRequest request)
        {
            try
            {
                var response = _crearGrupo.Ejecutar(request);
                return StatusCode(201, response);
            }
            catch (InfraestructuraException e)
            {
                return StatusCode(e.StatusCode(), e.Error());
            }
            catch (LogicaNegocioException e)
            {
                return StatusCode(400, e.Error());
            }
            catch (Exception)
            {
                Error error = new Error(500, "Hubo un problema. Prueba nuevamente");
                return StatusCode(500, error);
            }
        }

        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                var grupos = _obtenerGrupos.Ejecutar();
                return Ok(grupos);
            }
            catch (Exception)
            {
                Error error = new Error(500, "Hubo un problema. Prueba nuevamente");
                return StatusCode(500, error);
            }
        }

        [HttpGet("{id}")]
        public IActionResult ObtenerPorId(int id)
        {
            try
            {
                var grupo = _obtenerGrupoPorId.Ejecutar(id);
                return Ok(grupo);
            }
            catch (LogicaNegocioException e)
            {
                return NotFound(new { mensaje = e.Message });
            }
            catch (Exception e)
            {
                return StatusCode(500, new { mensaje = e.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public IActionResult Editar(int id, [FromBody] EditarGrupoRequest request)
        {
            try
            {
                var grupo = _editarGrupo.Ejecutar(id, request);
                return Ok(grupo);
            }
            catch (LogicaNegocioException e)
            {
                if (e.Message == "El grupo solicitado no existe.")
                {
                    return NotFound(new { mensaje = e.Message });
                }

                return StatusCode(400, new { mensaje = e.Message });
            }
            catch (Exception)
            {
                Error error = new Error(500, "Hubo un problema. Prueba nuevamente");
                return StatusCode(500, error);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public IActionResult Eliminar(int id)
        {
            try
            {
                _eliminarGrupo.Ejecutar(id);
                return Ok(new { mensaje = "Grupo eliminado correctamente" });
            }
            catch (LogicaNegocioException e)
            {
                return NotFound(new { mensaje = e.Message });
            }
            catch (Exception)
            {
                Error error = new Error(500, "Hubo un problema. Prueba nuevamente");
                return StatusCode(500, error);
            }
        }
    }
}
