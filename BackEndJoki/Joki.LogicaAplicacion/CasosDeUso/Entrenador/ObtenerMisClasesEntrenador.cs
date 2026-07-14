using Joki.CasoUsoCompartida.DTOs.Entrenador;
using Joki.CasoUsoCompartida
    .InterfacesCasosUso.Entrenador;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Entrenador
{
    public class ObtenerMisClasesEntrenador :
        IObtenerMisClasesEntrenador
    {
        private readonly IRepositorioClaseEntrenador
            _repositorioClaseEntrenador;

        public ObtenerMisClasesEntrenador(
            IRepositorioClaseEntrenador
                repositorioClaseEntrenador)
        {
            _repositorioClaseEntrenador =
                repositorioClaseEntrenador;
        }

        public List<MiClaseEntrenadorDTO> Ejecutar(
            int entrenadorId)
        {
            var relaciones =
                _repositorioClaseEntrenador
                    .ObtenerPorEntrenador(
                        entrenadorId);

            return relaciones
                .Select(relacion =>
                    new MiClaseEntrenadorDTO
                    {
                        ClaseId =
                            relacion.ClaseId,

                        GrupoId =
                            relacion.Clase.GrupoId,

                        Grupo =
                            relacion.Clase.Grupo?.Nombre
                            ?? string.Empty,

                        DiaSemana =
                            relacion.Clase.DiaSemana
                                .ToString(),

                        HoraInicio =
                            relacion.Clase.HoraInicio,

                        HoraFin =
                            relacion.Clase.HoraFin,

                        FechaInicio =
                            relacion.Clase.FechaInicio,

                        FechaFin =
                            relacion.Clase.FechaFin,

                        Estado =
                            relacion.Clase.Estado
                                .ToString(),

                        EsPrincipal =
                            relacion.EsPrincipal,

                        CantidadEntrenadores =
                            relacion.Clase.Entrenadores
                                ?.Count
                            ?? 0,

                        CantidadAlumnos =
                            relacion.Clase.Inscripciones
                                ?.Count
                            ?? 0,

                        CupoMaximo =
                            relacion.Clase.CupoMaximo
                    })
                .ToList();
        }
    }
}