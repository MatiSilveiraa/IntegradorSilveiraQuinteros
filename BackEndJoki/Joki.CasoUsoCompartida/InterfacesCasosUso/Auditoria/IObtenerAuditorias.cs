using Joki.CasoUsoCompartida.DTOs.Auditoria;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Auditoria
{
    public interface IObtenerAuditorias
    {
        IEnumerable<AuditoriaResponse> Ejecutar(int cantidad);
    }
}