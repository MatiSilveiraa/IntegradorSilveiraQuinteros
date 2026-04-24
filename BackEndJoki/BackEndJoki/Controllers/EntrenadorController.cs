using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Joki.WebApi.Controllers
{
        [Route("api/[controller]")]
        [ApiController]
        [Authorize(Roles = "Entrenador")]
    public class EntrenadorController : ControllerBase
    {
        [HttpGet]
        public IActionResult Index()
        {
            return Ok("Acceso permitido a entrenador");
        }
    }
}
