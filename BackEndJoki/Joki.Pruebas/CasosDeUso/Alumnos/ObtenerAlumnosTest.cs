using Joki.LogicaAplicacion.CasosDeUso.Alumno;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Joki.LogicaNegocio.ValueObjects;
using Moq;

namespace Joki.Pruebas.CasosDeUso.Alumnos
{
    public class ObtenerAlumnosTest
    {
        [Fact]
        public void Ejecutar_DeberiaRetornarListaDeAlumnos()
        {
            var mockRepo = new Mock<IRepositorioAlumno>();

            var alumnos = new List<Alumno>
            {
                new Alumno
                {
                    UsuarioId = 1,
                    Nombre = new Nombre("Juan"),
                    Apellido = new Apellido("Perez"),
                    Email = new Email("juan@test.com"),
                    Estado = EstadoUsuario.ACTIVO
                },
                new Alumno
                {
                    UsuarioId = 2,
                    Nombre = new Nombre("Maria"),
                    Apellido = new Apellido("Lopez"),
                    Email = new Email("maria@test.com"),
                    Estado = EstadoUsuario.INACTIVO
                }
            };

            mockRepo.Setup(r => r.ObtenerTodos()).Returns(alumnos);

            var casoUso = new ObtenerAlumnos(mockRepo.Object);

            var resultado = casoUso.Ejecutar();

            Assert.NotNull(resultado);
            Assert.Equal(2, resultado.Count());

            var lista = resultado.ToList();

            Assert.Equal("Juan", lista[0].Nombre);
            Assert.Equal("Perez", lista[0].Apellido);
            Assert.Equal("juan@test.com", lista[0].Email);
            Assert.Equal("ACTIVO", lista[0].Estado);

            Assert.Equal("Maria", lista[1].Nombre);
            Assert.Equal("INACTIVO", lista[1].Estado);

            mockRepo.Verify(r => r.ObtenerTodos(), Times.Once);
        }

        [Fact]
        public void Ejecutar_DeberiaRetornarListaVacia_CuandoNoHayAlumnos()
        {
            var mockRepo = new Mock<IRepositorioAlumno>();

            mockRepo.Setup(r => r.ObtenerTodos()).Returns(new List<Alumno>());

            var casoUso = new ObtenerAlumnos(mockRepo.Object);

            var resultado = casoUso.Ejecutar();

            Assert.NotNull(resultado);
            Assert.Empty(resultado);

            mockRepo.Verify(r => r.ObtenerTodos(), Times.Once);
        }
    }
}