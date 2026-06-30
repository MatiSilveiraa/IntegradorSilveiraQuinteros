
using Joki.CasoUsoCompartida.DTOs.Entrenador;
namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Entrenador
{
    public interface IObtenerGruposEntrenador
    {
        List<GrupoEntrenadorDTO> Ejecutar(
            int entrenadorId);
    }
}