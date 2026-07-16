using Joki.CasoUsoCompartida.DTOs.Entrenador;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Entrenador
{
    public interface IObtenerDetalleClase
    {
        ClaseDetalleDTO? Ejecutar(
            int claseId,
            int entrenadorId,
            DateTime? fecha = null);
    }
}