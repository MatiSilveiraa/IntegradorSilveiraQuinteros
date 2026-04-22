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

        public AlumnoController(IRegistrarAlumno registrarAlumno)
        {
            _registrarAlumno = registrarAlumno;
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
            catch (Exception)
            {
                Error error = new Error(500, "Hubo un problema. Prueba nuevamente");
                return StatusCode(500, error);
            }
        }
    }
}
