using Joki.CasoUsoCompartida.DTOs.Desafio;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Desafio
{
    public interface IAsignarGanadoresDesafio
    {
        void Ejecutar(
            AsignarGanadoresRequest request);
    }
}