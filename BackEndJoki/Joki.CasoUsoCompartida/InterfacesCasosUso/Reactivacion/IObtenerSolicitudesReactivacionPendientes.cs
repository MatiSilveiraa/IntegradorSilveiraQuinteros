using Joki.CasoUsoCompartida.DTOs.Reactivacion;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Reactivacion
{
    public interface IObtenerSolicitudesReactivacionPendientes
    {
        IEnumerable<SolicitudReactivacionResponse> Ejecutar();
    }
}