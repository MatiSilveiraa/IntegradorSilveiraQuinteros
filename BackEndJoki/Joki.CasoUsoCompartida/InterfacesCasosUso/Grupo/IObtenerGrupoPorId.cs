using Joki.CasoUsoCompartida.DTOs.Grupo;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Grupo
{
    public interface IObtenerGrupoPorId
    {
        GrupoResponse Ejecutar(int id);
    }
}
