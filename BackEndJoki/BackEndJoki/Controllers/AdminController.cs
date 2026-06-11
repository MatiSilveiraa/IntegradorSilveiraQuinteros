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

        public AdminController(
            IObtenerAdminDashboard obtenerAdminDashboard)
        {
            _obtenerAdminDashboard = obtenerAdminDashboard;
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
    }
}