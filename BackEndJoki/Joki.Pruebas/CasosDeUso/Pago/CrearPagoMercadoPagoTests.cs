using Joki.CasoUsoCompartida.Configuracion;
using Joki.LogicaAplicacion.CasosDeUso.Pago;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Microsoft.Extensions.Options;
using Moq;

using Entidades = Joki.LogicaNegocio.Entidades;

namespace Joki.Pruebas.CasosDeUso.Pago
{
    public class CrearPagoMercadoPagoTests
    {
        private MercadoPagoSettings CrearSettings()
        {
            return new MercadoPagoSettings
            {
                AccessToken = "TEST-123",
                SuccessUrl = "https://test.com/success",
                FailureUrl = "https://test.com/failure",
                PendingUrl = "https://test.com/pending",
                WebhookUrl = "https://test.com/webhook"
            };
        }

        [Fact]
        public void Ejecutar_DeberiaCrearPagoPendienteYRetornarUrl()
        {
            var repoCuotaMock = new Mock<IRepositorioCuota>();
            var repoPagoMock = new Mock<IRepositorioPago>();

            var cuota = new Entidades.Cuota
            {
                Id = 1,
                MontoFinal = 1251m,
                Estado = EstadoCuota.PENDIENTE
            };

            repoCuotaMock
                .Setup(r => r.ObtenerPorId(1))
                .Returns(cuota);

            var casoUso =
                new CrearPagoMercadoPago(
                    repoCuotaMock.Object,
                    repoPagoMock.Object,
                    Options.Create(CrearSettings()));

            var resultado =
                casoUso.Ejecutar(1);

            Assert.False(string.IsNullOrWhiteSpace(resultado.UrlPago));
            Assert.False(string.IsNullOrWhiteSpace(resultado.ReferenciaExterna));

            repoPagoMock.Verify(r => r.Agregar(
                It.Is<Entidades.Pago>(p =>
                    p.CuotaId == 1 &&
                    p.Monto == 1251m &&
                    p.MedioPago == MedioPago.MERCADOPAGO &&
                    p.Estado == EstadoPago.PENDIENTE &&
                    p.ReferenciaExterna == resultado.ReferenciaExterna
                )), Times.Once);
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarExcepcion_CuandoCuotaNoExiste()
        {
            var repoCuotaMock = new Mock<IRepositorioCuota>();
            var repoPagoMock = new Mock<IRepositorioPago>();

            repoCuotaMock
                .Setup(r => r.ObtenerPorId(99))
                .Returns((Entidades.Cuota)null);

            var casoUso =
                new CrearPagoMercadoPago(
                    repoCuotaMock.Object,
                    repoPagoMock.Object,
                    Options.Create(CrearSettings()));

            var ex = Assert.Throws<LogicaNegocioException>(() =>
                casoUso.Ejecutar(99));

            Assert.Equal("Cuota no encontrada", ex.Message);

            repoPagoMock.Verify(
                r => r.Agregar(It.IsAny<Entidades.Pago>()),
                Times.Never);
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarExcepcion_CuandoCuotaYaEstaPagada()
        {
            var repoCuotaMock = new Mock<IRepositorioCuota>();
            var repoPagoMock = new Mock<IRepositorioPago>();

            var cuota = new Entidades.Cuota
            {
                Id = 1,
                Estado = EstadoCuota.PAGADA
            };

            repoCuotaMock
                .Setup(r => r.ObtenerPorId(1))
                .Returns(cuota);

            var casoUso =
                new CrearPagoMercadoPago(
                    repoCuotaMock.Object,
                    repoPagoMock.Object,
                    Options.Create(CrearSettings()));

            var ex = Assert.Throws<LogicaNegocioException>(() =>
                casoUso.Ejecutar(1));

            Assert.Equal("La cuota ya se encuentra pagada", ex.Message);

            repoPagoMock.Verify(
                r => r.Agregar(It.IsAny<Entidades.Pago>()),
                Times.Never);
        }
    }
}