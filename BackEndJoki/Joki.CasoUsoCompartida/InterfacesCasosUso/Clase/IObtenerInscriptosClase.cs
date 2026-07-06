using Joki.CasoUsoCompartida.DTOs.Clase;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Clase
{
    public interface IObtenerInscriptosClase
    {
        IEnumerable<AlumnoInscriptoClaseResponse> Ejecutar(int claseId);
    }
}