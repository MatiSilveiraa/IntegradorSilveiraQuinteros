using Joki.CasoUsoCompartida.InterfacesCasosUso.Pago;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Pago
{
    public class ConfirmarPagoMercadoPago :
        IConfirmarPagoMercadoPago
    {
        private readonly IRepositorioPago _repositorioPago;
        private readonly IRepositorioCuota _repositorioCuota;

        public ConfirmarPagoMercadoPago(
            IRepositorioPago repositorioPago,
            IRepositorioCuota repositorioCuota)
        {
            _repositorioPago = repositorioPago;
            _repositorioCuota = repositorioCuota;
        }

        public void Ejecutar(string referenciaExterna)
        {
            var pago =
                _repositorioPago
                    .ObtenerPorReferenciaExterna(
                        referenciaExterna);

            if (pago == null)
            {
                throw new LogicaNegocioException(
                    "Pago no encontrado");
            }

            pago.Estado = EstadoPago.APROBADO;

            _repositorioPago.Modificar(pago);

            var cuota =
                _repositorioCuota.ObtenerPorId(
                    pago.CuotaId);

            if (cuota != null)
            {
                cuota.Estado = EstadoCuota.PAGADA;

                _repositorioCuota.Modificar(cuota);
            }
        }
    }
}