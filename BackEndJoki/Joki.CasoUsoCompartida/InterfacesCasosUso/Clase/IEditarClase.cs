using Joki.CasoUsoCompartida.DTOs.Clase;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Clase
{
    public interface IEditarClase
    {
        ResultadoOperacionClaseResponse Ejecutar(
            int id,
            EditarClaseRequest request,
            int usuarioId);
    }
}