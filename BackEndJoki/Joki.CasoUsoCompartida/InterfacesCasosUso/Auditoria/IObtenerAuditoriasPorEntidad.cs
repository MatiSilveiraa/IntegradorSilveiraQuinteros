using Joki.CasoUsoCompartida.DTOs.Auditoria;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Auditoria
{
    public interface IObtenerAuditoriasPorEntidad
    {
        IEnumerable<AuditoriaResponse> Ejecutar(
            string entidad,
            int cantidad);
    }
}