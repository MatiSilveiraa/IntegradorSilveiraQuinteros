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
    public class CrearClase : ICrearClase
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

        public CrearClase(
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
            CrearClaseRequest request,
            int usuarioId)
        {
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
                request.EntrenadoresIds
                    .Distinct()
                    .ToList();

            ValidarEntrenadores(
                entrenadoresIds);

            ValidarEntrenadorPrincipal(
                entrenadoresIds,
                request.EntrenadorPrincipalId);

            var conflictos =
                _repositorioClaseEntrenador
                    .ObtenerConflictos(
                        entrenadoresIds,
                        request.DiaSemana,
                        request.HoraInicio,
                        request.HoraFin,
                        request.FechaInicio,
                        request.FechaFin);

            if (conflictos.Any() &&
                !request.ForzarAsignacion)
            {
                return CrearAdvertencia(
                    conflictos);
            }

            var clase =
                MapperClase.ToEntity(request);

            var claseCreada =
                _repositorioClase.Agregar(
                    clase);

            GuardarEntrenadores(
                claseCreada.Id,
                entrenadoresIds,
                request.EntrenadorPrincipalId);

            _repositorioAuditoria.Agregar(
                new AuditoriaEntidad
                {
                    UsuarioId = usuarioId,
                    Entidad = "Clase",
                    EntidadId = claseCreada.Id,
                    Accion =
                        $"Creó clase Id {claseCreada.Id} " +
                        $"para grupo Id {claseCreada.GrupoId}, " +
                        $"{claseCreada.DiaSemana} " +
                        $"{claseCreada.HoraInicio}-" +
                        $"{claseCreada.HoraFin}",
                    Fecha = DateTime.UtcNow
                });

            return new ResultadoOperacionClaseResponse
            {
                RequiereConfirmacion = false,
                Mensaje =
                    "Clase creada correctamente",
                Clase =
                    MapperClase.ToResponse(
                        claseCreada)
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
                        $"El entrenador {entrenadorId} no se encuentra activo");
                }
            }
        }

        private static void ValidarEntrenadorPrincipal(
            List<int> entrenadoresIds,
            int? principalId)
        {
            if (principalId.HasValue &&
                !entrenadoresIds.Contains(
                    principalId.Value))
            {
                throw new LogicaNegocioException(
                    "El entrenador principal debe estar " +
                    "incluido en la lista de entrenadores");
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

            int entrenadorPrincipal =
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
                                entrenadorPrincipal,

                            FechaAsignacion =
                                DateTime.UtcNow
                        });

            _repositorioClaseEntrenador
                .AgregarVarios(relaciones);
        }

        private static ResultadoOperacionClaseResponse
            CrearAdvertencia(
                IEnumerable<Joki.LogicaNegocio.ValueObjects
                    .ConflictoEntrenadorVO> conflictos)
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

        private static void ValidarRequest(
            CrearClaseRequest request)
        {
            if (request == null)
            {
                throw new LogicaNegocioException(
                    "Los datos de la clase no pueden ser nulos");
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