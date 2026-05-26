using Joki.CasoUsoCompartida.DTOs.Cuota;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Cuota
{
    public interface IObtenerMisCuotas
    {
        IEnumerable<CuotaResponse> Ejecutar(int alumnoId);
    }
}