using Joki.CasoUsoCompartida.DTOs.Auditoria;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Auditoria;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Auditoria
{
    public class ObtenerAuditoriasPorUsuario :
        IObtenerAuditoriasPorUsuario
    {
        private readonly IRepositorioAuditoria _repositorioAuditoria;

        public ObtenerAuditoriasPorUsuario(
            IRepositorioAuditoria repositorioAuditoria)
        {
            _repositorioAuditoria = repositorioAuditoria;
        }

        public IEnumerable<AuditoriaResponse> Ejecutar(
            int usuarioId,
            int cantidad)
        {
            if (cantidad <= 0)
            {
                cantidad = 50;
            }

            var auditorias =
                _repositorioAuditoria.ObtenerPorUsuario(
                    usuarioId,
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