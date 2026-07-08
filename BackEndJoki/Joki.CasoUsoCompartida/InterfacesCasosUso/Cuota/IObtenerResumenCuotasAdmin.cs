using Joki.CasoUsoCompartida.DTOs.Cuota;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Cuota
{
    public interface IObtenerResumenCuotasAdmin
    {
        ResumenCuotasAdminResponse Ejecutar(
            int? mes,
            int? anio);
    }
}