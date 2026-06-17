using Joki.CasoUsoCompartida.InterfacesCasosUso.Cuota;
using Joki.LogicaAplicacion.CasosDeUso.Pago;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Moq;

using Entidades = Joki.LogicaNegocio.Entidades;

namespace Joki.Pruebas.CasosDeUso.Pago
{
    public class ConfirmarPagoMercadoPagoTests
    {
        [Fact]
        public void Ejecutar_DeberiaConfirmarPagoYMarcarCuotaComoPagada()
        {
            var repoPagoMock = new Mock<IRepositorioPago>();
            var repoCuotaMock = new Mock<IRepositorioCuota>();
            var actualizarBloqueoMock =
                new Mock<IActualizarBloqueoDeudaAlumno>();

            var pago = new Entidades.Pago
            {
                Id = 1,
                CuotaId = 2,
                ReferenciaExterna = "abc123",
                Estado = EstadoPago.PENDIENTE
            };

            var cuota = new Entidades.Cuota
            {
                Id = 2,
                AlumnoId = 7,
                Estado = EstadoCuota.VENCIDA
            };

            repoPagoMock
                .Setup(r => r.ObtenerPorReferenciaExterna("abc123"))
                .Returns(pago);

            repoCuotaMock
                .Setup(r => r.ObtenerPorId(2))
                .Returns(cuota);

            var casoUso =
                new ConfirmarPagoMercadoPago(
                    repoPagoMock.Object,
                    repoCuotaMock.Object,
                    actualizarBloqueoMock.Object);

            casoUso.Ejecutar("abc123");

            Assert.Equal(EstadoPago.APROBADO, pago.Estado);
            Assert.Equal(EstadoCuota.PAGADA, cuota.Estado);

            repoPagoMock.Verify(
                r => r.Modificar(pago),
                Times.Once);

            repoCuotaMock.Verify(
                r => r.Modificar(cuota),
                Times.Once);

            actualizarBloqueoMock.Verify(
                r => r.Ejecutar(7),
                Times.Once);
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarExcepcion_CuandoPagoNoExiste()
        {
            var repoPagoMock = new Mock<IRepositorioPago>();
            var repoCuotaMock = new Mock<IRepositorioCuota>();
            var actualizarBloqueoMock =
                new Mock<IActualizarBloqueoDeudaAlumno>();

            repoPagoMock
                .Setup(r => r.ObtenerPorReferenciaExterna("inexistente"))
                .Returns((Entidades.Pago)null);

            var casoUso =
                new ConfirmarPagoMercadoPago(
                    repoPagoMock.Object,
                    repoCuotaMock.Object,
                    actualizarBloqueoMock.Object);

            var ex = Assert.Throws<LogicaNegocioException>(() =>
                casoUso.Ejecutar("inexistente"));

            Assert.Equal("Pago no encontrado", ex.Message);

            repoPagoMock.Verify(
                r => r.Modificar(It.IsAny<Entidades.Pago>()),
                Times.Never);

            repoCuotaMock.Verify(
                r => r.Modificar(It.IsAny<Entidades.Cuota>()),
                Times.Never);

            actualizarBloqueoMock.Verify(
                r => r.Ejecutar(It.IsAny<int>()),
                Times.Never);
        }

        [Fact]
        public void Ejecutar_DeberiaConfirmarPagoAunqueCuotaNoExista()
        {
            var repoPagoMock = new Mock<IRepositorioPago>();
            var repoCuotaMock = new Mock<IRepositorioCuota>();
            var actualizarBloqueoMock =
                new Mock<IActualizarBloqueoDeudaAlumno>();

            var pago = new Entidades.Pago
            {
                Id = 1,
                CuotaId = 99,
                ReferenciaExterna = "abc123",
                Estado = EstadoPago.PENDIENTE
            };

            repoPagoMock
                .Setup(r => r.ObtenerPorReferenciaExterna("abc123"))
                .Returns(pago);

            repoCuotaMock
                .Setup(r => r.ObtenerPorId(99))
                .Returns((Entidades.Cuota)null);

            var casoUso =
                new ConfirmarPagoMercadoPago(
                    repoPagoMock.Object,
                    repoCuotaMock.Object,
                    actualizarBloqueoMock.Object);

            casoUso.Ejecutar("abc123");

            Assert.Equal(EstadoPago.APROBADO, pago.Estado);

            repoPagoMock.Verify(
                r => r.Modificar(pago),
                Times.Once);

            repoCuotaMock.Verify(
                r => r.Modificar(It.IsAny<Entidades.Cuota>()),
                Times.Never);

            actualizarBloqueoMock.Verify(
                r => r.Ejecutar(It.IsAny<int>()),
                Times.Never);
        }
    }
}