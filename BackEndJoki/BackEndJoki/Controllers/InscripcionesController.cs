using Joki.CasoUsoCompartida.InterfacesCasosUso.Grupo;
using Joki.LogicaNegocio.Excepciones;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Joki.WebApi.Controllers
{
    [ApiController]
    [Route("api/inscripciones")]
    public class InscripcionesController : ControllerBase
    {
        private readonly IInscribirAlumno _inscribirAlumno;
        private readonly IDesinscribirAlumno _desinscribirAlumno;

        public InscripcionesController(IInscribirAlumno inscribirAlumno, IDesinscribirAlumno desinscribirAlumno)
        {
            _inscribirAlumno = inscribirAlumno;
            _desinscribirAlumno = desinscribirAlumno;
        }

        [Authorize(Roles = "Alumno")]
        [HttpPost("{grupoId}")]
        public IActionResult Inscribirse(int grupoId)
        {
            try
            {
                var alumnoId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

                var resultado = _inscribirAlumno.Ejecutar(alumnoId, grupoId);

                if (resultado == "LISTA_ESPERA")
                {
                    return Ok(new
                    {
                        mensaje = "Grupo lleno. Alumno agregado a lista de espera"
                    });
                }

                return Ok(new
                {
                    mensaje = "Inscripción procesada correctamente"
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

        [Authorize(Roles = "Alumno")]
        [HttpDelete("{grupoId}")]
        public IActionResult Desinscribirse(int grupoId)
        {
            try
            {
                var alumnoId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

                _desinscribirAlumno.Ejecutar(alumnoId, grupoId);

                return Ok(new
                {
                    mensaje = "Desinscripción procesada correctamente"
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
    }
}