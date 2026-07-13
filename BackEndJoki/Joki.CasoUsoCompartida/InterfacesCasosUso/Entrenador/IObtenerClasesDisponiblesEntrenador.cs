using Joki.CasoUsoCompartida.DTOs.Entrenador;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Entrenador
{
    public interface IObtenerClasesDisponiblesEntrenador
    {
        List<ClaseDisponibleEntrenadorDTO> Ejecutar(
            int entrenadorId);
    }
}