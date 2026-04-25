using Joki.CasoUsoCompartida.DTOs.Perfil;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Perfil
{
    public interface IActualizarPerfilUsuario
    {
        PerfilResponse Ejecutar(int usuarioId, ActualizarPerfilRequest request);
    }
}
