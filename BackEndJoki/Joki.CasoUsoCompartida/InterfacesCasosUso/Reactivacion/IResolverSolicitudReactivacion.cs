using Joki.CasoUsoCompartida.DTOs.Reactivacion;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Reactivacion
{
    public interface IResolverSolicitudReactivacion
    {
        void Ejecutar(
            int solicitudId,
            int adminId,
            ResolverSolicitudReactivacionRequest request);
    }
}