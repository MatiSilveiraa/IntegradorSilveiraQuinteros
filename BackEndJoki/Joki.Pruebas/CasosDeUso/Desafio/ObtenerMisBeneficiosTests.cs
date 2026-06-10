using Joki.LogicaAplicacion.CasosDeUso.Beneficio;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Moq;
using Entidades = Joki.LogicaNegocio.Entidades;

namespace Joki.Pruebas.CasosDeUso.Beneficio
{
    public class ObtenerMisBeneficiosTests
    {
        [Fact]
        public void Ejecutar_DeberiaRetornarSoloBeneficiosNoCancelados()
        {
            var repoMock =
                new Mock<IRepositorioBeneficio>();

            repoMock
                .Setup(r => r.ObtenerPorAlumno(7))
                .Returns(new List<Entidades.Beneficio>
                {
                    new Entidades.Beneficio
                    {
                        Id = 1,
                        Estado = EstadoBeneficio.PENDIENTE,
                        DescripcionBeneficio = "Descuento"
                    },
                    new Entidades.Beneficio
                    {
                        Id = 2,
                        Estado = EstadoBeneficio.CANCELADO,
                        DescripcionBeneficio = "Cancelado"
                    }
                });

            var casoUso =
                new ObtenerMisBeneficios(
                    repoMock.Object);

            var resultado =
                casoUso.Ejecutar(7).ToList();

            Assert.Single(resultado);

            Assert.Equal(
                "Descuento",
                resultado[0].Descripcion);
        }

        [Fact]
        public void Ejecutar_DeberiaDetectarCuotaGratis()
        {
            var repoMock =
                new Mock<IRepositorioBeneficio>();

            repoMock
                .Setup(r => r.ObtenerPorAlumno(7))
                .Returns(new List<Entidades.Beneficio>
                {
                    new Entidades.Beneficio
                    {
                        Id = 1,
                        Estado = EstadoBeneficio.PENDIENTE,
                        CuotaGratis = true,
                        DescripcionBeneficio = "Mes gratis"
                    }
                });

            var casoUso =
                new ObtenerMisBeneficios(
                    repoMock.Object);

            var resultado =
                casoUso.Ejecutar(7).First();

            Assert.Equal(
                "CUOTA_GRATIS",
                resultado.Tipo);
        }
    }
}