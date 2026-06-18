using Joki.CasoUsoCompartida.DTOs.Autenticacion;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Autenticacion
{
    public interface ISolicitarLoginSinPassword
    {
        void Ejecutar(
            LoginSinPasswordRequest request);
    }
}