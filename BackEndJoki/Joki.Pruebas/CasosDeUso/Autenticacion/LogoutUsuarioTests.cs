using Joki.LogicaAplicacion.CasosDeUso.Autenticacion;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Moq;

namespace Joki.Pruebas.CasosDeUso.Autenticacion
{
    public class LogoutUsuarioTests
    {
        [Fact]
        public void Ejecutar_DeberiaRevocarToken_CuandoTokenEsValido()
        {
            var mockRepo = new Mock<IRepositorioTokenRevocado>();

            string token = "token-valido";

            mockRepo.Setup(r => r.Existe(token)).Returns(false);

            var casoUso = new LogoutUsuario(mockRepo.Object);

            casoUso.Ejecutar(token);

            mockRepo.Verify(r => r.Existe(token), Times.Once);

            mockRepo.Verify(r => r.Agregar(It.Is<TokenRevocado>(t =>
                t.Token == token
            )), Times.Once);
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarExcepcion_CuandoTokenEsNulo()
        {
            var mockRepo = new Mock<IRepositorioTokenRevocado>();

            var casoUso = new LogoutUsuario(mockRepo.Object);

            var ex = Assert.Throws<LogicaNegocioException>(() => casoUso.Ejecutar(null));

            Assert.Equal("Token inválido.", ex.Message);

            mockRepo.Verify(r => r.Agregar(It.IsAny<TokenRevocado>()), Times.Never);
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarExcepcion_CuandoTokenEstaVacio()
        {
            var mockRepo = new Mock<IRepositorioTokenRevocado>();

            var casoUso = new LogoutUsuario(mockRepo.Object);

            var ex = Assert.Throws<LogicaNegocioException>(() => casoUso.Ejecutar(""));

            Assert.Equal("Token inválido.", ex.Message);

            mockRepo.Verify(r => r.Agregar(It.IsAny<TokenRevocado>()), Times.Never);
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarExcepcion_CuandoTokenYaFueRevocado()
        {
            var mockRepo = new Mock<IRepositorioTokenRevocado>();

            string token = "token-ya-revocado";

            mockRepo.Setup(r => r.Existe(token)).Returns(true);

            var casoUso = new LogoutUsuario(mockRepo.Object);

            var ex = Assert.Throws<LogicaNegocioException>(() => casoUso.Ejecutar(token));

            Assert.Equal("El token ya fue revocado.", ex.Message);

            mockRepo.Verify(r => r.Existe(token), Times.Once);
            mockRepo.Verify(r => r.Agregar(It.IsAny<TokenRevocado>()), Times.Never);
        }
    }
}
