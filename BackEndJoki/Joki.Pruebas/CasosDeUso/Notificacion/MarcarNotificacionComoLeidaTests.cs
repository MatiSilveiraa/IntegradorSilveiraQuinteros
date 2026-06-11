using Joki.LogicaAplicacion.CasosDeUso.Notificacion;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Moq;
using Entidades = Joki.LogicaNegocio.Entidades;

namespace Joki.Pruebas.CasosDeUso.Notificacion
{
    public class MarcarNotificacionComoLeidaTests
    {
        [Fact]
        public void Ejecutar_DeberiaMarcarComoLeida()
        {
            var repoMock = new Mock<IRepositorioNotificacion>();

            var notificacion = new Entidades.Notificacion
            {
                Id = 1,
                UsuarioId = 7,
                Leida = false
            };

            repoMock.Setup(r => r.ObtenerPorId(1))
                .Returns(notificacion);

            var casoUso = new MarcarNotificacionComoLeida(repoMock.Object);

            casoUso.Ejecutar(1, 7);

            Assert.True(notificacion.Leida);
            Assert.NotNull(notificacion.FechaLectura);

            repoMock.Verify(r => r.Modificar(notificacion), Times.Once);
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarExcepcion_CuandoNoExiste()
        {
            var repoMock = new Mock<IRepositorioNotificacion>();

            var casoUso = new MarcarNotificacionComoLeida(repoMock.Object);

            Assert.Throws<LogicaNegocioException>(() =>
                casoUso.Ejecutar(99, 7));
        }

        [Fact]
        public void Ejecutar_DeberiaLanzarExcepcion_CuandoNoPerteneceAlUsuario()
        {
            var repoMock = new Mock<IRepositorioNotificacion>();

            repoMock.Setup(r => r.ObtenerPorId(1))
                .Returns(new Entidades.Notificacion
                {
                    Id = 1,
                    UsuarioId = 3
                });

            var casoUso = new MarcarNotificacionComoLeida(repoMock.Object);

            Assert.Throws<LogicaNegocioException>(() =>
                casoUso.Ejecutar(1, 7));
        }
    }
}