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
                throw new LogicaNegocioException("Datos inválidos.");
            }

            if (string.IsNullOrWhiteSpace(request.Nombre))
            {
                throw new LogicaNegocioException("El nombre es obligatorio.");
            }

            if (string.IsNullOrWhiteSpace(request.Nivel))
            {
                throw new LogicaNegocioException("El nivel es obligatorio.");
            }

            if (request.Clases != null &&
                request.Clases.Any(c => c.CupoMaximo <= 0))
            {
                throw new LogicaNegocioException("Cupo inválido.");
            }

            if (request.Clases != null)
            {
                foreach (var clase in request.Clases)
                {
                    if (clase.HoraFin <= clase.HoraInicio)
                    {
                        throw new LogicaNegocioException("Horario inválido.");
                    }
                }
            }

            var grupo =
                MapperGrupo.ToEntity(request);

            var grupoCreado =
                _repositorioGrupo.Agregar(grupo);

            _repositorioAuditoria.Agregar(
                new AuditoriaEntidad
                {
                    UsuarioId = usuarioId,
                    Entidad = "Grupo",
                    EntidadId = grupoCreado.Id,
                    Accion = $"Creó el grupo {grupoCreado.Nombre}",
                    Fecha = DateTime.UtcNow
                });

            return MapperGrupo.ToResponse(grupoCreado);
        }
    }
}