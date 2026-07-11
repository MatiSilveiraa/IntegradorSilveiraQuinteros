using Joki.CasoUsoCompartida.DTOs.Desafio;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Desafio
{
    public interface IObtenerDesafios
    {
        IEnumerable<DesafioResponse> Ejecutar(
            int? alumnoId);
    }
}