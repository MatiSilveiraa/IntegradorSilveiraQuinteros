using Joki.CasoUsoCompartida.DTOs.Grupo;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Grupo
{
    public interface IEditarGrupo
    {
        GrupoResponse Ejecutar(
            int id,
            EditarGrupoRequest request,
            int usuarioId);
    }
}