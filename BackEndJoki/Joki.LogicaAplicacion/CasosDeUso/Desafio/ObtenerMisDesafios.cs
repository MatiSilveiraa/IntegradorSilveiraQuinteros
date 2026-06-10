using Joki.CasoUsoCompartida.DTOs.Desafio;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Desafio;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Desafio
{
    public class ObtenerMisDesafios :
        IObtenerMisDesafios
    {
        private readonly IRepositorioDesafio _repositorioDesafio;
        private readonly IRepositorioParticipacionDesafio _repositorioParticipacionDesafio;

        public ObtenerMisDesafios(
            IRepositorioDesafio repositorioDesafio,
            IRepositorioParticipacionDesafio repositorioParticipacionDesafio)
        {
            _repositorioDesafio = repositorioDesafio;
            _repositorioParticipacionDesafio = repositorioParticipacionDesafio;
        }

        public IEnumerable<MiDesafioResponse> Ejecutar(
            int alumnoId)
        {
            var desafios =
                _repositorioDesafio.ObtenerActivos();

            var participaciones =
                _repositorioParticipacionDesafio
                    .ObtenerPorAlumno(alumnoId)
                    .ToList();

            return desafios.Select(d =>
            {
                var participacion =
                    participaciones
                        .FirstOrDefault(p =>
                            p.DesafioId == d.Id);

                return new MiDesafioResponse
                {
                    DesafioId = d.Id,
                    Titulo = d.Titulo,
                    Descripcion = d.Descripcion,
                    FechaInicio = d.FechaInicio,
                    FechaFin = d.FechaFin,
                    Participa = participacion != null,
                    Ganador = participacion != null && participacion.Ganador,
                    Resultado = participacion != null
                        ? participacion.Resultado
                        : string.Empty
                };
            }).ToList();
        }
    }
}