using Joki.LogicaAplicacion.CasosDeUso.Notificacion;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Moq;
using Entidades = Joki.LogicaNegocio.Entidades;

namespace Joki.Pruebas.CasosDeUso.Notificacion
{
    public class GenerarNotificacionesCuotasTests
    {
        [Fact]
        public void Ejecutar_DeberiaGenerarNotificacionCuotaPorVencer()
        {
            var repoCuotaMock = new Mock<IRepositorioCuota>();
            var repoNotificacionMock = new Mock<IRepositorioNotificacion>();

            var cuota = new Entidades.Cuota
            {
                Id = 5,
                AlumnoId = 7,
                FechaVencimiento = DateTime.Today.AddDays(2),
                Estado = EstadoCuota.PENDIENTE
            };

            repoCuotaMock.Setup(r =>
                    r.ObtenerPendientesPorVencer(
                        It.IsAny<DateTime>(),
                        It.IsAny<DateTime>()))
                .Returns(new List<Entidades.Cuota> { cuota });

            repoCuotaMock.Setup(r =>
                    r.ObtenerPendientesVencidas(
                        It.IsAny<DateTime>()))
                .Returns(new List<Entidades.Cuota>());

            repoNotificacionMock.Setup(r =>
                    r.Existe(
                        7,
                        TipoNotificacion.Vencimiento,
                        "Cuota",
                        5))
                .Returns(false);

            var casoUso =
                new GenerarNotificacionesCuotas(
                    repoCuotaMock.Object,
                    repoNotificacionMock.Object);

            casoUso.Ejecutar();

            repoNotificacionMock.Verify(r => r.Agregar(
                It.Is<Entidades.Notificacion>(n =>
                    n.UsuarioId == 7 &&
                    n.Titulo == "Cuota por vencer" &&
                    n.Tipo == TipoNotificacion.Vencimiento &&
                    n.EntidadReferencia == "Cuota" &&
                    n.EntidadReferenciaId == 5
                )), Times.Once);
        }

        [Fact]
        public void Ejecutar_DeberiaGenerarNotificacionCuotaVencida()
        {
            var repoCuotaMock = new Mock<IRepositorioCuota>();
            var repoNotificacionMock = new Mock<IRepositorioNotificacion>();

            var cuota = new Entidades.Cuota
            {
                Id = 9,
                AlumnoId = 1,
                FechaVencimiento = DateTime.Today.AddDays(-1),
                Estado = EstadoCuota.PENDIENTE
            };

            repoCuotaMock.Setup(r =>
                    r.ObtenerPendientesPorVencer(
                        It.IsAny<DateTime>(),
                        It.IsAny<DateTime>()))
                .Returns(new List<Entidades.Cuota>());

            repoCuotaMock.Setup(r =>
                    r.ObtenerPendientesVencidas(
                        It.IsAny<DateTime>()))
                .Returns(new List<Entidades.Cuota> { cuota });

            repoNotificacionMock.Setup(r =>
                    r.Existe(
                        1,
                        TipoNotificacion.Deuda,
                        "Cuota",
                        9))
                .Returns(false);

            var casoUso =
                new GenerarNotificacionesCuotas(
                    repoCuotaMock.Object,
                    repoNotificacionMock.Object);

            casoUso.Ejecutar();

            repoNotificacionMock.Verify(r => r.Agregar(
                It.Is<Entidades.Notificacion>(n =>
                    n.UsuarioId == 1 &&
                    n.Titulo == "Cuota vencida" &&
                    n.Tipo == TipoNotificacion.Deuda &&
                    n.EntidadReferencia == "Cuota" &&
                    n.EntidadReferenciaId == 9
                )), Times.Once);
        }

        [Fact]
        public void Ejecutar_NoDeberiaDuplicarNotificacionSiYaExiste()
        {
            var repoCuotaMock = new Mock<IRepositorioCuota>();
            var repoNotificacionMock = new Mock<IRepositorioNotificacion>();

            var cuota = new Entidades.Cuota
            {
                Id = 5,
                AlumnoId = 7,
                FechaVencimiento = DateTime.Today.AddDays(2),
                Estado = EstadoCuota.PENDIENTE
            };

            repoCuotaMock.Setup(r =>
                    r.ObtenerPendientesPorVencer(
                        It.IsAny<DateTime>(),
                        It.IsAny<DateTime>()))
                .Returns(new List<Entidades.Cuota> { cuota });

            repoCuotaMock.Setup(r =>
                    r.ObtenerPendientesVencidas(
                        It.IsAny<DateTime>()))
                .Returns(new List<Entidades.Cuota>());

            repoNotificacionMock.Setup(r =>
                    r.Existe(
                        7,
                        TipoNotificacion.Vencimiento,
                        "Cuota",
                        5))
                .Returns(true);

            var casoUso =
                new GenerarNotificacionesCuotas(
                    repoCuotaMock.Object,
                    repoNotificacionMock.Object);

            casoUso.Ejecutar();

            repoNotificacionMock.Verify(r =>
                r.Agregar(It.IsAny<Entidades.Notificacion>()),
                Times.Never);
        }
    }
}