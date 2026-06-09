using Joki.LogicaAplicacion.CasosDeUso.Descuento;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Moq;
using Entidades = Joki.LogicaNegocio.Entidades;

namespace Joki.Pruebas.CasosDeUso.Descuento
{
    public class ObtenerDescuentosTests
    {
        [Fact]
        public void Ejecutar_DeberiaRetornarDescuentos()
        {
            var repoMock =
                new Mock<IRepositorioDescuento>();

            repoMock
                .Setup(r => r.ObtenerTodos())
                .Returns(new List<Entidades.Descuento>
                {
                    new Entidades.Descuento
                    {
                        Id = 1,
                        Nombre = "Aniversario",
                        Descripcion = "Descuento aniversario",
                        Porcentaje = 20m,
                        MesesDuracion = 2,
                        Tipo = TipoDescuento.ANIVERSARIO,
                        Alcance = AlcanceDescuento.TODOS,
                        Activo = true
                    }
                });

            var casoUso =
                new ObtenerDescuentos(
                    repoMock.Object);

            var resultado =
                casoUso.Ejecutar()
                    .ToList();

            Assert.Single(resultado);
            Assert.Equal("Aniversario", resultado[0].Nombre);
            Assert.Equal(20m, resultado[0].Porcentaje);
            Assert.Equal("ANIVERSARIO", resultado[0].Tipo);
            Assert.Equal("TODOS", resultado[0].Alcance);
        }
    }
}