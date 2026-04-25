using Joki.CasoUsoCompartida.DTOs.Alumno;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Alumno;
using Joki.Infraestructura.AccesoDatos.Excepciones;
using Joki.LogicaAplicacion.CasosDeUso.Alumno;
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

        public AlumnoController(IRegistrarAlumno registrarAlumno, IObtenerAlumnos obtenerAlumnos)
        {
            _registrarAlumno = registrarAlumno;
            _obtenerAlumnos = obtenerAlumnos;
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
            catch (Exception e) // <-- Agrega la "e"
            {
                // Cambiamos temporalmente el mensaje para ver qué dice el servidor. 
                // e.InnerException?.Message te dirá exactamente qué columna falló en SQL Server.
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
    }
}
