using Microsoft.AspNetCore.Mvc;
using Joki.LogicaNegocio.Enums;
using Joki.DTOs;

namespace Joki.WebApi.Controllers
{
    [ApiController]
    [Route("api/enums")]
    public class EnumsController : ControllerBase
    {
        [HttpGet("generos")]
        public IActionResult ObtenerGeneros()
        {
            var generos =
                Enum.GetValues(typeof(Genero))
                .Cast<Genero>()
                .Select(g => new EnumDto
                {
                    Id = (int)g,
                    Nombre = g.ToString()
                });

            return Ok(generos);
        }
    }
}