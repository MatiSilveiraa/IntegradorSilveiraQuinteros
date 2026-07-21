using Joki.CasoUsoCompartida.DTOs.Clase;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Clase
{
    public interface IObtenerListaEsperaClase
    {
        IEnumerable<AlumnoListaEsperaResponse> Ejecutar(int claseId);
    }
}