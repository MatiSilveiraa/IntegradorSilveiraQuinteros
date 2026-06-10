using Joki.CasoUsoCompartida.DTOs.Recompensa;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Recompensa
{
    public interface ICrearRecompensa
    {
        void Ejecutar(CrearRecompensaRequest request);
    }
}