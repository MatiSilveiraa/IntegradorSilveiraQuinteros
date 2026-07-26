using Joki.CasoUsoCompartida.DTOs.Grupo;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Grupo;
using Joki.LogicaAplicacion.Mappers;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using AuditoriaEntidad = Joki.LogicaNegocio.Entidades.Auditoria;

namespace Joki.LogicaAplicacion.CasosDeUso.Grupo
{
    public class CrearGrupo : ICrearGrupo
    {
        private readonly IRepositorioGrupo _repositorioGrupo;

        private readonly IRepositorioAuditoria _repositorioAuditoria;

        public CrearGrupo(
            IRepositorioGrupo repositorioGrupo,
            IRepositorioAuditoria repositorioAuditoria)
        {
            _repositorioGrupo = repositorioGrupo;

            _repositorioAuditoria = repositorioAuditoria;
        }

        public GrupoResponse Ejecutar(
            CrearGrupoRequest request,
            int usuarioId)
        {
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
                    "No se pudo identificar al entrenador responsable.");
            }

            var grupo =
                MapperGrupo.ToEntity(
                    request,
                    usuarioId);

            var grupoCreado =
                _repositorioGrupo.Agregar(grupo);

            _repositorioAuditoria.Agregar(
                new AuditoriaEntidad
                {
                    UsuarioId = usuarioId,

                    Entidad = "Grupo",

                    EntidadId = grupoCreado.Id,

                    Accion =
                        $"Creó el grupo {grupoCreado.Nombre}",

                    Fecha = DateTime.UtcNow
                });

            return MapperGrupo.ToResponse(
                grupoCreado);
        }
    }
}