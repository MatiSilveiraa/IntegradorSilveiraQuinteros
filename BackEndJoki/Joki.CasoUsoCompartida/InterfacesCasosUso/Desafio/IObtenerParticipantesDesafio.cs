using Joki.CasoUsoCompartida.DTOs.Desafio;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Desafio
{
    public interface IObtenerParticipantesDesafio
    {
        IEnumerable<ParticipanteDesafioResponse> Ejecutar(
            int desafioId);
    }
}