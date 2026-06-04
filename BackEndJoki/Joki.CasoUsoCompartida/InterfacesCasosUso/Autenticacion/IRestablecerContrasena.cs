using Joki.CasoUsoCompartida.DTOs.Autenticacion;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Autenticacion
{
    public interface IRestablecerContrasena
    {
        void Ejecutar(RestablecerContrasenaRequest request);
    }
}
