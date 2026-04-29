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
            var grupos = _obtenerGrupos.Ejecutar();
            return Ok(grupos);
        }

        [HttpGet("{id}")]
        public IActionResult ObtenerPorId(int id)
        {
            try
            {
                var grupo = _obtenerGrupoPorId.Ejecutar(id);
                return Ok(grupo);
            }
            catch (Exception)
            {
                return NotFound(new
                {
                    mensaje = "Grupo no encontrado"
                });
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
            catch (Exception e)
            {
                return NotFound(new { mensaje = e.Message });
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
            catch (Exception e)
            {
                return NotFound(new { mensaje = e.Message });
            }
        }
    }
}
