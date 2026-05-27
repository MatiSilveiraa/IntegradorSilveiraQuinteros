using Joki.LogicaAplicacion.CasosDeUso.Cuota;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Moq;

using Entidades = Joki.LogicaNegocio.Entidades;

namespace Joki.Pruebas.CasosDeUso.Cuota
{
    public class ActualizarCuotasVencidasTests
    {
        [Fact]
        public void Ejecutar_DeberiaMarcarComoVencida_CuandoCuotaPendienteEstaVencida()
        {
            var repoCuotaMock = new Mock<IRepositorioCuota>();

            var cuota = new Entidades.Cuota
            {
                Id = 1,
                AlumnoId = 3,
                Mes = DateTime.Now.Month,
                Anio = DateTime.Now.Year,
                FechaVencimiento = DateTime.Now.AddDays(-1),
                Estado = EstadoCuota.PENDIENTE
            };

            repoCuotaMock
                .Setup(r => r.ObtenerPendientes())
                .Returns(new List<Entidades.Cuota> { cuota });

            var casoUso =
                new ActualizarCuotasVencidas(repoCuotaMock.Object);

            casoUso.Ejecutar();

            Assert.Equal(EstadoCuota.VENCIDA, cuota.Estado);

            repoCuotaMock.Verify(
                r => r.Modificar(cuota),
                Times.Once);
        }

        [Fact]
        public void Ejecutar_NoDeberiaModificar_CuandoCuotaPendienteNoEstaVencida()
        {
            var repoCuotaMock = new Mock<IRepositorioCuota>();

            var cuota = new Entidades.Cuota
            {
                Id = 1,
                AlumnoId = 3,
                Mes = DateTime.Now.Month,
                Anio = DateTime.Now.Year,
                FechaVencimiento = DateTime.Now.AddDays(5),
                Estado = EstadoCuota.PENDIENTE
            };

            repoCuotaMock
                .Setup(r => r.ObtenerPendientes())
                .Returns(new List<Entidades.Cuota> { cuota });

            var casoUso =
                new ActualizarCuotasVencidas(repoCuotaMock.Object);

            casoUso.Ejecutar();

            Assert.Equal(EstadoCuota.PENDIENTE, cuota.Estado);

            repoCuotaMock.Verify(
                r => r.Modificar(It.IsAny<Entidades.Cuota>()),
                Times.Never);
        }

        [Fact]
        public void Ejecutar_NoDeberiaModificar_CuandoNoHayCuotasPendientes()
        {
            var repoCuotaMock = new Mock<IRepositorioCuota>();

            repoCuotaMock
                .Setup(r => r.ObtenerPendientes())
                .Returns(new List<Entidades.Cuota>());

            var casoUso =
                new ActualizarCuotasVencidas(repoCuotaMock.Object);

            casoUso.Ejecutar();

            repoCuotaMock.Verify(
                r => r.Modificar(It.IsAny<Entidades.Cuota>()),
                Times.Never);
        }
    }
}