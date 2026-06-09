using Joki.CasoUsoCompartida.DTOs.Descuento;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Descuento
{
    public interface IObtenerDescuentos
    {
        IEnumerable<DescuentoResponse> Ejecutar();
    }
}