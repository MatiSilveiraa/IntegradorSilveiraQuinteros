using Joki.CasoUsoCompartida.DTOs.Cuota;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Cuota
{
    public interface IObtenerCuotasAdmin
    {
        IEnumerable<CuotaAdminResponse> Ejecutar(
            string? estado,
            int? alumnoId,
            int? mes,
            int? anio,
            string? buscar);
    }
}