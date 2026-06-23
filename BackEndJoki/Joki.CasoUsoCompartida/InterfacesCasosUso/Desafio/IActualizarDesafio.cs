using Joki.CasoUsoCompartida.DTOs.Desafio;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Desafio
{
    public interface IActualizarDesafio
    {
        void Ejecutar(int id, ActualizarDesafioRequest request, int usuarioId);
    }
}