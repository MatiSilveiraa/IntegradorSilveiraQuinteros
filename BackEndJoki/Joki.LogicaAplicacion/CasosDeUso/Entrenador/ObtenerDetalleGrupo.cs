using Joki.CasoUsoCompartida.DTOs.Entrenador;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Entrenador;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Entrenador
{
    public class ObtenerDetalleGrupo :
        IObtenerDetalleGrupo
    {
        private readonly IRepositorioGrupo _repositorioGrupo;

        public ObtenerDetalleGrupo(
            IRepositorioGrupo repositorioGrupo)
        {
            _repositorioGrupo = repositorioGrupo;
        }

        public GrupoDetalleDTO? Ejecutar(
            int grupoId,
            int entrenadorId)
        {
            var grupo = 
                _repositorioGrupo.ObtenerDetalleGrupo(
                    grupoId,
                    entrenadorId);

            if (grupo == null)
            {
                return null;
            }

            return new GrupoDetalleDTO
            {
                Id = grupo.Id,

                Nombre = grupo.Nombre,

                Nivel = grupo.Nivel,

                Estado = grupo.Estado,

                CantidadAlumnos = grupo.CantidadAlumnos,

                CantidadClases = grupo.CantidadClases,

                Alumnos = grupo.Alumnos
    .Select(a => new AlumnoGrupoDTO
    {
        Id = a.Id,

        Nombre = a.Nombre,

        Apellido = a.Apellido,

        BloqueadoPorInasistencias =
            a.BloqueadoPorInasistencias,

        BloqueadoPorDeuda =
            a.BloqueadoPorDeuda,

        AsistenciasPresentes =
            a.AsistenciasPresentes,

        TotalClasesEvaluadas =
            a.TotalClasesEvaluadas,

        PorcentajeAsistencia =
            a.PorcentajeAsistencia,

        UltimaAsistencia =
            a.UltimaAsistencia,

        RachaActual =
            a.RachaActual,

        InasistenciasConsecutivas =
            a.InasistenciasConsecutivas
    })
    .ToList(),

                Clases = grupo.Clases
                    .Select(c => new ClaseGrupoDTO
                    {
                        Id = c.Id,

                        DiaSemana = c.DiaSemana,

                        HoraInicio = c.HoraInicio,

                        HoraFin = c.HoraFin,

                        CupoMaximo = c.CupoMaximo,

                        Inscriptos = c.Inscriptos,

                        Activa = c.Activa
                    })
                    .ToList()
            };
        }
    }
}