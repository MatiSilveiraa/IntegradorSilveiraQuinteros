using Joki.CasoUsoCompartida.DTOs.Grupo;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Grupo;
using Joki.LogicaAplicacion.Mappers;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using AuditoriaEntidad = Joki.LogicaNegocio.Entidades.Auditoria;

namespace Joki.LogicaAplicacion.CasosDeUso.Grupo
{
    public class EditarGrupo : IEditarGrupo
    {
        private readonly IRepositorioGrupo _repositorioGrupo;

        private readonly IRepositorioAuditoria _repositorioAuditoria;

        public EditarGrupo(
            IRepositorioGrupo repositorioGrupo,
            IRepositorioAuditoria repositorioAuditoria)
        {
            _repositorioGrupo = repositorioGrupo;

            _repositorioAuditoria = repositorioAuditoria;
        }

        public GrupoResponse Ejecutar(
            int id,
            EditarGrupoRequest request,
            int usuarioId)
        {
            if (id <= 0)
            {
                throw new LogicaNegocioException(
                    "El identificador del grupo no es válido.");
            }

            if (request == null)
            {
                throw new LogicaNegocioException(
                    "Los datos del grupo son obligatorios.");
            }

            if (string.IsNullOrWhiteSpace(request.Nombre))
            {
                throw new LogicaNegocioException(
                    "El nombre del grupo es obligatorio.");
            }

            if (string.IsNullOrWhiteSpace(request.Nivel))
            {
                throw new LogicaNegocioException(
                    "El nivel del grupo es obligatorio.");
            }

            if (usuarioId <= 0)
            {
                throw new LogicaNegocioException(
                    "No se pudo identificar al usuario autenticado.");
            }

            var grupo =
                _repositorioGrupo.ObtenerPorId(id);

            if (grupo == null)
            {
                throw new LogicaNegocioException(
                    "El grupo solicitado no existe.");
            }

            string nombreAnterior =
                grupo.Nombre;

            string nivelAnterior =
                grupo.Nivel;

            MapperGrupo.UpdateEntity(
                grupo,
                request);

            _repositorioGrupo.Actualizar(
                grupo);

            _repositorioAuditoria.Agregar(
                new AuditoriaEntidad
                {
                    UsuarioId = usuarioId,

                    Entidad = "Grupo",

                    EntidadId = grupo.Id,

                    Accion =
                        $"Editó el grupo Id {grupo.Id}. " +
                        $"Nombre anterior: {nombreAnterior}. " +
                        $"Nombre actual: {grupo.Nombre}. " +
                        $"Nivel anterior: {nivelAnterior}. " +
                        $"Nivel actual: {grupo.Nivel}",

                    Fecha = DateTime.UtcNow
                });

            return MapperGrupo.ToResponse(
                grupo);
        }
    }
}