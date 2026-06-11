using Joki.LogicaAplicacion.CasosDeUso.Notificacion;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.InterfacesRepositorio;
using Moq;
using Entidades = Joki.LogicaNegocio.Entidades;

namespace Joki.Pruebas.CasosDeUso.Notificacion
{
    public class ObtenerMisNotificacionesTests
    {
        [Fact]
        public void Ejecutar_DeberiaRetornarNotificacionesDelUsuario()
        {
            var repoMock = new Mock<IRepositorioNotificacion>();

            repoMock.Setup(r => r.ObtenerPorUsuario(7))
                .Returns(new List<Entidades.Notificacion>
                {
                    new Entidades.Notificacion
                    {
                        Id = 1,
                        UsuarioId = 7,
                        Titulo = "Pago registrado",
                        Mensaje = "Tu pago fue registrado.",
                        Tipo = TipoNotificacion.Pago,
                        Leida = false,
                        UrlDestino = "/cuotas",
                        EntidadReferencia = "Pago",
                        EntidadReferenciaId = 1
                    }
                });

            var casoUso = new ObtenerMisNotificaciones(repoMock.Object);

            var resultado = casoUso.Ejecutar(7).ToList();

            Assert.Single(resultado);
            Assert.Equal("Pago registrado", resultado[0].Titulo);
            Assert.Equal("Pago", resultado[0].Tipo);
            Assert.False(resultado[0].Leida);
        }
    }
}