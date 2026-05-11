using Joki.CasoUsoCompartida.DTOs.Clase;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Grupo
{
    public interface IObtenerClasesInscripto
    {
        List<ClaseResponse> Ejecutar(int alumnoId);
    }
}
