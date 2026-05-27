using Joki.LogicaAplicacion.CasosDeUso.Cuota;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Moq;

using Entidades = Joki.LogicaNegocio.Entidades;

namespace Joki.Pruebas.CasosDeUso.Cuota
{
    public class MarcarCuotaComoPagadaTests
    {
        [Fact]
        public void Ejecutar_DeberiaMarcarCuotaComoPagada_CuandoExiste()
        {
            var repoCuotaMock = new Mock<IRepositorioCuota>();

            var cuota = new Entidades.Cuota
            {
                Id = 1,
                Estado = EstadoCuota.PENDIENTE
            };

            repoCuotaMock
                .Setup(r => r.ObtenerPorId(1))
                .Returns(cuota);

            var casoUso =
                new MarcarCuotaComoPagada(repoCuotaMock.Object);

            casoUso.Ejecutar(1);

            Assert.Equal(EstadoCuota.PAGADA, cuota.Estado);

            repoCuotaMock.Verify(
                r => r.Modificar(cuota),
                Times.Once);
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarExcepcion_CuandoCuotaNoExiste()
        {
            var repoCuotaMock = new Mock<IRepositorioCuota>();

            repoCuotaMock
                .Setup(r => r.ObtenerPorId(99))
                .Returns((Entidades.Cuota)null);

            var casoUso =
                new MarcarCuotaComoPagada(repoCuotaMock.Object);

            var ex = Assert.Throws<LogicaNegocioException>(() =>
                casoUso.Ejecutar(99));

            Assert.Equal(
                "Cuota no encontrada",
                ex.Message);

            repoCuotaMock.Verify(
                r => r.Modificar(It.IsAny<Entidades.Cuota>()),
                Times.Never);
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarExcepcion_CuandoCuotaYaEstaPagada()
        {
            var repoCuotaMock = new Mock<IRepositorioCuota>();

            var cuota = new Entidades.Cuota
            {
                Id = 1,
                Estado = EstadoCuota.PAGADA
            };

            repoCuotaMock
                .Setup(r => r.ObtenerPorId(1))
                .Returns(cuota);

            var casoUso =
                new MarcarCuotaComoPagada(repoCuotaMock.Object);

            var ex = Assert.Throws<LogicaNegocioException>(() =>
                casoUso.Ejecutar(1));

            Assert.Equal(
                "La cuota ya se encuentra pagada",
                ex.Message);

            repoCuotaMock.Verify(
                r => r.Modificar(It.IsAny<Entidades.Cuota>()),
                Times.Never);
        }
    }
}