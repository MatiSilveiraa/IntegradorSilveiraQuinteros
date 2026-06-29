using Joki.CasoUsoCompartida.DTOs.Entrenador;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Entrenador
{
    public interface IObtenerEntrenadorDashboard
    {
        EntrenadorDashboardResponse Ejecutar(
            int entrenadorId);
    }
}