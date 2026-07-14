using Joki.CasoUsoCompartida.DTOs.Entrenador;

namespace Joki.CasoUsoCompartida
    .InterfacesCasosUso.Entrenador
{
    public interface IObtenerMisClasesEntrenador
    {
        List<MiClaseEntrenadorDTO> Ejecutar(
            int entrenadorId);
    }
}