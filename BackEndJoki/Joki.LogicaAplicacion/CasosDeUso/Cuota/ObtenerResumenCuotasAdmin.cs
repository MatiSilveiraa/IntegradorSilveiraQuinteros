using Joki.CasoUsoCompartida.DTOs.Cuota;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Cuota;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Cuota
{
    public class ObtenerResumenCuotasAdmin :
        IObtenerResumenCuotasAdmin
    {
        private readonly IRepositorioCuota _repositorioCuota;

        public ObtenerResumenCuotasAdmin(
            IRepositorioCuota repositorioCuota)
        {
            _repositorioCuota = repositorioCuota;
        }

        public ResumenCuotasAdminResponse Ejecutar(
            int? mes,
            int? anio)
        {
            var cuotas =
                _repositorioCuota.ObtenerTodasConAlumnoYPagos()
                    .ToList();

            if (mes.HasValue)
            {
                cuotas = cuotas
                    .Where(c => c.Mes == mes.Value)
                    .ToList();
            }

            if (anio.HasValue)
            {
                cuotas = cuotas
                    .Where(c => c.Anio == anio.Value)
                    .ToList();
            }

            return new ResumenCuotasAdminResponse
            {
                TotalCuotas = cuotas.Count,

                Pendientes = cuotas.Count(c =>
                    c.Estado == EstadoCuota.PENDIENTE),

                Pagadas = cuotas.Count(c =>
                    c.Estado == EstadoCuota.PAGADA),

                Vencidas = cuotas.Count(c =>
                    c.Estado == EstadoCuota.VENCIDA ||
                    (c.Estado != EstadoCuota.PAGADA &&
                     c.FechaVencimiento.Date < DateTime.Now.Date)),

                Recaudado = cuotas
                    .Where(c => c.Estado == EstadoCuota.PAGADA)
                    .Sum(c => c.MontoFinal),

                MontoPendiente = cuotas
                    .Where(c => c.Estado != EstadoCuota.PAGADA)
                    .Sum(c => c.MontoFinal)
            };
        }
    }
}