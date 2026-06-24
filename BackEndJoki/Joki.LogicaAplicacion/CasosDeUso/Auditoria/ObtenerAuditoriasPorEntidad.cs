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

        public ObtenerAuditoriasPorEntidad(
            IRepositorioAuditoria repositorioAuditoria)
        {
            _repositorioAuditoria = repositorioAuditoria;
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

            var auditorias =
                _repositorioAuditoria.ObtenerPorEntidad(
                    entidad,
                    cantidad);

            return auditorias.Select(a =>
                new AuditoriaResponse
                {
                    Id = a.Id,
                    UsuarioId = a.UsuarioId,
                    Entidad = a.Entidad,
                    EntidadId = a.EntidadId,
                    Accion = a.Accion,
                    Fecha = a.Fecha
                });
        }
    }
}