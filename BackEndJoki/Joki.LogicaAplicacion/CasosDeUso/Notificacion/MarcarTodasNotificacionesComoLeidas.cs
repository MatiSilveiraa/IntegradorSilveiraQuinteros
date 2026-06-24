using Joki.CasoUsoCompartida.InterfacesCasosUso.Notificacion;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Notificacion
{
    public class MarcarTodasNotificacionesComoLeidas :
        IMarcarTodasNotificacionesComoLeidas
    {
        private readonly IRepositorioNotificacion
            _repositorioNotificacion;

        public MarcarTodasNotificacionesComoLeidas(
            IRepositorioNotificacion repositorioNotificacion)
        {
            _repositorioNotificacion =
                repositorioNotificacion;
        }

        public void Ejecutar(int usuarioId)
        {
            _repositorioNotificacion
                .MarcarTodasComoLeidas(usuarioId);
        }
    }
}