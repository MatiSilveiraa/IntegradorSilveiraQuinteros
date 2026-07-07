using Joki.CasoUsoCompartida.DTOs.Auditoria;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Auditoria;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Auditoria
{
    public class ObtenerAuditorias :
        IObtenerAuditorias
    {
        private readonly IRepositorioAuditoria _repositorioAuditoria;
        private readonly IResolverAuditoriaResponse _resolverAuditoriaResponse;

        public ObtenerAuditorias(
            IRepositorioAuditoria repositorioAuditoria,
            IResolverAuditoriaResponse resolverAuditoriaResponse)
        {
            _repositorioAuditoria = repositorioAuditoria;
            _resolverAuditoriaResponse = resolverAuditoriaResponse;
        }

        public IEnumerable<AuditoriaResponse> Ejecutar(int cantidad)
        {
            if (cantidad <= 0)
            {
                cantidad = 50;
            }

            return _repositorioAuditoria
                .ObtenerUltimas(cantidad)
                .Select(a => _resolverAuditoriaResponse.Resolver(a))
                .ToList();
        }
    }
}