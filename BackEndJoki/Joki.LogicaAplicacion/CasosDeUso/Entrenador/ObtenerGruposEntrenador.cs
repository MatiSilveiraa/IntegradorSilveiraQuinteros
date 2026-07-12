using Joki.CasoUsoCompartida.DTOs.Entrenador;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Entrenador;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Entrenador
{
    public class ObtenerGruposEntrenador :
        IObtenerGruposEntrenador
    {
        private readonly IRepositorioGrupo
            _repositorioGrupo;

        public ObtenerGruposEntrenador(
            IRepositorioGrupo repositorioGrupo)
        {
            _repositorioGrupo =
                repositorioGrupo;
        }

        public List<GrupoEntrenadorDTO> Ejecutar(
            int entrenadorId)
        {
            return _repositorioGrupo
                .ObtenerGruposPorEntrenador(
                    entrenadorId)
                .Select(g =>
                    new GrupoEntrenadorDTO
                    {
                        Id = g.Id,

                        Nombre = g.Nombre,

                        Nivel = g.Nivel,

                        Estado = g.Estado,

                        CantidadAlumnos =
                            g.CantidadAlumnos,

                        CantidadClases =
                            g.CantidadClases,

                        ClaseId =
                            g.ClaseId,

                        ProximoDia =
                            g.ProximoDia,

                        ProximaHoraInicio =
                            g.ProximaHoraInicio,

                        ProximaHoraFin =
                            g.ProximaHoraFin,

                        FechaProximaClase =
                            g.FechaProximaClase,

                        CupoMaximo =
                            g.CupoMaximo,

                        Inscriptos =
                            g.Inscriptos,

                        CuposDisponibles =
                            g.CuposDisponibles
                    })
                .ToList();
        }
    }
}