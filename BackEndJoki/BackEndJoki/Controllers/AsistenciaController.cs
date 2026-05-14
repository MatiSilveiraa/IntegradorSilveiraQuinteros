using Joki.CasoUsoCompartida.DTOs.Asistencia;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Asistencia;
using Joki.LogicaNegocio.Excepciones;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Joki.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AsistenciaController : ControllerBase
    {
        private readonly IRegistrarAsistencia _registrarAsistencia;

        public AsistenciaController(
            IRegistrarAsistencia registrarAsistencia)
        {
            _registrarAsistencia = registrarAsistencia;
        }

        [Authorize(Roles = "Entrenador,Admin")]
        [HttpPost]
        public IActionResult Registrar(
            RegistrarAsistenciaRequest request)
        {
            try
            {
                int usuarioId = int.Parse(
                    User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

                _registrarAsistencia.Ejecutar(
                    request,
                    usuarioId);

                return Ok(new
                {
                    mensaje = "Asistencia registrada correctamente"
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
