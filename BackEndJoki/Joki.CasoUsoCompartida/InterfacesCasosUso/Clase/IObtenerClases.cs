
using Joki.CasoUsoCompartida.DTOs.Clase;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Clase
{
    public interface IObtenerClases
    {
        IEnumerable<ClaseResponse> Ejecutar();
    }
}