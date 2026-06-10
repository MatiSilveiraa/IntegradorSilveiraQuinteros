using Joki.CasoUsoCompartida.DTOs.Desafio;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Desafio
{
    public interface IObtenerGanadoresDesafio
    {
        IEnumerable<GanadorDesafioResponse> Ejecutar(
            int desafioId);
    }
}