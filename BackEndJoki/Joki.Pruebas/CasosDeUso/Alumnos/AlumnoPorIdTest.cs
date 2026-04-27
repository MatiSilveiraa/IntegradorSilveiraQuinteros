using Joki.LogicaAplicacion.CasosDeUso.Alumno;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Joki.LogicaNegocio.ValueObjects;
using Moq;
using Xunit;

namespace Joki.Pruebas.CasosDeUso.Alumnos
{
    public class ObtenerAlumnoPorIdTests
    {
        [Fact]
        public void AlumnoPorIdTest()
        {
            var mockRepo = new Mock<IRepositorioAlumno>();

            var alumno = new Alumno
            {
                UsuarioId = 1,
                Nombre = new Nombre("Juan"),
                Apellido = new Apellido("Perez"),
                Email = new Email("juan@test.com")
            };

            mockRepo.Setup(r => r.ObtenerPorId(1)).Returns(alumno);

            var casoUso = new ObtenerAlumnoPorId(mockRepo.Object);

            var resultado = casoUso.Ejecutar(1);

            Assert.NotNull(resultado);
            Assert.Equal("Juan", resultado.Nombre);
        }
    }
}