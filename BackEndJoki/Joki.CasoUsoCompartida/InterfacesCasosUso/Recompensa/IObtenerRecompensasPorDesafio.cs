using Joki.CasoUsoCompartida.DTOs.Recompensa;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Recompensa
{
    public interface IObtenerRecompensasPorDesafio
    {
        IEnumerable<RecompensaResponse> Ejecutar(int desafioId);
    }
}