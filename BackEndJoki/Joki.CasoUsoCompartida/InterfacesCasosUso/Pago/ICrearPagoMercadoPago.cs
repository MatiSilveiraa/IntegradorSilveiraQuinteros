using Joki.CasoUsoCompartida.DTOs.Pago;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Pago
{
    public interface ICrearPagoMercadoPago
    {
        CrearPagoMercadoPagoResponse Ejecutar(int cuotaId);
    }
}