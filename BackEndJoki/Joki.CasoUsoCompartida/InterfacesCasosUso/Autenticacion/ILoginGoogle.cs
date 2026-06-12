using Joki.CasoUsoCompartida.DTOs.Autenticacion;
using Joki.CasoUsoCompartida.DTOs.Usuario;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Autenticacion
{
    public interface ILoginGoogle
    {
        DtoDatosUsuario? Ejecutar(
            LoginGoogleRequest request);
    }
}
