using Joki.CasoUsoCompartida.DTOs.Grupo;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Grupo
{
    public interface ICrearGrupo
    {
        GrupoResponse Ejecutar(
            CrearGrupoRequest request,
            int usuarioId);
    }
}