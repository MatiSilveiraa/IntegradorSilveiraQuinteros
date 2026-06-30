using Joki.CasoUsoCompartida.DTOs.Entrenador;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Entrenador
{
    public interface IObtenerDetalleGrupo
    {
        GrupoDetalleDTO? Ejecutar(
            int grupoId,
            int entrenadorId);
    }
}