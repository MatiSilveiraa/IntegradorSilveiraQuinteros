using Joki.CasoUsoCompartida.InterfacesCasosUso.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Joki.WebApi.Controllers
{
    [Route("api/admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IObtenerAdminDashboard _obtenerAdminDashboard;
        private readonly IObtenerEntrenadoresSelector _obtenerEntrenadoresSelector;

        public AdminController(
            IObtenerAdminDashboard obtenerAdminDashboard,
            IObtenerEntrenadoresSelector obtenerEntrenadoresSelector)
        {
            _obtenerAdminDashboard = obtenerAdminDashboard;
            _obtenerEntrenadoresSelector = obtenerEntrenadoresSelector;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("dashboard")]
        public IActionResult ObtenerDashboard()
        {
            try
            {
                var dashboard =
                    _obtenerAdminDashboard.Ejecutar();

                return Ok(dashboard);
            }
            catch (Exception)
            {
                return StatusCode(500, new
                {
                    mensaje = "Hubo un problema. Prueba nuevamente"
                });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("entrenadores")]
        public IActionResult ObtenerEntrenadores()
        {
            try
            {
                var entrenadores =
                    _obtenerEntrenadoresSelector.Ejecutar();

                return Ok(entrenadores);
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