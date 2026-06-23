using Joki.CasoUsoCompartida.DTOs.Pago;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Cuota;
using Joki.LogicaAplicacion.CasosDeUso.Pago;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Moq;

using Entidades = Joki.LogicaNegocio.Entidades;

namespace Joki.Pruebas.CasosDeUso.Pago
{
    public class RegistrarPagoTests
    {
        [Fact]
        public void Ejecutar_DeberiaRegistrarPagoYMarcarCuotaComoPagada()
        {
            var repoPagoMock = new Mock<IRepositorioPago>();
            var repoCuotaMock = new Mock<IRepositorioCuota>();
            var repoNotificacionMock = new Mock<IRepositorioNotificacion>();
            var actualizarBloqueoMock = new Mock<IActualizarBloqueoDeudaAlumno>();
            var repoAuditoriaMock = new Mock<IRepositorioAuditoria>();

            var cuota = new Entidades.Cuota
            {
                Id = 1,
                AlumnoId = 7,
                Mes = 6,
                Anio = 2026,
                MontoFinal = 1251m,
                Estado = EstadoCuota.PENDIENTE
            };

            RegistrarPagoRequest request = new RegistrarPagoRequest
            {
                CuotaId = 1,
                MedioPago = MedioPago.EFECTIVO,
                ReferenciaExterna = "Pago en efectivo"
            };

            repoCuotaMock
                .Setup(r => r.ObtenerPorId(1))
                .Returns(cuota);

            var casoUso =
                new RegistrarPago(
                    repoPagoMock.Object,
                    repoCuotaMock.Object,
                    repoNotificacionMock.Object,
                    actualizarBloqueoMock.Object,
                    repoAuditoriaMock.Object);

            casoUso.Ejecutar(request, 99);

            repoPagoMock.Verify(r => r.Agregar(
                It.Is<Entidades.Pago>(p =>
                    p.CuotaId == 1 &&
                    p.Monto == 1251m &&
                    p.MedioPago == MedioPago.EFECTIVO &&
                    p.ReferenciaExterna == "Pago en efectivo"
                )), Times.Once);

            Assert.Equal(EstadoCuota.PAGADA, cuota.Estado);

            repoCuotaMock.Verify(
                r => r.Modificar(cuota),
                Times.Once);

            actualizarBloqueoMock.Verify(
                r => r.Ejecutar(7),
                Times.Once);

            repoNotificacionMock.Verify(r => r.Agregar(
                It.Is<Entidades.Notificacion>(n =>
                    n.UsuarioId == 7 &&
                    n.Titulo == "Pago registrado" &&
                    n.Tipo == TipoNotificacion.Pago &&
                    n.EntidadReferencia == "Pago"
                )), Times.Once);

            repoAuditoriaMock.Verify(r => r.Agregar(
                It.Is<Entidades.Auditoria>(a =>
                    a.UsuarioId == 99 &&
                    a.Entidad == "Pago" &&
                    a.Accion.Contains("Registró pago manual")
                )), Times.Once);
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarExcepcion_CuandoCuotaNoExiste()
        {
            var repoPagoMock = new Mock<IRepositorioPago>();
            var repoCuotaMock = new Mock<IRepositorioCuota>();
            var repoNotificacionMock = new Mock<IRepositorioNotificacion>();
            var actualizarBloqueoMock = new Mock<IActualizarBloqueoDeudaAlumno>();
            var repoAuditoriaMock = new Mock<IRepositorioAuditoria>();

            RegistrarPagoRequest request = new RegistrarPagoRequest
            {
                CuotaId = 99,
                MedioPago = MedioPago.EFECTIVO,
                ReferenciaExterna = "Pago en efectivo"
            };

            repoCuotaMock
                .Setup(r => r.ObtenerPorId(99))
                .Returns((Entidades.Cuota)null);

            var casoUso =
                new RegistrarPago(
                    repoPagoMock.Object,
                    repoCuotaMock.Object,
                    repoNotificacionMock.Object,
                    actualizarBloqueoMock.Object,
                    repoAuditoriaMock.Object);

            var ex = Assert.Throws<LogicaNegocioException>(() =>
                casoUso.Ejecutar(request, 99));

            Assert.Equal("Cuota no encontrada", ex.Message);

            repoPagoMock.Verify(
                r => r.Agregar(It.IsAny<Entidades.Pago>()),
                Times.Never);

            repoCuotaMock.Verify(
                r => r.Modificar(It.IsAny<Entidades.Cuota>()),
                Times.Never);

            repoNotificacionMock.Verify(
                r => r.Agregar(It.IsAny<Entidades.Notificacion>()),
                Times.Never);

            actualizarBloqueoMock.Verify(
                r => r.Ejecutar(It.IsAny<int>()),
                Times.Never);

            repoAuditoriaMock.Verify(
                r => r.Agregar(It.IsAny<Entidades.Auditoria>()),
                Times.Never);
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarExcepcion_CuandoCuotaYaEstaPagada()
        {
            var repoPagoMock = new Mock<IRepositorioPago>();
            var repoCuotaMock = new Mock<IRepositorioCuota>();
            var repoNotificacionMock = new Mock<IRepositorioNotificacion>();
            var actualizarBloqueoMock = new Mock<IActualizarBloqueoDeudaAlumno>();
            var repoAuditoriaMock = new Mock<IRepositorioAuditoria>();

            var cuota = new Entidades.Cuota
            {
                Id = 1,
                Estado = EstadoCuota.PAGADA
            };

            RegistrarPagoRequest request = new RegistrarPagoRequest
            {
                CuotaId = 1,
                MedioPago = MedioPago.EFECTIVO,
                ReferenciaExterna = "Pago en efectivo"
            };

            repoCuotaMock
                .Setup(r => r.ObtenerPorId(1))
                .Returns(cuota);

            var casoUso =
                new RegistrarPago(
                    repoPagoMock.Object,
                    repoCuotaMock.Object,
                    repoNotificacionMock.Object,
                    actualizarBloqueoMock.Object,
                    repoAuditoriaMock.Object);

            var ex = Assert.Throws<LogicaNegocioException>(() =>
                casoUso.Ejecutar(request, 99));

            Assert.Equal("La cuota ya se encuentra pagada", ex.Message);

            repoPagoMock.Verify(
                r => r.Agregar(It.IsAny<Entidades.Pago>()),
                Times.Never);

            repoCuotaMock.Verify(
                r => r.Modificar(It.IsAny<Entidades.Cuota>()),
                Times.Never);

            repoNotificacionMock.Verify(
                r => r.Agregar(It.IsAny<Entidades.Notificacion>()),
                Times.Never);

            actualizarBloqueoMock.Verify(
                r => r.Ejecutar(It.IsAny<int>()),
                Times.Never);

            repoAuditoriaMock.Verify(
                r => r.Agregar(It.IsAny<Entidades.Auditoria>()),
                Times.Never);
        }
    }
}