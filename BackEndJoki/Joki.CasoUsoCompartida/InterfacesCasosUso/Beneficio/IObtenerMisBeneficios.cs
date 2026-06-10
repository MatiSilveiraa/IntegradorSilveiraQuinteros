using Joki.CasoUsoCompartida.DTOs.Beneficio;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Beneficio
{
    public interface IObtenerMisBeneficios
    {
        IEnumerable<MiBeneficioResponse> Ejecutar(
            int alumnoId);
    }
}