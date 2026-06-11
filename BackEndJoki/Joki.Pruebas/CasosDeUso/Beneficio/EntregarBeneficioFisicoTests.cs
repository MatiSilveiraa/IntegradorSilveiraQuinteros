using Joki.LogicaAplicacion.CasosDeUso.Beneficio;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Moq;
using Entidades = Joki.LogicaNegocio.Entidades;

namespace Joki.Pruebas.CasosDeUso.Beneficio
{
    public class EntregarBeneficioFisicoTests
    {
        [Fact]
        public void Ejecutar_DeberiaEntregarBeneficioFisico()
        {
            var repoMock = new Mock<IRepositorioBeneficio>();

            var beneficio = new Entidades.Beneficio
            {
                Id = 6,
                Estado = EstadoBeneficio.PENDIENTE,
                CuotaGratis = false,
                DescuentoId = null
            };

            repoMock.Setup(r => r.ObtenerPorId(6))
                .Returns(beneficio);

            var casoUso = new EntregarBeneficioFisico(repoMock.Object);

            casoUso.Ejecutar(6);

            Assert.Equal(EstadoBeneficio.OTORGADO, beneficio.Estado);
            repoMock.Verify(r => r.Modificar(beneficio), Times.Once);
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarExcepcion_CuandoBeneficioNoExiste()
        {
            var repoMock = new Mock<IRepositorioBeneficio>();

            var casoUso = new EntregarBeneficioFisico(repoMock.Object);

            Assert.Throws<LogicaNegocioException>(() =>
                casoUso.Ejecutar(99));
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarExcepcion_CuandoEsDescuento()
        {
            var repoMock = new Mock<IRepositorioBeneficio>();

            repoMock.Setup(r => r.ObtenerPorId(1))
                .Returns(new Entidades.Beneficio
                {
                    Id = 1,
                    Estado = EstadoBeneficio.PENDIENTE,
                    DescuentoId = 2
                });

            var casoUso = new EntregarBeneficioFisico(repoMock.Object);

            Assert.Throws<LogicaNegocioException>(() =>
                casoUso.Ejecutar(1));
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarExcepcion_CuandoEsCuotaGratis()
        {
            var repoMock = new Mock<IRepositorioBeneficio>();

            repoMock.Setup(r => r.ObtenerPorId(1))
                .Returns(new Entidades.Beneficio
                {
                    Id = 1,
                    Estado = EstadoBeneficio.PENDIENTE,
                    CuotaGratis = true
                });

            var casoUso = new EntregarBeneficioFisico(repoMock.Object);

            Assert.Throws<LogicaNegocioException>(() =>
                casoUso.Ejecutar(1));
        }
    }
}