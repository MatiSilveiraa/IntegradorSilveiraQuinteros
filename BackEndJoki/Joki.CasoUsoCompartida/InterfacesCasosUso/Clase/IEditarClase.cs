using Joki.CasoUsoCompartida.DTOs.Clase;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Clase
{
    public interface IEditarClase
    {
        ClaseResponse Ejecutar(
            int id,
            EditarClaseRequest request,
            int usuarioId);
    }
}