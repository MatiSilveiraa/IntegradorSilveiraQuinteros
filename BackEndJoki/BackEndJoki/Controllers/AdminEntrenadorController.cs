using Microsoft.AspNetCore.Mvc;

namespace Joki.WebApi.Controllers
{
    public class AdminEntrenadorController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
