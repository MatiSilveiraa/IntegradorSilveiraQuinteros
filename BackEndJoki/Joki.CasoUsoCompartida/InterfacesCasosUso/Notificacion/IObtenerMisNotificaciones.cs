using Joki.CasoUsoCompartida.DTOs.Notificacion;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Notificacion
{
    public interface IObtenerMisNotificaciones
    {
        IEnumerable<NotificacionResponse> Ejecutar(int usuarioId);
    }
}