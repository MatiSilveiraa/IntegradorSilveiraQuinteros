using Joki.CasoUsoCompartida.InterfacesCasosUso.Notificacion;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Notificacion
{
    public class MarcarNotificacionComoLeida :
        IMarcarNotificacionComoLeida
    {
        private readonly IRepositorioNotificacion _repositorioNotificacion;

        public MarcarNotificacionComoLeida(
            IRepositorioNotificacion repositorioNotificacion)
        {
            _repositorioNotificacion = repositorioNotificacion;
        }

        public void Ejecutar(int notificacionId, int usuarioId)
        {
            var notificacion =
                _repositorioNotificacion.ObtenerPorId(notificacionId);

            if (notificacion == null ||
                notificacion.UsuarioId != usuarioId)
            {
                throw new LogicaNegocioException(
                    "No existe la notificación");
            }

            if (!notificacion.Leida)
            {
                notificacion.Leida = true;
                notificacion.FechaLectura = DateTime.UtcNow;

                _repositorioNotificacion.Modificar(notificacion);
            }
        }
    }
}