using Joki.CasoUsoCompartida.DTOs.Clase;
using Joki.CasoUsoCompartida.DTOs.Entrenador;
using Joki.CasoUsoCompartida
    .InterfacesCasosUso.Entrenador;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

using AuditoriaEntidad =
    Joki.LogicaNegocio.Entidades.Auditoria;

using EntrenadorEntidad =
    Joki.LogicaNegocio.Entidades.Entrenador;

namespace Joki.LogicaAplicacion.CasosDeUso.Entrenador
{
    public class UnirseAClase :
        IUnirseAClase
    {
        private readonly IRepositorioClase
            _repositorioClase;

        private readonly IRepositorioClaseEntrenador
            _repositorioClaseEntrenador;

        private readonly IRepositorioUsuario
            _repositorioUsuario;

        private readonly IRepositorioAuditoria
            _repositorioAuditoria;

        public UnirseAClase(
            IRepositorioClase repositorioClase,
            IRepositorioClaseEntrenador
                repositorioClaseEntrenador,
            IRepositorioUsuario repositorioUsuario,
            IRepositorioAuditoria repositorioAuditoria)
        {
            _repositorioClase =
                repositorioClase;

            _repositorioClaseEntrenador =
                repositorioClaseEntrenador;

            _repositorioUsuario =
                repositorioUsuario;

            _repositorioAuditoria =
                repositorioAuditoria;
        }

        public ResultadoAsignacionClaseResponse Ejecutar(
            int claseId,
            int entrenadorId,
            bool forzar)
        {
            var usuario =
                _repositorioUsuario.ObtenerPorId(
                    entrenadorId);

            if (usuario is not EntrenadorEntidad)
            {
                throw new LogicaNegocioException(
                    "El usuario autenticado no es entrenador");
            }

            if (usuario.Estado != EstadoUsuario.ACTIVO)
            {
                throw new LogicaNegocioException(
                    "El entrenador no se encuentra activo");
            }

            var clase =
                _repositorioClase.ObtenerPorId(
                    claseId);

            if (clase == null)
            {
                throw new LogicaNegocioException(
                    "La clase no existe");
            }

            if (clase.Estado !=
                EstadoClase.Programada)
            {
                throw new LogicaNegocioException(
                    "La clase no está disponible");
            }

            if (clase.Grupo == null ||
                clase.Grupo.Estado !=
                    EstadoGrupo.ACTIVO)
            {
                throw new LogicaNegocioException(
                    "El grupo de la clase no está activo");
            }

            if (clase.FechaFin.HasValue &&
                clase.FechaFin.Value.Date <
                    ObtenerFechaUruguay())
            {
                throw new LogicaNegocioException(
                    "La clase ya finalizó");
            }

            var relacionExistente =
                _repositorioClaseEntrenador.Obtener(
                    claseId,
                    entrenadorId);

            if (relacionExistente != null)
            {
                throw new LogicaNegocioException(
                    "Ya estás asociado a esta clase");
            }

            var conflictos =
                _repositorioClaseEntrenador
                    .ObtenerConflictos(
                        new[] { entrenadorId },
                        clase.DiaSemana,
                        clase.HoraInicio,
                        clase.HoraFin,
                        clase.FechaInicio,
                        clase.FechaFin,
                        clase.Id);

            if (conflictos.Any() &&
                !forzar)
            {
                return new ResultadoAsignacionClaseResponse
                {
                    RequiereConfirmacion = true,

                    Mensaje =
                        "Ya tienes otra clase en ese horario. " +
                        "¿Deseas unirte igualmente?",

                    Conflictos = conflictos
                        .Select(c =>
                            new ConflictoEntrenadorResponse
                            {
                                EntrenadorId =
                                    c.EntrenadorId,

                                Entrenador =
                                    c.Entrenador,

                                ClaseId =
                                    c.ClaseId,

                                Grupo =
                                    c.Grupo,

                                DiaSemana =
                                    c.DiaSemana,

                                HoraInicio =
                                    c.HoraInicio,

                                HoraFin =
                                    c.HoraFin
                            })
                        .ToList()
                };
            }

            var relacionesActuales =
                _repositorioClaseEntrenador
                    .ObtenerPorClase(
                        claseId);

            bool debeSerPrincipal =
                relacionesActuales.Count == 0 ||
                !relacionesActuales.Any(r =>
                    r.EsPrincipal);

            _repositorioClaseEntrenador.Agregar(
                new ClaseEntrenador
                {
                    ClaseId =
                        claseId,

                    EntrenadorId =
                        entrenadorId,

                    EsPrincipal =
                        debeSerPrincipal,

                    FechaAsignacion =
                        DateTime.UtcNow
                });

            _repositorioAuditoria.Agregar(
                new AuditoriaEntidad
                {
                    UsuarioId =
                        entrenadorId,

                    Entidad =
                        "ClaseEntrenador",

                    EntidadId =
                        claseId,

                    Accion =
                        $"El entrenador Id {entrenadorId} " +
                        $"se unió a la clase Id {claseId}",

                    Fecha =
                        DateTime.UtcNow
                });

            return new ResultadoAsignacionClaseResponse
            {
                RequiereConfirmacion = false,

                Mensaje =
                    "Te uniste correctamente a la clase"
            };
        }

        private static DateTime ObtenerFechaUruguay()
        {
            TimeZoneInfo zona;

            try
            {
                zona =
                    TimeZoneInfo.FindSystemTimeZoneById(
                        "Montevideo Standard Time");
            }
            catch (TimeZoneNotFoundException)
            {
                zona =
                    TimeZoneInfo.FindSystemTimeZoneById(
                        "America/Montevideo");
            }

            return TimeZoneInfo.ConvertTimeFromUtc(
                    DateTime.UtcNow,
                    zona)
                .Date;
        }
    }
}