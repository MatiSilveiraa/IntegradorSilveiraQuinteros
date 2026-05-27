using Joki.CasoUsoCompartida.DTOs.Pago;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Pago
{
    public interface IObtenerPagosPorCuota
    {
        IEnumerable<PagoResponse> Ejecutar(int cuotaId);
    }
}