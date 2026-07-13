using Joki.CasoUsoCompartida.DTOs.Entrenador;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Entrenador;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Entrenador
{
    public class ObtenerClasesDisponiblesEntrenador :
        IObtenerClasesDisponiblesEntrenador
    {
        private readonly IRepositorioClase
            _repositorioClase;

        private readonly IRepositorioClaseEntrenador
            _repositorioClaseEntrenador;

        public ObtenerClasesDisponiblesEntrenador(
            IRepositorioClase repositorioClase,
            IRepositorioClaseEntrenador repositorioClaseEntrenador)
        {
            _repositorioClase =
                repositorioClase;

            _repositorioClaseEntrenador =
                repositorioClaseEntrenador;
        }

        public List<ClaseDisponibleEntrenadorDTO> Ejecutar(
            int entrenadorId)
        {
            var clases =
                _repositorioClase
                    .ObtenerDisponiblesParaEntrenador(
                        entrenadorId);

            return clases.Select(clase =>
            {
                bool tieneConflicto =
                    _repositorioClaseEntrenador
                        .ObtenerConflictos(
                            new[] { entrenadorId },
                            clase.DiaSemana,
                            clase.HoraInicio,
                            clase.HoraFin,
                            clase.FechaInicio,
                            clase.FechaFin,
                            claseExcluirId: clase.Id)
                        .Any();

                return new ClaseDisponibleEntrenadorDTO
                {
                    ClaseId =
                        clase.Id,

                    GrupoId =
                        clase.GrupoId,

                    Grupo =
                        clase.Grupo?.Nombre
                        ?? string.Empty,

                    DiaSemana =
                        clase.DiaSemana.ToString(),

                    HoraInicio =
                        clase.HoraInicio,

                    HoraFin =
                        clase.HoraFin,

                    FechaInicio =
                        clase.FechaInicio,

                    FechaFin =
                        clase.FechaFin,

                    CantidadEntrenadores =
                        clase.Entrenadores.Count,

                    TieneConflicto =
                        tieneConflicto
                };
            })
            .ToList();
        }
    }
}