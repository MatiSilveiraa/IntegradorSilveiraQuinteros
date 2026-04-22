using Joki.CasoUsoCompartida.DTOs.Alumno;
using Joki.LogicaAplicacion.CasosDeUso.Alumnos;
using Joki.LogicaNegocio.Excepciones.Usuario;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Joki.LogicaNegocio.Entidades;
using Moq;

namespace Joki.Pruebas.CasosDeUso.Alumnos
{
    public class RegistrarAlumnoTests
    {
        [Fact]
        public void Ejecutar_DeberiaRegistrarAlumno_CuandoDatosSonValidos()
        {
            var mockRepoUsuario = new Mock<IRepositorioUsuario>();
            var mockRepoAlumno = new Mock<IRepositorioAlumno>();

            mockRepoUsuario.Setup(r => r.ExisteEmail("pedro@test.com")).Returns(false);
            mockRepoAlumno.Setup(r => r.Agregar(It.IsAny<Alumno>())).Returns(10);

            var casoUso = new RegistrarAlumno(mockRepoUsuario.Object, mockRepoAlumno.Object);

            var request = new RegistrarAlumnoRequest
            {
                Nombre = "Pedro",
                Apellido = "Suarez",
                Email = "pedro@test.com",
                Contrasena = "Pedro#123",
                Peso = 74,
                Estatura = 1.78m
            };

            var resultado = casoUso.Ejecutar(request);

            Assert.NotNull(resultado);
            Assert.Equal(10, resultado.UsuarioId);
            Assert.Equal("El registro fue realizado correctamente.", resultado.Mensaje);

            mockRepoAlumno.Verify(r => r.Agregar(It.IsAny<Alumno>()), Times.Once);
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarExcepcion_CuandoRequestEsNull()
        {
            var mockRepoUsuario = new Mock<IRepositorioUsuario>();
            var mockRepoAlumno = new Mock<IRepositorioAlumno>();

            var casoUso = new RegistrarAlumno(mockRepoUsuario.Object, mockRepoAlumno.Object);

            Assert.Throws<UsuarioException>(() => casoUso.Ejecutar(null!));

            mockRepoAlumno.Verify(r => r.Agregar(It.IsAny<Alumno>()), Times.Never);
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarExcepcion_CuandoEmailYaExiste()
        {
            var mockRepoUsuario = new Mock<IRepositorioUsuario>();
            var mockRepoAlumno = new Mock<IRepositorioAlumno>();

            mockRepoUsuario.Setup(r => r.ExisteEmail("pedro@test.com")).Returns(true);

            var casoUso = new RegistrarAlumno(mockRepoUsuario.Object, mockRepoAlumno.Object);

            var request = new RegistrarAlumnoRequest
            {
                Nombre = "Pedro",
                Apellido = "Suarez",
                Email = "pedro@test.com",
                Contrasena = "Pedro#123",
                Peso = 74,
                Estatura = 1.78m
            };

            Assert.Throws<UsuarioRepetidoException>(() => casoUso.Ejecutar(request));
            mockRepoAlumno.Verify(r => r.Agregar(It.IsAny<Alumno>()), Times.Never);
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarExcepcion_CuandoNombreEstaVacio()
        {
            var mockRepoUsuario = new Mock<IRepositorioUsuario>();
            var mockRepoAlumno = new Mock<IRepositorioAlumno>();

            var casoUso = new RegistrarAlumno(mockRepoUsuario.Object, mockRepoAlumno.Object);

            var request = new RegistrarAlumnoRequest
            {
                Nombre = "",
                Apellido = "Suarez",
                Email = "pedro@test.com",
                Contrasena = "Pedro#123",
                Peso = 74,
                Estatura = 1.78m
            };

            Assert.Throws<UsuarioException>(() => casoUso.Ejecutar(request));
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarExcepcion_CuandoApellidoEstaVacio()
        {
            var mockRepoUsuario = new Mock<IRepositorioUsuario>();
            var mockRepoAlumno = new Mock<IRepositorioAlumno>();

            var casoUso = new RegistrarAlumno(mockRepoUsuario.Object, mockRepoAlumno.Object);

            var request = new RegistrarAlumnoRequest
            {
                Nombre = "Pedro",
                Apellido = "",
                Email = "pedro@test.com",
                Contrasena = "Pedro#123",
                Peso = 74,
                Estatura = 1.78m
            };

            Assert.Throws<UsuarioException>(() => casoUso.Ejecutar(request));
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarExcepcion_CuandoEmailEstaVacio()
        {
            var mockRepoUsuario = new Mock<IRepositorioUsuario>();
            var mockRepoAlumno = new Mock<IRepositorioAlumno>();

            var casoUso = new RegistrarAlumno(mockRepoUsuario.Object, mockRepoAlumno.Object);

            var request = new RegistrarAlumnoRequest
            {
                Nombre = "Pedro",
                Apellido = "Suarez",
                Email = "",
                Contrasena = "Pedro#123",
                Peso = 74,
                Estatura = 1.78m
            };

            Assert.Throws<UsuarioException>(() => casoUso.Ejecutar(request));
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarExcepcion_CuandoContrasenaEstaVacia()
        {
            var mockRepoUsuario = new Mock<IRepositorioUsuario>();
            var mockRepoAlumno = new Mock<IRepositorioAlumno>();

            var casoUso = new RegistrarAlumno(mockRepoUsuario.Object, mockRepoAlumno.Object);

            var request = new RegistrarAlumnoRequest
            {
                Nombre = "Pedro",
                Apellido = "Suarez",
                Email = "pedro@test.com",
                Contrasena = "",
                Peso = 74,
                Estatura = 1.78m
            };

            Assert.Throws<UsuarioException>(() => casoUso.Ejecutar(request));
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarExcepcion_CuandoPesoOEstaturaSonInvalidos()
        {
            var mockRepoUsuario = new Mock<IRepositorioUsuario>();
            var mockRepoAlumno = new Mock<IRepositorioAlumno>();

            var casoUso = new RegistrarAlumno(mockRepoUsuario.Object, mockRepoAlumno.Object);

            var request = new RegistrarAlumnoRequest
            {
                Nombre = "Pedro",
                Apellido = "Suarez",
                Email = "pedro@test.com",
                Contrasena = "Pedro#123",
                Peso = 0,
                Estatura = 0
            };

            Assert.Throws<UsuarioException>(() => casoUso.Ejecutar(request));
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarContrasenaException_CuandoContrasenaNoCumpleReglas()
        {
            var mockRepoUsuario = new Mock<IRepositorioUsuario>();
            var mockRepoAlumno = new Mock<IRepositorioAlumno>();

            mockRepoUsuario.Setup(r => r.ExisteEmail("pedro@test.com")).Returns(false);

            var casoUso = new RegistrarAlumno(mockRepoUsuario.Object, mockRepoAlumno.Object);

            var request = new RegistrarAlumnoRequest
            {
                Nombre = "Pedro",
                Apellido = "Suarez",
                Email = "pedro@test.com",
                Contrasena = "123456",
                Peso = 74,
                Estatura = 1.78m
            };

            Assert.Throws<ContrasenaException>(() => casoUso.Ejecutar(request));
            mockRepoAlumno.Verify(r => r.Agregar(It.IsAny<Alumno>()), Times.Never);
        }

        [Fact]
        public void Ejecutar_DeberiaMapearDatosOpcionales_CuandoSeInforman()
        {
            var mockRepoUsuario = new Mock<IRepositorioUsuario>();
            var mockRepoAlumno = new Mock<IRepositorioAlumno>();

            Alumno? alumnoCapturado = null;

            mockRepoUsuario.Setup(r => r.ExisteEmail("pedro@test.com")).Returns(false);
            mockRepoAlumno
                .Setup(r => r.Agregar(It.IsAny<Alumno>()))
                .Callback<Alumno>(a => alumnoCapturado = a)
                .Returns(10);

            var casoUso = new RegistrarAlumno(mockRepoUsuario.Object, mockRepoAlumno.Object);

            var fechaNacimiento = new DateTime(2001, 5, 10);

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
            Assert.Equal("099999999", alumnoCapturado.Celular);
            Assert.Equal(fechaNacimiento, alumnoCapturado.FechaNacimiento);
            Assert.Equal("CASMU", alumnoCapturado.SociedadMedica);
        }
    }
}
