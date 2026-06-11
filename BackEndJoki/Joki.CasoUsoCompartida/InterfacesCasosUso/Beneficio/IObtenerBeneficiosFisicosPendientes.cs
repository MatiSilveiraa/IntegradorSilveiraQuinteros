using Joki.CasoUsoCompartida.DTOs.Beneficio;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Beneficio
{
    public interface IObtenerBeneficiosFisicosPendientes
    {
        IEnumerable<BeneficioFisicoPendienteResponse> Ejecutar();
    }
}