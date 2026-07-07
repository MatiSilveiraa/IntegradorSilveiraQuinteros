using Joki.CasoUsoCompartida.DTOs.Auditoria;
using AuditoriaEntidad = Joki.LogicaNegocio.Entidades.Auditoria;

namespace Joki.CasoUsoCompartida.InterfacesCasosUso.Auditoria
{
    public interface IResolverAuditoriaResponse
    {
        AuditoriaResponse Resolver(AuditoriaEntidad auditoria);
    }
}