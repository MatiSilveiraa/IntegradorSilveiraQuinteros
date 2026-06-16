using Joki.CasoUsoCompartida.DTOs.Reactivacion;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Reactivacion
{
    public interface ISolicitarReactivacionCuenta
    {
        void Ejecutar(
            int alumnoId,
            SolicitarReactivacionRequest request);
    }
}