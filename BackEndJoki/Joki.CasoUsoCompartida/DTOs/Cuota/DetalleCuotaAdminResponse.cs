using Joki.CasoUsoCompartida.DTOs.Pago;

namespace Joki.CasoUsoCompartida.DTOs.Cuota
{
    public class DetalleCuotaAdminResponse
    {
        public CuotaAdminResponse Cuota { get; set; } = null!;

        public IEnumerable<PagoResponse> Pagos { get; set; } =
            new List<PagoResponse>();

        public IEnumerable<string> BeneficiosAplicados { get; set; } =
            new List<string>();
    }
}