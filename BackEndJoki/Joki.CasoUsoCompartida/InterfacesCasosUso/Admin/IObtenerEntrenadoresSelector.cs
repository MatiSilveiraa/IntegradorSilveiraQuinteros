using Joki.CasoUsoCompartida.DTOs.Entrenador;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Admin
{
    public interface IObtenerEntrenadoresSelector
    {
        IEnumerable<EntrenadorSelectResponse> Ejecutar();
    }
}