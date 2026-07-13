using Joki.CasoUsoCompartida.DTOs.Clase;
using Joki.CasoUsoCompartida.DTOs.Entrenador;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Entrenador;
using Joki.LogicaNegocio.Entidades;
using Joki.LogicaNegocio.Enums;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Entrenador
{
    public class UnirseAClase : IUnirseAClase
    {
        private readonly IRepositorioClase
            _repositorioClase;

        private readonly IRepositorioClaseEntrenador
            _repositorioClaseEntrenador;

        private readonly IRepositorioUsuario
            _repositorioUsuario;

        public UnirseAClase(
            IRepositorioClase repositorioClase,
            IRepositorioClaseEntrenador repositorioClaseEntrenador,
            IRepositorioUsuario repositorioUsuario)
        {
            _repositorioClase =
                repositorioClase;

            _repositorioClaseEntrenador =
                repositorioClaseEntrenador;

            _repositorioUsuario =
                repositorioUsuario;
        }

        public ResultadoAsignacionClaseResponse Ejecutar(
            int claseId,
            int entrenadorId,
            bool forzar)
        {
            var usuario =
                _repositorioUsuario.ObtenerPorId(
                    entrenadorId);

            if (usuario is not
                Joki.LogicaNegocio.Entidades.Entrenador)
            {
                throw new LogicaNegocioException(
                    "El usuario autenticado no es entrenador");
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
                    "La clase no se encuentra disponible");
            }

            if (_repositorioClaseEntrenador.Obtener(
                    claseId,
                    entrenadorId) != null)
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
                        claseExcluirId: clase.Id);

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

            _repositorioClaseEntrenador.Agregar(
                new ClaseEntrenador
                {
                    ClaseId =
                        claseId,

                    EntrenadorId =
                        entrenadorId,

                    EsPrincipal =
                        false,

                    FechaAsignacion =
                        DateTime.UtcNow
                });

            return new ResultadoAsignacionClaseResponse
            {
                RequiereConfirmacion = false,
                Mensaje =
                    "Te uniste correctamente a la clase"
            };
        }
    }
}