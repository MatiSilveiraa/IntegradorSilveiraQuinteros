using Joki.CasoUsoCompartida.InterfacesCasosUso.Cuota;
using Joki.LogicaNegocio.Excepciones;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Joki.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CuotaController : ControllerBase
    {
        private readonly IObtenerCuotaActualAlumno _obtenerCuotaActualAlumno;
        private readonly IObtenerMisCuotas _obtenerMisCuotas;
        private readonly IActualizarCuotasVencidas _actualizarCuotasVencidas;
        private readonly IGenerarCuotasMensuales _generarCuotasMensuales;
        private readonly IMarcarCuotaComoPagada _marcarCuotaComoPagada;
        private readonly IBloquearAlumnosPorDeuda _bloquearAlumnosPorDeuda;
        public CuotaController(
            IObtenerCuotaActualAlumno obtenerCuotaActualAlumno,
            IObtenerMisCuotas obtenerMisCuotas,
            IActualizarCuotasVencidas actualizarCuotasVencidas,
            IGenerarCuotasMensuales generarCuotasMensuales,
            IMarcarCuotaComoPagada marcarCuotaComoPagada,
            IBloquearAlumnosPorDeuda bloquearAlumnosPorDeuda)
        {
            _obtenerCuotaActualAlumno = obtenerCuotaActualAlumno;
            _obtenerMisCuotas = obtenerMisCuotas;
            _actualizarCuotasVencidas = actualizarCuotasVencidas;
            _generarCuotasMensuales = generarCuotasMensuales;
            _marcarCuotaComoPagada = marcarCuotaComoPagada;
            _bloquearAlumnosPorDeuda = bloquearAlumnosPorDeuda;
        }

        [Authorize(Roles = "Alumno")]
        [HttpGet("mi-cuota")]
        public IActionResult ObtenerMiCuota()
        {
            try
            {
                int alumnoId = int.Parse(
                    User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

                var cuota =
                    _obtenerCuotaActualAlumno.Ejecutar(alumnoId);

                return Ok(cuota);
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
        [HttpGet("mis-cuotas")]
        public IActionResult ObtenerMisCuotas()
        {
            try
            {
                int alumnoId = int.Parse(
                    User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

                var cuotas =
                    _obtenerMisCuotas.Ejecutar(alumnoId);

                return Ok(cuotas);
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

        [Authorize(Roles = "Admin")]
        [HttpPut("actualizar-vencidas")]
        public IActionResult ActualizarVencidas()
        {
            try
            {
                _actualizarCuotasVencidas.Ejecutar();

                return Ok(new
                {
                    mensaje = "Cuotas vencidas actualizadas correctamente"
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

        [Authorize(Roles = "Admin")]
        [HttpPost("generar-mensuales")]
        public IActionResult GenerarCuotasMensuales()
        {
            try
            {
                _generarCuotasMensuales.Ejecutar();

                return Ok(new
                {
                    mensaje = "Cuotas mensuales generadas correctamente"
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

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/marcar-pagada")]
        public IActionResult MarcarComoPagada(int id)
        {
            try
            {
                _marcarCuotaComoPagada.Ejecutar(id);

                return Ok(new
                {
                    mensaje = "Cuota marcada como pagada correctamente"
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
