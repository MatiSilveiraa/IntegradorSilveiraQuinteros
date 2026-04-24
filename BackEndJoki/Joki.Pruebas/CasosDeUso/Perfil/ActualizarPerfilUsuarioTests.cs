using Joki.CasoUsoCompartida.DTOs.Perfil;
using Joki.LogicaAplicacion.CasosDeUso.Perfil;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Joki.LogicaNegocio.ValueObjects;
using Moq;

namespace Joki.Pruebas.CasosDeUso.Perfil
{
    public class ActualizarPerfilUsuarioTests
    {
        [Fact]
        public void Ejecutar_DeberiaActualizarYRetornarDatos_CuandoEnvioDatosValidos()
        {
            var mockRepo = new Mock<IRepositorioUsuario>();
            var casoUso = new ActualizarPerfilUsuario(mockRepo.Object);

            var usuarioId = 1;
            
            var usuarioDb = new Alumno
            {
                UsuarioId = usuarioId,
                Nombre = new Nombre("Juan"),
                Apellido = new Apellido("Perez"),
                Email = new Email("juan@test.com")
            };
            
            mockRepo.Setup(r => r.ObtenerPorId(usuarioId)).Returns(usuarioDb);

            var request = new ActualizarPerfilRequest
            {
                Nombre = "Juan Editado",
                Apellido = "Perez Editado",
                Celular = "099123456", 
                SociedadMedica = "SMI",
                FechaNacimiento = new DateTime(1990, 5, 10),
                Genero = 1 
            };
           
            var resultado = casoUso.Ejecutar(usuarioId, request);
        
            mockRepo.Verify(r => r.Modificar(It.IsAny<Usuario>()), Times.Once);
            
            Assert.NotNull(resultado);
            Assert.Equal("Juan Editado", resultado.Nombre);
            Assert.Equal("Perez Editado", resultado.Apellido);
            Assert.Equal("juan@test.com", resultado.Email);
            Assert.Equal("099123456", resultado.Celular);
            Assert.Equal("SMI", resultado.SociedadMedica);
        }
    
        [Fact]
        public void Ejecutar_DeberiaLanzarExcepcion_CuandoRequestEsNulo()
        {
            var mockRepo = new Mock<IRepositorioUsuario>();
            var casoUso = new ActualizarPerfilUsuario(mockRepo.Object);

            var excepcion = Assert.Throws<ArgumentException>(() => casoUso.Ejecutar(1, null!));
            Assert.Equal("Los datos de actualización no pueden ser nulos.", excepcion.Message);
            
            mockRepo.Verify(r => r.Modificar(It.IsAny<Usuario>()), Times.Never);
        }
     
        [Fact]
        public void Ejecutar_DeberiaLanzarExcepcion_CuandoUsuarioNoExiste()
        {
            var mockRepo = new Mock<IRepositorioUsuario>();
            var casoUso = new ActualizarPerfilUsuario(mockRepo.Object);

            var request = new ActualizarPerfilRequest 
            { 
                Nombre = "Juan", 
                Apellido = "Perez",
                Celular = "099123456" 
            };
           
            mockRepo.Setup(r => r.ObtenerPorId(99)).Returns((Usuario?)null);
        
            var excepcion = Assert.Throws<InvalidOperationException>(() => casoUso.Ejecutar(99, request));
            Assert.Equal("El usuario solicitado no existe.", excepcion.Message);
            
            mockRepo.Verify(r => r.Modificar(It.IsAny<Usuario>()), Times.Never);
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarLogicaNegocioException_CuandoNombreEsVacio()
        {
            var mockRepo = new Mock<IRepositorioUsuario>();
            var casoUso = new ActualizarPerfilUsuario(mockRepo.Object);

            var usuarioDb = new Alumno
            {
                UsuarioId = 1,
                Nombre = new Nombre("Juan"),
                Apellido = new Apellido("Perez"),
                Email = new Email("juan@test.com")
            };

            mockRepo.Setup(r => r.ObtenerPorId(1)).Returns(usuarioDb);

            var request = new ActualizarPerfilRequest
            {
                Nombre = "", 
                Apellido = "Perez Editado",
                Celular = "099123456" 
            };

            var excepcion = Assert.Throws<NombreException>(() => casoUso.Ejecutar(1, request));
            Assert.Equal("El nombre no puede ser nulo o vacío.", excepcion.Message);

            mockRepo.Verify(r => r.Modificar(It.IsAny<Usuario>()), Times.Never);
        }
        
        [Fact]
        public void Ejecutar_NoDeberiaModificarContrasena_CuandoSeActualizaElPerfil()
        {
            var mockRepo = new Mock<IRepositorioUsuario>();
            var casoUso = new ActualizarPerfilUsuario(mockRepo.Object);
            
            var contrasenaOriginal = Contrasena.FromHash("HASH_ORIGINAL");

            var usuarioDb = new Alumno
            {
                UsuarioId = 1,
                Nombre = new Nombre("Juan"),
                Apellido = new Apellido("Perez"),
                Email = new Email("juan@test.com"),
                Contrasena = contrasenaOriginal
            };
           
            Usuario? usuarioGuardado = null;

            mockRepo.Setup(r => r.ObtenerPorId(1)).Returns(usuarioDb);
            mockRepo.Setup(r => r.Modificar(It.IsAny<Usuario>()))
                    .Callback<Usuario>(u => usuarioGuardado = u);

            var request = new ActualizarPerfilRequest
            {
                Nombre = "Juan Editado",
                Apellido = "Perez Editado",
                Celular = "099123456" 
            };
           
            casoUso.Ejecutar(1, request);
         
            Assert.NotNull(usuarioGuardado);
            Assert.Equal(contrasenaOriginal.Valor, usuarioGuardado!.Contrasena.Valor); 
        }

 
        [Fact]
        public void Ejecutar_DeberiaLanzarLogicaNegocioException_CuandoCelularEsInvalido()
        {
            var mockRepo = new Mock<IRepositorioUsuario>();
            var casoUso = new ActualizarPerfilUsuario(mockRepo.Object);

            var usuarioDb = new Alumno
            {
                UsuarioId = 1,
                Nombre = new Nombre("Juan"),
                Apellido = new Apellido("Perez"),
                Email = new Email("juan@test.com")
            };

            mockRepo.Setup(r => r.ObtenerPorId(1)).Returns(usuarioDb);

            var request = new ActualizarPerfilRequest
            {
                Nombre = "Juan Editado",
                Apellido = "Perez Editado",
                Celular = "123" 
            };

   
            var excepcion = Assert.Throws<LogicaNegocioException>(() => casoUso.Ejecutar(1, request));
            Assert.Equal("El celular debe tener un formato válido de Uruguay de 9 dígitos (Ej: 099123456).", excepcion.Message);

            mockRepo.Verify(r => r.Modificar(It.IsAny<Usuario>()), Times.Never);
        }
    }
}
