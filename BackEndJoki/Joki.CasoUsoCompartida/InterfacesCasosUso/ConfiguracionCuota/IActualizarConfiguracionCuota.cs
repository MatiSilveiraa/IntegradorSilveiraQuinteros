using Joki.CasoUsoCompartida.DTOs.ConfiguracionCuota;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.ConfiguracionCuota
{
    public interface IActualizarConfiguracionCuota
    {
        void Ejecutar(ActualizarConfiguracionCuotaRequest request,int usuarioId);
    }
}