using Joki.CasoUsoCompartida.DTOs.Desafio;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Desafio
{
    public interface IObtenerMisDesafios
    {
        IEnumerable<MiDesafioResponse> Ejecutar(
            int alumnoId);
    }
}