using Joki.CasoUsoCompartida.DTOs.Entrenador;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Entrenador;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Entrenador
{
    public class ObtenerEntrenadorDashboard :
        IObtenerEntrenadorDashboard
    {
        private readonly IRepositorioGrupo
            _repositorioGrupo;

        private readonly IRepositorioDesafio
            _repositorioDesafio;

        private readonly IRepositorioNotificacion
            _repositorioNotificacion;

        public ObtenerEntrenadorDashboard(
            IRepositorioGrupo repositorioGrupo,
            IRepositorioDesafio repositorioDesafio,
            IRepositorioNotificacion repositorioNotificacion)
        {
            _repositorioGrupo =
                repositorioGrupo;

            _repositorioDesafio =
                repositorioDesafio;

            _repositorioNotificacion =
                repositorioNotificacion;
        }

        public EntrenadorDashboardResponse Ejecutar(
            int entrenadorId)
        {
            var agenda =
                _repositorioGrupo.ObtenerAgendaHoy(
                    entrenadorId);

            var proxima =
                _repositorioGrupo.ObtenerProximaClase(
                    entrenadorId);

            return new EntrenadorDashboardResponse
            {
                Grupos =
                    _repositorioGrupo
                        .ContarPorEntrenador(
                            entrenadorId),

                Alumnos =
                    _repositorioGrupo
                        .ContarAlumnosPorEntrenador(
                            entrenadorId),

                ClasesHoy =
                    agenda.Count,

                DesafiosActivos =
                    _repositorioDesafio
                        .ContarActivos(),

                NotificacionesNoLeidas =
                    _repositorioNotificacion
                        .ContarNoLeidasPorUsuario(
                            entrenadorId),

                ProximaClase =
                    proxima == null
                        ? null
                        : new ProximaClaseDTO
                        {
                            ClaseId =
                                proxima.ClaseId,

                            GrupoId =
                                proxima.GrupoId,

                            Grupo =
                                proxima.Grupo,

                            DiaSemana =
                                proxima.DiaSemana,

                            HoraInicio =
                                proxima.HoraInicio,

                            HoraFin =
                                proxima.HoraFin,

                            FechaProximaClase =
                                proxima
                                    .FechaProximaClase,

                            CantidadAlumnos =
                                proxima
                                    .CantidadAlumnos,

                            CupoMaximo =
                                proxima.CupoMaximo,

                            CuposDisponibles =
                                proxima
                                    .CuposDisponibles
                        },

                AgendaHoy =
                    agenda
                        .Select(c =>
                            new AgendaClaseDTO
                            {
                                ClaseId =
                                    c.ClaseId,

                                Grupo =
                                    c.Grupo,

                                HoraInicio =
                                    c.HoraInicio,

                                HoraFin =
                                    c.HoraFin,

                                CantidadAlumnos =
                                    c.CantidadAlumnos,

                                CupoMaximo =
                                    c.CupoMaximo,

                                CuposDisponibles =
                                    c.CuposDisponibles,

                                Alumnos =
                                    c.Alumnos
                                        .Select(a =>
                                            new AlumnoAgendaDTO
                                            {
                                                Id = a.Id,

                                                Nombre =
                                                    a.Nombre,

                                                Apellido =
                                                    a.Apellido
                                            })
                                        .ToList()
                            })
                        .ToList()
            };
        }
    }
}