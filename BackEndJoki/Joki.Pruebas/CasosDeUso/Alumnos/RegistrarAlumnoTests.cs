using Joki.CasoUsoCompartida.DTOs.Alumno;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Cuota;
using Joki.LogicaAplicacion.CasosDeUso.Alumnos;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.Excepciones.Usuario;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Moq;
using Xunit;

namespace Joki.Pruebas.CasosDeUso.Alumnos
{
    public class RegistrarAlumnoTests
    {
        [Fact]
        public void Ejecutar_DeberiaRegistrarAlumno_CuandoDatosSonValidos()
        {
            var mockRepoUsuario = new Mock<IRepositorioUsuario>();
            var mockRepoAlumno = new Mock<IRepositorioAlumno>();
            var mockGenerarCuotaInicial = new Mock<IGenerarCuotaInicialAlumno>();

            mockRepoUsuario
                .Setup(r => r.ExisteEmail("pedro@test.com"))
                .Returns(false);

            mockRepoAlumno
                .Setup(r => r.Agregar(It.IsAny<Alumno>()))
                .Returns(10);

            var casoUso =
                new RegistrarAlumno(
                    mockRepoUsuario.Object,
                    mockRepoAlumno.Object,
                    mockGenerarCuotaInicial.Object);

            var request = new RegistrarAlumnoRequest
            {
                Nombre = "Pedro",
                Apellido = "Suarez",
                Email = "pedro@test.com",
                Contrasena = "Pedro#123",
                Peso = 74,
                Estatura = 1.78m,
                Celular = "099123456"
            };

            var respuesta = casoUso.Ejecutar(request);

            Assert.NotNull(respuesta);
            Assert.Equal(
                "El registro fue realizado correctamente.",
                respuesta.Mensaje);

            mockRepoAlumno.Verify(
                r => r.Agregar(It.IsAny<Alumno>()),
                Times.Once);

            mockGenerarCuotaInicial.Verify(
                r => r.Ejecutar(10),
                Times.Once);
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarExcepcion_CuandoContrasenaEsVacia()
        {
            var mockRepoUsuario = new Mock<IRepositorioUsuario>();
            var mockRepoAlumno = new Mock<IRepositorioAlumno>();
            var mockGenerarCuotaInicial = new Mock<IGenerarCuotaInicialAlumno>();

            var casoUso =
                new RegistrarAlumno(
                    mockRepoUsuario.Object,
                    mockRepoAlumno.Object,
                    mockGenerarCuotaInicial.Object);

            var request = new RegistrarAlumnoRequest
            {
                Nombre = "Pedro",
                Apellido = "Suarez",
                Email = "pedro@test.com",
                Contrasena = "",
                Peso = 74,
                Estatura = 1.78m,
                Celular = "099123456"
            };

            Assert.Throws<UsuarioException>(() =>
                casoUso.Ejecutar(request));

            mockGenerarCuotaInicial.Verify(
                r => r.Ejecutar(It.IsAny<int>()),
                Times.Never);
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarExcepcion_CuandoPesoOEstaturaSonInvalidos()
        {
            var mockRepoUsuario = new Mock<IRepositorioUsuario>();
            var mockRepoAlumno = new Mock<IRepositorioAlumno>();
            var mockGenerarCuotaInicial = new Mock<IGenerarCuotaInicialAlumno>();

            var casoUso =
                new RegistrarAlumno(
                    mockRepoUsuario.Object,
                    mockRepoAlumno.Object,
                    mockGenerarCuotaInicial.Object);

            var request = new RegistrarAlumnoRequest
            {
                Nombre = "Pedro",
                Apellido = "Suarez",
                Email = "pedro@test.com",
                Contrasena = "Pedro#123",
                Peso = 0,
                Estatura = 0,
                Celular = "099123456"
            };

            Assert.Throws<UsuarioException>(() =>
                casoUso.Ejecutar(request));

            mockGenerarCuotaInicial.Verify(
                r => r.Ejecutar(It.IsAny<int>()),
                Times.Never);
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarContrasenaException_CuandoContrasenaNoCumpleReglas()
        {
            var mockRepoUsuario = new Mock<IRepositorioUsuario>();
            var mockRepoAlumno = new Mock<IRepositorioAlumno>();
            var mockGenerarCuotaInicial = new Mock<IGenerarCuotaInicialAlumno>();

            mockRepoUsuario
                .Setup(r => r.ExisteEmail("pedro@test.com"))
                .Returns(false);

            var casoUso =
                new RegistrarAlumno(
                    mockRepoUsuario.Object,
                    mockRepoAlumno.Object,
                    mockGenerarCuotaInicial.Object);

            var request = new RegistrarAlumnoRequest
            {
                Nombre = "Pedro",
                Apellido = "Suarez",
                Email = "pedro@test.com",
                Contrasena = "123456",
                Peso = 74,
                Estatura = 1.78m,
                Celular = "099123456"
            };

            Assert.Throws<ContrasenaException>(() =>
                casoUso.Ejecutar(request));

            mockRepoAlumno.Verify(
                r => r.Agregar(It.IsAny<Alumno>()),
                Times.Never);

            mockGenerarCuotaInicial.Verify(
                r => r.Ejecutar(It.IsAny<int>()),
                Times.Never);
        }

        [Fact]
        public void Ejecutar_DeberiaMapearDatosOpcionales_CuandoSeInforman()
        {
            var mockRepoUsuario = new Mock<IRepositorioUsuario>();
            var mockRepoAlumno = new Mock<IRepositorioAlumno>();
            var mockGenerarCuotaInicial = new Mock<IGenerarCuotaInicialAlumno>();

            Alumno? alumnoCapturado = null;

            mockRepoUsuario
                .Setup(r => r.ExisteEmail("pedro@test.com"))
                .Returns(false);

            mockRepoAlumno
                .Setup(r => r.Agregar(It.IsAny<Alumno>()))
                .Callback<Alumno>(a => alumnoCapturado = a)
                .Returns(10);

            var casoUso =
                new RegistrarAlumno(
                    mockRepoUsuario.Object,
                    mockRepoAlumno.Object,
                    mockGenerarCuotaInicial.Object);

            var fechaNacimiento =
                new DateTime(2001, 5, 10);

            var request = new RegistrarAlumnoRequest
            {
                Nombre = "Pedro",
                Apellido = "Suarez",
                Email = "pedro@test.com",
                Contrasena = "Pedro#123",
                Peso = 74,
                Estatura = 1.78m,
                Celular = "099999999",
                FechaNacimiento = fechaNacimiento,
                SociedadMedica = "CASMU",
                Genero = 1
            };

            casoUso.Ejecutar(request);

            Assert.NotNull(alumnoCapturado);
            Assert.Equal("Pedro", alumnoCapturado!.Nombre.Valor);
            Assert.Equal("Suarez", alumnoCapturado.Apellido.Valor);
            Assert.Equal("pedro@test.com", alumnoCapturado.Email.Valor);
            Assert.Equal("099999999", alumnoCapturado.Celular.Valor);
            Assert.Equal(fechaNacimiento, alumnoCapturado.FechaNacimiento);
            Assert.Equal("CASMU", alumnoCapturado.SociedadMedica);

            mockGenerarCuotaInicial.Verify(
                r => r.Ejecutar(10),
                Times.Once);
        }
    }
}