using Joki.CasoUsoCompartida.DTOs.Descuento;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Descuento
{
    public interface IObtenerDescuentoPorId
    {
        DescuentoResponse Ejecutar(int id);
    }
}