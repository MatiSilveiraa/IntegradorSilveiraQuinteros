using Joki.CasoUsoCompartida.DTOs.Recompensa;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Recompensa
{
    public interface IActualizarRecompensa
    {
        void Ejecutar(
            int id,
            ActualizarRecompensaRequest request);
    }
}