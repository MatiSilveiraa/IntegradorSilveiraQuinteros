using Joki.CasoUsoCompartida.DTOs.Auditoria;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Auditoria
{
    public interface IObtenerAuditoriasPorUsuario
    {
        IEnumerable<AuditoriaResponse> Ejecutar(
            int usuarioId,
            int cantidad);
    }
}