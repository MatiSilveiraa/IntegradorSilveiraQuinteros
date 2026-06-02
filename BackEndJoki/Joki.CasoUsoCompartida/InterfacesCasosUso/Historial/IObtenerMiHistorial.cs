using Joki.CasoUsoCompartida.DTOs.Historial;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Historial
{
    public interface IObtenerMiHistorial
    {
        HistorialAlumnoResponse Ejecutar(int alumnoId);
    }
}