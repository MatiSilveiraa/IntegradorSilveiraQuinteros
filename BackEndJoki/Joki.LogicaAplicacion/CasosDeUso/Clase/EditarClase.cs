using Joki.CasoUsoCompartida.DTOs.Clase;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Clase;
using Joki.LogicaAplicacion.Mappers;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;
using AuditoriaEntidad =
    Joki.LogicaNegocio.Entidades.Auditoria;
using EntrenadorEntidad =
    Joki.LogicaNegocio.Entidades.Entrenador;

namespace Joki.LogicaAplicacion.CasosDeUso.Clase
{
    public class EditarClase : IEditarClase
    {
        private readonly IRepositorioClase
            _repositorioClase;

        private readonly IRepositorioGrupo
            _repositorioGrupo;

        private readonly IRepositorioAuditoria
            _repositorioAuditoria;

        private readonly IRepositorioClaseEntrenador
            _repositorioClaseEntrenador;

        private readonly IRepositorioUsuario
            _repositorioUsuario;

        public EditarClase(
            IRepositorioClase repositorioClase,
            IRepositorioGrupo repositorioGrupo,
            IRepositorioAuditoria repositorioAuditoria,
            IRepositorioClaseEntrenador repositorioClaseEntrenador,
            IRepositorioUsuario repositorioUsuario)
        {
            _repositorioClase =
                repositorioClase;

            _repositorioGrupo =
                repositorioGrupo;

            _repositorioAuditoria =
                repositorioAuditoria;

            _repositorioClaseEntrenador =
                repositorioClaseEntrenador;

            _repositorioUsuario =
                repositorioUsuario;
        }

        public ResultadoOperacionClaseResponse Ejecutar(
            int id,
            EditarClaseRequest request,
            int usuarioId)
        {
            var clase =
                _repositorioClase.ObtenerPorId(id);

            if (clase == null)
            {
                throw new LogicaNegocioException(
                    "La clase no existe");
            }

            ValidarRequest(request);

            var grupo =
                _repositorioGrupo.ObtenerPorId(
                    request.GrupoId);

            if (grupo == null)
            {
                throw new LogicaNegocioException(
                    "El grupo no existe");
            }

            if (grupo.Estado != EstadoGrupo.ACTIVO)
            {
                throw new LogicaNegocioException(
                    "El grupo no está disponible");
            }

            var entrenadoresIds =
     (request.EntrenadoresIds ??
      new List<int>())
         .Distinct()
         .ToList();

            ValidarEntrenadores(
                entrenadoresIds);

            if (request.EntrenadorPrincipalId.HasValue &&
                !entrenadoresIds.Contains(
                    request.EntrenadorPrincipalId.Value))
            {
                throw new LogicaNegocioException(
                    "El entrenador principal debe estar " +
                    "incluido en la lista");
            }

            var conflictos =
                _repositorioClaseEntrenador
                    .ObtenerConflictos(
                        entrenadoresIds,
                        request.DiaSemana,
                        request.HoraInicio,
                        request.HoraFin,
                        request.FechaInicio,
                        request.FechaFin,
                        claseExcluirId: id);

            if (conflictos.Any() &&
                !request.ForzarAsignacion)
            {
                return new ResultadoOperacionClaseResponse
                {
                    RequiereConfirmacion = true,

                    Mensaje =
                        "Uno o más entrenadores ya tienen " +
                        "otra clase en ese horario. " +
                        "¿Desea continuar igualmente?",

                    Conflictos = conflictos
                        .Select(x =>
                            new ConflictoEntrenadorResponse
                            {
                                EntrenadorId =
                                    x.EntrenadorId,

                                Entrenador =
                                    x.Entrenador,

                                ClaseId =
                                    x.ClaseId,

                                Grupo =
                                    x.Grupo,

                                DiaSemana =
                                    x.DiaSemana,

                                HoraInicio =
                                    x.HoraInicio,

                                HoraFin =
                                    x.HoraFin
                            })
                        .ToList()
                };
            }

            var diaAnterior =
                clase.DiaSemana;

            var horarioAnterior =
                $"{clase.HoraInicio}-{clase.HoraFin}";

            MapperClase.UpdateEntity(
     clase,
     request);

            clase.Grupo =
                grupo;

            _repositorioClase.Actualizar(
                clase);

            _repositorioClaseEntrenador
                .EliminarPorClase(
                    clase.Id);

            GuardarEntrenadores(
                clase.Id,
                entrenadoresIds,
                request.EntrenadorPrincipalId);

            clase.Entrenadores =
    _repositorioClaseEntrenador
        .ObtenerPorClase(
            clase.Id);

            _repositorioAuditoria.Agregar(
                new AuditoriaEntidad
                {
                    UsuarioId = usuarioId,
                    Entidad = "Clase",
                    EntidadId = clase.Id,
                    Accion =
                        $"Editó clase Id {clase.Id}. " +
                        $"Antes: {diaAnterior} " +
                        $"{horarioAnterior}. " +
                        $"Ahora: {clase.DiaSemana} " +
                        $"{clase.HoraInicio}-" +
                        $"{clase.HoraFin}",
                    Fecha = DateTime.UtcNow
                });

            return new ResultadoOperacionClaseResponse
            {
                RequiereConfirmacion = false,
                Mensaje =
                    "Clase actualizada correctamente",
                Clase =
                    MapperClase.ToResponse(clase)
            };
        }

        private void ValidarEntrenadores(
    IEnumerable<int> entrenadoresIds)
        {
            foreach (int entrenadorId in entrenadoresIds)
            {
                var usuario =
                    _repositorioUsuario.ObtenerPorId(
                        entrenadorId);

                if (usuario is not EntrenadorEntidad)
                {
                    throw new LogicaNegocioException(
                        $"El usuario {entrenadorId} no es un entrenador válido");
                }

                if (usuario.Estado != EstadoUsuario.ACTIVO)
                {
                    throw new LogicaNegocioException(
                        $"El entrenador {entrenadorId} no está activo");
                }
            }
        }

        private void GuardarEntrenadores(
            int claseId,
            List<int> entrenadoresIds,
            int? principalId)
        {
            if (!entrenadoresIds.Any())
            {
                return;
            }

            int principal =
                principalId ??
                entrenadoresIds.First();

            var relaciones =
                entrenadoresIds.Select(
                    entrenadorId =>
                        new ClaseEntrenador
                        {
                            ClaseId =
                                claseId,

                            EntrenadorId =
                                entrenadorId,

                            EsPrincipal =
                                entrenadorId ==
                                principal,

                            FechaAsignacion =
                                DateTime.UtcNow
                        });

            _repositorioClaseEntrenador
                .AgregarVarios(relaciones);
        }

        private static void ValidarRequest(
            EditarClaseRequest request)
        {
            if (request == null)
            {
                throw new LogicaNegocioException(
                    "Los datos no pueden ser nulos");
            }

            if (request.HoraFin <=
                request.HoraInicio)
            {
                throw new LogicaNegocioException(
                    "La hora de fin debe ser posterior " +
                    "a la hora de inicio");
            }

            if (request.CupoMaximo <= 0)
            {
                throw new LogicaNegocioException(
                    "El cupo máximo debe ser mayor a cero");
            }

            if (request.FechaFin.HasValue &&
                request.FechaFin.Value.Date <
                    request.FechaInicio.Date)
            {
                throw new LogicaNegocioException(
                    "La fecha de fin no puede ser anterior " +
                    "a la fecha de inicio");
            }
        }
    }
}