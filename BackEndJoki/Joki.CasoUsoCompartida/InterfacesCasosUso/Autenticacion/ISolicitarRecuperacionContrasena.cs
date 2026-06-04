using Joki.CasoUsoCompartida.DTOs.Autenticacion;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Autenticacion
{
    public interface ISolicitarRecuperacionContrasena
    {
        void Ejecutar(SolicitarRecuperacionRequest request);
    }
}
