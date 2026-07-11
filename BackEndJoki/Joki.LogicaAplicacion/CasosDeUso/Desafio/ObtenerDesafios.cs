using Joki.CasoUsoCompartida.DTOs.Desafio;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Desafio;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Desafio
{
    public class ObtenerDesafios :
        IObtenerDesafios
    {
        private readonly IRepositorioDesafio _repositorioDesafio;

        private readonly IRepositorioParticipacionDesafio
            _repositorioParticipacionDesafio;

        public ObtenerDesafios(
            IRepositorioDesafio repositorioDesafio,
            IRepositorioParticipacionDesafio
                repositorioParticipacionDesafio)
        {
            _repositorioDesafio =
                repositorioDesafio;

            _repositorioParticipacionDesafio =
                repositorioParticipacionDesafio;
        }

        public IEnumerable<DesafioResponse> Ejecutar(
            int? alumnoId)
        {
            var desafios =
                _repositorioDesafio
                    .ObtenerActivos()
                    .OrderBy(d => d.FechaInicio)
                    .ToList();

            return desafios.Select(desafio =>
            {
                bool esAlumno =
                    alumnoId.HasValue;

                bool yaParticipa =
                    alumnoId.HasValue &&
                    _repositorioParticipacionDesafio.Obtener(
                        alumnoId.Value,
                        desafio.Id) != null;

                var disponibilidad =
                    EvaluadorDisponibilidadDesafio.Evaluar(
                        desafio,
                        yaParticipa,
                        esAlumno);

                return new DesafioResponse
                {
                    Id = desafio.Id,
                    Titulo = desafio.Titulo,
                    Descripcion = desafio.Descripcion,
                    FechaInicio = desafio.FechaInicio.Date,
                    FechaFin = desafio.FechaFin.Date,
                    Estado = disponibilidad.Estado,
                    PuedeParticipar =
                        disponibilidad.PuedeParticipar,
                    YaParticipa =
                        disponibilidad.YaParticipa,
                    MotivoEstado =
                        disponibilidad.MotivoEstado
                };
            });
        }
    }
}