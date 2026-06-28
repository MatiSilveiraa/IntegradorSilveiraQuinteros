using Joki.CasoUsoCompartida.DTOs.Beneficio;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Beneficio
{
    public interface IObtenerBeneficiosPendientesAdmin
    {
        IEnumerable<BeneficioPendienteAdminResponse> Ejecutar();
    }
}