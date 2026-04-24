using Joki.CasoUsoCompartida.DTOs.Autenticacion;
using Joki.CasoUsoCompartida.DTOs.Usuario;
using Joki.LogicaAplicacion.CasosDeUso.Autenticacion;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Joki.LogicaNegocio.ValueObjects;
using Microsoft.AspNetCore.Identity;
using Moq;

namespace Joki.Pruebas.CasosDeUso.Autenticacion
{
    public class LoginUsuarioTests
    {
        [Fact]
        public void Ejecutar_DeberiaRetornarUsuarioDto_CuandoCredencialesSonCorrectas()
        {
            var mockRepo = new Mock<IRepositorioUsuario>();

            var hasheador = new PasswordHasher<object>();
            string hash = hasheador.HashPassword(null, "Juan#123");

            var alumno = new Joki.LogicaNegocio.Entidades.Alumno
            {
                UsuarioId = 1,
                Nombre = new Nombre("Juan"),
                Apellido = new Apellido("Perez"),
                Email = new Email("juan@test.com"),
                Contrasena = Contrasena.FromHash(hash),
                Estado = EstadoUsuario.ACTIVO
            };

            mockRepo.Setup(r => r.ObtenerPorEmail("juan@test.com")).Returns(alumno);

            var casoUso = new LoginUsuario(mockRepo.Object);

            var request = new LoginRequest
            {
                Email = "juan@test.com",
                Password = "Juan#123"
            };

            DtoDatosUsuario? resultado = casoUso.Ejecutar(request);

            Assert.NotNull(resultado);
            Assert.Equal("Juan", resultado.Nombre);
            Assert.Equal("juan@test.com", resultado.Email);
            Assert.Equal("Alumno", resultado.Rol);

            mockRepo.Verify(r => r.ObtenerPorEmail("juan@test.com"), Times.Once);
        }

        [Fact]
        public void Ejecutar_DeberiaRetornarRolEntrenador_CuandoUsuarioEsEntrenador()
        {
            var mockRepo = new Mock<IRepositorioUsuario>();

            var hasheador = new PasswordHasher<object>();
            string hash = hasheador.HashPassword(null, "Carlos#123");

            var entrenador = new Entrenador
            {
                UsuarioId = 2,
                Nombre = new Nombre("Carlos"),
                Apellido = new Apellido("Gomez"),
                Email = new Email("carlos@joki.com"),
                Contrasena = Contrasena.FromHash(hash),
                Estado = EstadoUsuario.ACTIVO,
            };

            mockRepo.Setup(r => r.ObtenerPorEmail("carlos@joki.com")).Returns(entrenador);

            var casoUso = new LoginUsuario(mockRepo.Object);

            var request = new LoginRequest
            {
                Email = "carlos@joki.com",
                Password = "Carlos#123"
            };

            DtoDatosUsuario? resultado = casoUso.Ejecutar(request);

            Assert.NotNull(resultado);
            Assert.Equal("Entrenador", resultado.Rol);
        }

        [Fact]
        public void Ejecutar_DeberiaRetornarNull_CuandoRequestEsNull()
        {
            var mockRepo = new Mock<IRepositorioUsuario>();
            var casoUso = new LoginUsuario(mockRepo.Object);

            var resultado = casoUso.Ejecutar(null!);

            Assert.Null(resultado);
            mockRepo.Verify(r => r.ObtenerPorEmail(It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public void Ejecutar_DeberiaRetornarNull_CuandoEmailEstaVacio()
        {
            var mockRepo = new Mock<IRepositorioUsuario>();
            var casoUso = new LoginUsuario(mockRepo.Object);

            var request = new LoginRequest
            {
                Email = "",
                Password = "Juan#123"
            };

            var resultado = casoUso.Ejecutar(request);

            Assert.Null(resultado);
            mockRepo.Verify(r => r.ObtenerPorEmail(It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public void Ejecutar_DeberiaRetornarNull_CuandoContrasenaEstaVacia()
        {
            var mockRepo = new Mock<IRepositorioUsuario>();
            var casoUso = new LoginUsuario(mockRepo.Object);

            var request = new LoginRequest
            {
                Email = "juan@test.com",
                Password = ""
            };

            var resultado = casoUso.Ejecutar(request);

            Assert.Null(resultado);
            mockRepo.Verify(r => r.ObtenerPorEmail(It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public void Ejecutar_DeberiaRetornarNull_CuandoUsuarioNoExiste()
        {
            var mockRepo = new Mock<IRepositorioUsuario>();
            mockRepo.Setup(r => r.ObtenerPorEmail("noexiste@test.com")).Returns((Usuario?)null);

            var casoUso = new LoginUsuario(mockRepo.Object);

            var request = new LoginRequest
            {
                Email = "noexiste@test.com",
                Password = "Juan#123"
            };

            var resultado = casoUso.Ejecutar(request);

            Assert.Null(resultado);
        }

        [Fact]
        public void Ejecutar_DeberiaRetornarNull_CuandoContrasenaEsIncorrecta()
        {
            var mockRepo = new Mock<IRepositorioUsuario>();

            var hasheador = new PasswordHasher<object>();
            string hash = hasheador.HashPassword(null, "Juan#123");

            var alumno = new Joki.LogicaNegocio.Entidades.Alumno
            {
                UsuarioId = 1,
                Nombre = new Nombre("Juan"),
                Apellido = new Apellido("Perez"),
                Email = new Email("juan@test.com"),
                Contrasena = Contrasena.FromHash(hash),
                Estado = EstadoUsuario.ACTIVO
            };

            mockRepo.Setup(r => r.ObtenerPorEmail("juan@test.com")).Returns(alumno);

            var casoUso = new LoginUsuario(mockRepo.Object);

            var request = new LoginRequest
            {
                Email = "juan@test.com",
                Password = "Incorrecta#123"
            };

            var resultado = casoUso.Ejecutar(request);

            Assert.Null(resultado);
        }

        [Fact]
        public void Ejecutar_DeberiaRetornarNull_CuandoUsuarioEstaInactivo()
        {
            var mockRepo = new Mock<IRepositorioUsuario>();

            var hasheador = new PasswordHasher<object>();
            string hash = hasheador.HashPassword(null, "Juan#123");

            var alumno = new Joki.LogicaNegocio.Entidades.Alumno
            {
                UsuarioId = 1,
                Nombre = new Nombre("Juan"),
                Apellido = new Apellido("Perez"),
                Email = new Email("juan@test.com"),
                Contrasena = Contrasena.FromHash(hash),
                Estado = EstadoUsuario.INACTIVO
            };

            mockRepo.Setup(r => r.ObtenerPorEmail("juan@test.com")).Returns(alumno);

            var casoUso = new LoginUsuario(mockRepo.Object);

            var request = new LoginRequest
            {
                Email = "juan@test.com",
                Password = "Juan#123"
            };

            var resultado = casoUso.Ejecutar(request);

            Assert.Null(resultado);
        }
    }
}
