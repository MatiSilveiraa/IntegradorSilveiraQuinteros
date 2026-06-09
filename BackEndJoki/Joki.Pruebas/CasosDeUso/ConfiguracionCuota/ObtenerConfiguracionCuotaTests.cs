using Joki.LogicaAplicacion.CasosDeUso.ConfiguracionCuota;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Moq;
using Entidades = Joki.LogicaNegocio.Entidades;

namespace Joki.Pruebas.CasosDeUso.ConfiguracionCuota
{
    public class ObtenerConfiguracionCuotaTests
    {
        [Fact]
        public void Ejecutar_DeberiaRetornarConfiguracionActiva()
        {
            var repoMock =
                new Mock<IRepositorioConfiguracionCuota>();

            repoMock
                .Setup(r => r.ObtenerActiva())
                .Returns(new Entidades.ConfiguracionCuota
                {
                    MontoMensual = 2000m,
                    Activa = true
                });

            var casoUso =
                new ObtenerConfiguracionCuota(
                    repoMock.Object);

            var resultado =
                casoUso.Ejecutar();

            Assert.Equal(2000m, resultado.MontoMensual);
        }

        [Fact]
        public void Ejecutar_DeberiaRetornarValorPorDefecto_SiNoExisteConfiguracion()
        {
            var repoMock =
                new Mock<IRepositorioConfiguracionCuota>();

            repoMock
                .Setup(r => r.ObtenerActiva())
                .Returns((Entidades.ConfiguracionCuota?)null);

            var casoUso =
                new ObtenerConfiguracionCuota(
                    repoMock.Object);

            var resultado =
                casoUso.Ejecutar();

            Assert.Equal(1390m, resultado.MontoMensual);
        }
    }
}