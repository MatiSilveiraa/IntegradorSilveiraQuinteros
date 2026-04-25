using Joki.CasoUsoCompartida.DTOs.Alumno;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Alumno;
using Joki.Infraestructura.AccesoDatos.Excepciones;
using Joki.LogicaNegocio.Excepciones;
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

        public AlumnoController(IRegistrarAlumno registrarAlumno, IObtenerAlumnos obtenerAlumnos, IObtenerAlumnoPorId obtenerAlumnoPorId)
        {
            _registrarAlumno = registrarAlumno;
            _obtenerAlumnos = obtenerAlumnos;
            _obtenerAlumnoPorId = obtenerAlumnoPorId;
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
            catch (LogicaNegocioException e)
            {
                return StatusCode(400, e.Error());
            }
            catch (Exception e) 
            {
                string mensajeReal = e.InnerException != null ? e.InnerException.Message : e.Message;
                
                Error error = new Error(500, $"Error real: {mensajeReal}");
                return StatusCode(500, error);
            }
        }

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
    }
}
