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

        public InscripcionesController(
            IInscribirAlumno inscribirAlumno,
            IDesinscribirAlumno desinscribirAlumno)
        {
            _inscribirAlumno = inscribirAlumno;

            _desinscribirAlumno = desinscribirAlumno;
        }

        [Authorize(Roles = "Alumno")]
        [HttpPost("{claseId}")]
        public IActionResult Inscribirse(int claseId)
        {
            try
            {
                var alumnoId = int.Parse(
                    User.FindFirst(
                        ClaimTypes.NameIdentifier)!.Value);

                var resultado =
                    _inscribirAlumno.Ejecutar(
                        alumnoId,
                        claseId);

                if (resultado == "LISTA_ESPERA")
                {
                    return Ok(new
                    {
                        mensaje =
                            "Clase llena. Alumno agregado a lista de espera"
                    });
                }

                return Ok(new
                {
                    mensaje =
                        "Inscripción realizada correctamente"
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
                        "Hubo un problema. Prueba nuevamente"
                });
            }
        }

        [Authorize(Roles = "Alumno")]
        [HttpDelete("{claseId}")]
        public IActionResult Desinscribirse(int claseId)
        {
            try
            {
                var alumnoId = int.Parse(
                    User.FindFirst(
                        ClaimTypes.NameIdentifier)!.Value);

                _desinscribirAlumno.Ejecutar(
                    alumnoId,
                    claseId);

                return Ok(new
                {
                    mensaje =
                        "Desinscripción realizada correctamente"
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
                        "Hubo un problema. Prueba nuevamente"
                });
            }
        }
    }
}