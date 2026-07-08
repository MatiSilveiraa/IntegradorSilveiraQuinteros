using Joki.CasoUsoCompartida.DTOs.Cuota;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Cuota
{
    public interface IObtenerDetalleCuotaAdmin
    {
        DetalleCuotaAdminResponse Ejecutar(int cuotaId);
    }
}