using Joki.CasoUsoCompartida.DTOs.Auditoria;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Auditoria;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Auditoria
{
    public class ObtenerAuditoriasPorEntidad :
        IObtenerAuditoriasPorEntidad
    {
        private readonly IRepositorioAuditoria _repositorioAuditoria;
        private readonly IResolverAuditoriaResponse _resolverAuditoriaResponse;

        public ObtenerAuditoriasPorEntidad(
            IRepositorioAuditoria repositorioAuditoria,
            IResolverAuditoriaResponse resolverAuditoriaResponse)
        {
            _repositorioAuditoria = repositorioAuditoria;
            _resolverAuditoriaResponse = resolverAuditoriaResponse;
        }

        public IEnumerable<AuditoriaResponse> Ejecutar(
            string entidad,
            int cantidad)
        {
            if (string.IsNullOrWhiteSpace(entidad))
            {
                throw new LogicaNegocioException(
                    "Debe indicar una entidad");
            }

            if (cantidad <= 0)
            {
                cantidad = 50;
            }

            return _repositorioAuditoria
                .ObtenerPorEntidad(entidad, cantidad)
                .Select(a => _resolverAuditoriaResponse.Resolver(a))
                .ToList();
        }
    }
}