using Joki.CasoUsoCompartida.DTOs.Entrenador;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Entrenador;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Entrenador
{
    public class ObtenerDetalleClase : IObtenerDetalleClase
    {
        private readonly IRepositorioClase _repositorioClase;

        public ObtenerDetalleClase(
            IRepositorioClase repositorioClase)
        {
            _repositorioClase = repositorioClase;
        }

        public ClaseDetalleDTO? Ejecutar(
            int claseId,
            int entrenadorId)
        {
            var vo = _repositorioClase
                .ObtenerDetalleClase(
                    claseId,
                    entrenadorId);

            if (vo == null)
            {
                return null;
            }

            return new ClaseDetalleDTO
            {
                Id = vo.Id,

                GrupoId = vo.GrupoId,

                Grupo = vo.Grupo,

                DiaSemana = vo.DiaSemana,

                HoraInicio = vo.HoraInicio,

                HoraFin = vo.HoraFin,

                CupoMaximo = vo.CupoMaximo,

                Inscriptos = vo.Inscriptos,

                CuposDisponibles = vo.CuposDisponibles,

                Latitud = vo.Latitud,

                Longitud = vo.Longitud,

                CodigoPostal = vo.CodigoPostal,

                Radio = vo.Radio,

                Alumnos = vo.Alumnos
                    .Select(a => new AlumnoClaseDTO
                    {
                        Id = a.Id,
                        Nombre = a.Nombre,
                        Apellido = a.Apellido,
                        Presente = a.Presente
                    })
                    .ToList()
            };
        }
    }
}