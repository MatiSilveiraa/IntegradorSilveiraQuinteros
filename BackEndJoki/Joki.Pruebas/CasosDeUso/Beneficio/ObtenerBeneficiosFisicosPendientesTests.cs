using Joki.LogicaAplicacion.CasosDeUso.Beneficio;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Moq;
using Entidades = Joki.LogicaNegocio.Entidades;

namespace Joki.Pruebas.CasosDeUso.Beneficio
{
    public class ObtenerBeneficiosFisicosPendientesTests
    {
        [Fact]
        public void Ejecutar_DeberiaRetornarBeneficiosFisicosPendientes()
        {
            var repoMock = new Mock<IRepositorioBeneficio>();

            repoMock.Setup(r => r.ObtenerFisicosPendientes())
                .Returns(new List<Entidades.Beneficio>
                {
                    new Entidades.Beneficio
                    {
                        Id = 6,
                        AlumnoId = 7,
                        DescripcionBeneficio = "Camiseta oficial",
                        Alumno = new Entidades.Alumno
                        {
                            UsuarioId = 7
                        }
                    }
                });

            var casoUso =
                new ObtenerBeneficiosFisicosPendientes(repoMock.Object);

            var resultado = casoUso.Ejecutar().ToList();

            Assert.Single(resultado);
            Assert.Equal(6, resultado[0].BeneficioId);
            Assert.Equal(7, resultado[0].AlumnoId);
            Assert.Equal("Camiseta oficial", resultado[0].Descripcion);
        }
    }
}