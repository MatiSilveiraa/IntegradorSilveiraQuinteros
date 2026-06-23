using Joki.CasoUsoCompartida.DTOs.Clase;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Clase
{
    public interface ICrearClase
    {
        ClaseResponse Ejecutar(
            CrearClaseRequest request,
            int usuarioId);
    }
}