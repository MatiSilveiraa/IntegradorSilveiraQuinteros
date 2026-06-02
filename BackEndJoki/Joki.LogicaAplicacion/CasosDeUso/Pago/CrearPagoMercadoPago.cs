using Joki.CasoUsoCompartida.Configuracion;
using Joki.CasoUsoCompartida.DTOs.Pago;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Pago;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Microsoft.Extensions.Options;
using Entidades = Joki.LogicaNegocio.Entidades;
using MercadoPago.Config;
using MercadoPago.Client.Preference;


namespace Joki.LogicaAplicacion.CasosDeUso.Pago
{
    public class CrearPagoMercadoPago : ICrearPagoMercadoPago
    {
        private readonly IRepositorioCuota _repositorioCuota;
        private readonly IRepositorioPago _repositorioPago;
        private readonly MercadoPagoSettings _mercadoPagoSettings;

        public CrearPagoMercadoPago(
            IRepositorioCuota repositorioCuota,
            IRepositorioPago repositorioPago,
            IOptions<MercadoPagoSettings> mercadoPagoSettings)
        {
            _repositorioCuota = repositorioCuota;
            _repositorioPago = repositorioPago;
            _mercadoPagoSettings = mercadoPagoSettings.Value;
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

            MercadoPagoConfig.AccessToken =
                _mercadoPagoSettings.AccessToken;

            var preferenceRequest =
                new PreferenceRequest
                {
                    Items = new List<PreferenceItemRequest>
                    {
                        new PreferenceItemRequest
                        {
                            Title = $"Cuota Joki Training {cuota.Mes}/{cuota.Anio}",
                            Quantity = 1,
                            CurrencyId = "UYU",
                            UnitPrice = cuota.MontoFinal
                        }
                    },

                    ExternalReference = referencia,

                    BackUrls = new PreferenceBackUrlsRequest
                    {
                        Success = _mercadoPagoSettings.SuccessUrl,
                        Failure = _mercadoPagoSettings.FailureUrl,
                        Pending = _mercadoPagoSettings.PendingUrl
                    },

                    AutoReturn = "approved",

                    NotificationUrl = _mercadoPagoSettings.WebhookUrl
                };

            var client = new PreferenceClient();

            var preference =
                client.Create(preferenceRequest);

            return new CrearPagoMercadoPagoResponse
            {
                UrlPago = preference.InitPoint,
                ReferenciaExterna = referencia
            };
        }
    }
}