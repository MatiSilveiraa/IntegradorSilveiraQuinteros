using Joki.CasoUsoCompartida.DTOs.Pago;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Pago
{
    public interface IRegistrarPago
    {
        void Ejecutar(RegistrarPagoRequest request);
    }
}