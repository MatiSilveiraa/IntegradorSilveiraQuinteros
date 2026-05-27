using Joki.LogicaNegocio.Enums;

namespace Joki.CasoUsoCompartida.DTOs.Pago
{
    public class RegistrarPagoRequest
    {
        public int CuotaId { get; set; }

        public MedioPago MedioPago { get; set; }

        public string? ReferenciaExterna { get; set; }
    }
}