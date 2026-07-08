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
        private readonly IObtenerCuotasAdmin _obtenerCuotasAdmin;
        private readonly IObtenerResumenCuotasAdmin _obtenerResumenCuotasAdmin;
        private readonly IObtenerDetalleCuotaAdmin _obtenerDetalleCuotaAdmin;

        public CuotaController(
            IObtenerCuotaActualAlumno obtenerCuotaActualAlumno,
            IObtenerMisCuotas obtenerMisCuotas,
            IActualizarCuotasVencidas actualizarCuotasVencidas,
            IGenerarCuotasMensuales generarCuotasMensuales,
            IMarcarCuotaComoPagada marcarCuotaComoPagada,
            IBloquearAlumnosPorDeuda bloquearAlumnosPorDeuda,
            IObtenerCuotasAdmin obtenerCuotasAdmin,
            IObtenerResumenCuotasAdmin obtenerResumenCuotasAdmin,
            IObtenerDetalleCuotaAdmin obtenerDetalleCuotaAdmin)
        {
            _obtenerCuotaActualAlumno = obtenerCuotaActualAlumno;
            _obtenerMisCuotas = obtenerMisCuotas;
            _actualizarCuotasVencidas = actualizarCuotasVencidas;
            _generarCuotasMensuales = generarCuotasMensuales;
            _marcarCuotaComoPagada = marcarCuotaComoPagada;
            _bloquearAlumnosPorDeuda = bloquearAlumnosPorDeuda;
            _obtenerCuotasAdmin = obtenerCuotasAdmin;
            _obtenerResumenCuotasAdmin = obtenerResumenCuotasAdmin;
            _obtenerDetalleCuotaAdmin = obtenerDetalleCuotaAdmin;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("admin")]
        public IActionResult ObtenerCuotasAdmin(
    [FromQuery] string? estado,
    [FromQuery] int? alumnoId,
    [FromQuery] int? mes,
    [FromQuery] int? anio,
    [FromQuery] string? buscar)
        {
            try
            {
                var cuotas =
                    _obtenerCuotasAdmin.Ejecutar(
                        estado,
                        alumnoId,
                        mes,
                        anio,
                        buscar);

                return Ok(cuotas);
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
        [HttpGet("admin/resumen")]
        public IActionResult ObtenerResumenCuotasAdmin(
            [FromQuery] int? mes,
            [FromQuery] int? anio)
        {
            try
            {
                var resumen =
                    _obtenerResumenCuotasAdmin.Ejecutar(
                        mes,
                        anio);

                return Ok(resumen);
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
        [HttpGet("admin/{cuotaId}")]
        public IActionResult ObtenerDetalleCuotaAdmin(int cuotaId)
        {
            try
            {
                var detalle =
                    _obtenerDetalleCuotaAdmin.Ejecutar(cuotaId);

                return Ok(detalle);
            }
            catch (LogicaNegocioException e)
            {
                return NotFound(new
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
