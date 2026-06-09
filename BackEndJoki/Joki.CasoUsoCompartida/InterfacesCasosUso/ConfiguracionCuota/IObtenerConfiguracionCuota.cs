using Joki.CasoUsoCompartida.DTOs.ConfiguracionCuota;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.ConfiguracionCuota
{
    public interface IObtenerConfiguracionCuota
    {
        ConfiguracionCuotaResponse Ejecutar();
    }
}