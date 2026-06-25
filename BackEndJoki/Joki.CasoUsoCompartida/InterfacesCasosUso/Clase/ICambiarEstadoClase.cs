using Joki.CasoUsoCompartida.DTOs.Clase;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Clase
{
    public interface ICambiarEstadoClase
    {
        void Ejecutar(
            int claseId,
            CambiarEstadoClaseRequest request,
            int usuarioId);
    }
}