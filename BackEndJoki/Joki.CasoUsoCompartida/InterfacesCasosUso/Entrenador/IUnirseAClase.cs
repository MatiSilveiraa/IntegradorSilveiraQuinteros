using Joki.CasoUsoCompartida.DTOs.Entrenador;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Entrenador
{
    public interface IUnirseAClase
    {
        ResultadoAsignacionClaseResponse Ejecutar(
            int claseId,
            int entrenadorId,
            bool forzar);
    }
}