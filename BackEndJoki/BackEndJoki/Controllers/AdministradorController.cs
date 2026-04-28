using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Joki.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdministradorController : ControllerBase
    {
        [HttpGet]
        public IActionResult Index()
        {
            return Ok("Sos admin");
        }
    }
}
