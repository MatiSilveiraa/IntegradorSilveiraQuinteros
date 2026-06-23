using Joki.CasoUsoCompartida.DTOs.Descuento;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Descuento
{
    public interface ICrearDescuento
    {
        void Ejecutar(
            CrearDescuentoRequest request,
            int usuarioId);
    }
}