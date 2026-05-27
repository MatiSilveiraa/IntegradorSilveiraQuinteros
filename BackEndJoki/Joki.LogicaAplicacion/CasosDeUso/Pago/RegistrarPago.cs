using Joki.CasoUsoCompartida.DTOs.Pago;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Pago;
using Entidades = Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Pago
{
    public class RegistrarPago : IRegistrarPago
    {
        private readonly IRepositorioPago _repositorioPago;
        private readonly IRepositorioCuota _repositorioCuota;

        public RegistrarPago(
            IRepositorioPago repositorioPago,
            IRepositorioCuota repositorioCuota)
        {
            _repositorioPago = repositorioPago;
            _repositorioCuota = repositorioCuota;
        }

        public void Ejecutar(RegistrarPagoRequest request)
        {
            var cuota =
                _repositorioCuota.ObtenerPorId(request.CuotaId);

            if (cuota == null)
            {
                throw new LogicaNegocioException(
                    "Cuota no encontrada");
            }

            if (cuota.Estado == EstadoCuota.PAGADA)
            {
                throw new LogicaNegocioException(
                    "La cuota ya se encuentra pagada");
            }

            Entidades.Pago pago = new Entidades.Pago
            {
                CuotaId = cuota.Id,
                MedioPago = request.MedioPago,
                FechaPago = DateTime.UtcNow,
                Monto = cuota.MontoFinal,
                ReferenciaExterna = request.ReferenciaExterna
            };

            _repositorioPago.Agregar(pago);

            cuota.Estado = EstadoCuota.PAGADA;

            _repositorioCuota.Modificar(cuota);
        }
    }
}