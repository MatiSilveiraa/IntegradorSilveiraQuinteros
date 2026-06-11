using Joki.CasoUsoCompartida.DTOs.Notificacion;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Notificacion;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Notificacion
{
    public class ObtenerMisNotificaciones :
        IObtenerMisNotificaciones
    {
        private readonly IRepositorioNotificacion _repositorioNotificacion;

        public ObtenerMisNotificaciones(
            IRepositorioNotificacion repositorioNotificacion)
        {
            _repositorioNotificacion = repositorioNotificacion;
        }

        public IEnumerable<NotificacionResponse> Ejecutar(int usuarioId)
        {
            return _repositorioNotificacion
                .ObtenerPorUsuario(usuarioId)
                .Select(n => new NotificacionResponse
                {
                    Id = n.Id,
                    Titulo = n.Titulo,
                    Mensaje = n.Mensaje,
                    Tipo = n.Tipo.ToString(),
                    Leida = n.Leida,
                    FechaCreacion = n.FechaCreacion,
                    FechaLectura = n.FechaLectura,
                    UrlDestino = n.UrlDestino,
                    EntidadReferencia = n.EntidadReferencia,
                    EntidadReferenciaId = n.EntidadReferenciaId
                })
                .ToList();
        }
    }
}