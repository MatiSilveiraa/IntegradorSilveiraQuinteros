using Joki.CasoUsoCompartida.DTOs.Alumno;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Alumno;
using Joki.Infraestructura.AccesoDatos.Excepciones;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.Excepciones.Usuario;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Joki.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class AlumnoController : ControllerBase
    {
        private readonly IRegistrarAlumno _registrarAlumno;
        private readonly IObtenerAlumnos _obtenerAlumnos;
        private readonly IObtenerAlumnoPorId _obtenerAlumnoPorId;
        private readonly IBajaAlumno _bajaAlumno;

        public AlumnoController(IRegistrarAlumno registrarAlumno, IObtenerAlumnos obtenerAlumnos, IObtenerAlumnoPorId obtenerAlumnoPorId, IBajaAlumno bajaAlumno)
        {
            _registrarAlumno = registrarAlumno;
            _obtenerAlumnos = obtenerAlumnos;
            _obtenerAlumnoPorId = obtenerAlumnoPorId;
            _bajaAlumno = bajaAlumno;
        }

        [HttpPost("registrar")]
        public IActionResult Registrar([FromBody] RegistrarAlumnoRequest request)
        {
            try
            {
                RegistrarAlumnoResponse response = _registrarAlumno.Ejecutar(request);
                return StatusCode(201, response);
            }
            catch (InfraestructuraException e)
            {
                return StatusCode(e.StatusCode(), e.Error());
            }
            catch (UsuarioRepetidoException e)
            {
                return StatusCode(409, new { mensaje = e.Message });
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

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public IActionResult Get()
        {
            var alumnos = _obtenerAlumnos.Ejecutar();
            return Ok(alumnos);
        }

        [HttpGet("{id}")]
        public IActionResult ObtenerPorId(int id)
        {
            try
            {
                var alumno = _obtenerAlumnoPorId.Ejecutar(id);
                return Ok(alumno);
            }
            catch (Exception)
            {
                return NotFound(new
                {
                    mensaje = "Alumno no encontrado"
                });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public IActionResult Baja(int id)
        {
            try
            {
                _bajaAlumno.Ejecutar(id);
                return Ok(new { mensaje = "Alumno dado de baja correctamente" });
            }
            catch (Exception e)
            {
                return NotFound(new { mensaje = e.Message });
            }
        }
    }
}
