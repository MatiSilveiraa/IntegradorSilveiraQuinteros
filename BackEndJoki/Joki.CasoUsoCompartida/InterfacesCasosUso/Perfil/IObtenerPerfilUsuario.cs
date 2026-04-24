using Joki.CasoUsoCompartida.DTOs.Perfil;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Perfil
{
    public interface IObtenerPerfilUsuario
    {
        PerfilResponse Ejecutar(int usuarioId);
    }
}
