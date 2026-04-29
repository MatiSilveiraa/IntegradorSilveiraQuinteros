using Joki.CasoUsoCompartida.DTOs.Grupo;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Grupo
{
    public interface IObtenerGrupos
    {
        IEnumerable<GrupoResponse> Ejecutar();
    }
}
