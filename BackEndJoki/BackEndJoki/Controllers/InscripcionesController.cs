using Joki.CasoUsoCompartida.InterfacesCasosUso.Alumno;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Grupo;
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

        public InscripcionesController(IInscribirAlumno inscribirAlumno)
        {
            _inscribirAlumno = inscribirAlumno;
        }

        [Authorize(Roles = "Alumno")]
        [HttpPost("{grupoId}")]
        public IActionResult Inscribirse(int grupoId)
        {
            try
            {
                var alumnoId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

                _inscribirAlumno.Ejecutar(alumnoId, grupoId);

                return Ok(new
                {
                    mensaje = "Inscripción procesada correctamente"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    mensaje = ex.Message
                });
            }
        }
    }
}