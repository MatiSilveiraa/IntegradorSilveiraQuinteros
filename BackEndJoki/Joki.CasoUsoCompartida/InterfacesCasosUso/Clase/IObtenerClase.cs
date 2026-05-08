using Joki.CasoUsoCompartida.DTOs.Clase;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Clase
{
    public interface IObtenerClase
    {
        ClaseResponse Ejecutar(int id);
    }
}