using Joki.CasoUsoCompartida.DTOs.Descuento;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Descuento
{
    public interface IActualizarDescuento
    {
        void Ejecutar(
    int id,
    ActualizarDescuentoRequest request,
    int usuarioId);
    }
}