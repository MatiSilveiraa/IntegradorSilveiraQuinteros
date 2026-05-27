using Joki.CasoUsoCompartida.DTOs.Pago;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Pago;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Pago
{
    public class ObtenerPagosPorCuota : IObtenerPagosPorCuota
    {
        private readonly IRepositorioPago _repositorioPago;

        public ObtenerPagosPorCuota(
            IRepositorioPago repositorioPago)
        {
            _repositorioPago = repositorioPago;
        }

        public IEnumerable<PagoResponse> Ejecutar(int cuotaId)
        {
            var pagos =
                _repositorioPago.ObtenerPorCuota(cuotaId);

            return pagos.Select(p => new PagoResponse
            {
                Id = p.Id,
                CuotaId = p.CuotaId,
                MedioPago = p.MedioPago.ToString(),
                FechaPago = p.FechaPago,
                Monto = p.Monto,
                ReferenciaExterna = p.ReferenciaExterna
            });
        }
    }
}