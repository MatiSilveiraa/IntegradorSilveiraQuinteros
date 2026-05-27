using Joki.CasoUsoCompartida.DTOs.Pago;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Pago;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

using Entidades = Joki.LogicaNegocio.Entidades;

namespace Joki.LogicaAplicacion.CasosDeUso.Pago
{
    public class CrearPagoMercadoPago : ICrearPagoMercadoPago
    {
        private readonly IRepositorioCuota _repositorioCuota;
        private readonly IRepositorioPago _repositorioPago;

        public CrearPagoMercadoPago(
            IRepositorioCuota repositorioCuota,
            IRepositorioPago repositorioPago)
        {
            _repositorioCuota = repositorioCuota;
            _repositorioPago = repositorioPago;
        }

        public CrearPagoMercadoPagoResponse Ejecutar(int cuotaId)
        {
            var cuota =
                _repositorioCuota.ObtenerPorId(cuotaId);

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

            string referencia =
                Guid.NewGuid().ToString();

            Entidades.Pago pago =
                new Entidades.Pago
                {
                    CuotaId = cuota.Id,

                    MedioPago = MedioPago.MERCADOPAGO,

                    FechaPago = DateTime.UtcNow,

                    Monto = cuota.MontoFinal,

                    Estado = EstadoPago.PENDIENTE,

                    ReferenciaExterna = referencia
                };

            _repositorioPago.Agregar(pago);

            return new CrearPagoMercadoPagoResponse
            {
                UrlPago =
                    $"https://fake.mercadopago.com/pay/{referencia}",

                ReferenciaExterna = referencia
            };
        }
    }
}