using Joki.CasoUsoCompartida.InterfacesCasosUso.Grupo;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using AuditoriaEntidad = Joki.LogicaNegocio.Entidades.Auditoria;

namespace Joki.LogicaAplicacion.CasosDeUso.Grupo
{
    public class EliminarGrupo : IEliminarGrupo
    {
        private readonly IRepositorioGrupo _repositorioGrupo;
        private readonly IRepositorioAuditoria _repositorioAuditoria;

        public EliminarGrupo(
            IRepositorioGrupo repositorioGrupo,
            IRepositorioAuditoria repositorioAuditoria)
        {
            _repositorioGrupo = repositorioGrupo;
            _repositorioAuditoria = repositorioAuditoria;
        }

        public void Ejecutar(
            int id,
            int usuarioId)
        {
            var grupo =
                _repositorioGrupo.ObtenerPorId(id);

            if (grupo == null)
            {
                throw new LogicaNegocioException(
                    "El grupo solicitado no existe.");
            }

            grupo.Estado =
                EstadoGrupo.INACTIVO;

            _repositorioGrupo.Actualizar(grupo);

            _repositorioAuditoria.Agregar(
                new AuditoriaEntidad
                {
                    UsuarioId = usuarioId,
                    Entidad = "Grupo",
                    EntidadId = grupo.Id,
                    Accion = $"Eliminó el grupo {grupo.Nombre}",
                    Fecha = DateTime.UtcNow
                });
        }
    }
}