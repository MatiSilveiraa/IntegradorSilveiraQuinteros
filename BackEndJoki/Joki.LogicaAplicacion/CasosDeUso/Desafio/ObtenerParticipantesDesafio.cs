using Joki.CasoUsoCompartida.DTOs.Desafio;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Desafio;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Desafio
{
    public class ObtenerParticipantesDesafio :
        IObtenerParticipantesDesafio
    {
        private readonly IRepositorioDesafio _repositorioDesafio;
        private readonly IRepositorioParticipacionDesafio _repositorioParticipacionDesafio;

        public ObtenerParticipantesDesafio(
            IRepositorioDesafio repositorioDesafio,
            IRepositorioParticipacionDesafio repositorioParticipacionDesafio)
        {
            _repositorioDesafio = repositorioDesafio;
            _repositorioParticipacionDesafio = repositorioParticipacionDesafio;
        }

        public IEnumerable<ParticipanteDesafioResponse> Ejecutar(
            int desafioId)
        {
            var desafio =
                _repositorioDesafio.ObtenerPorId(desafioId);

            if (desafio == null || !desafio.Activo)
            {
                throw new LogicaNegocioException(
                    "No existe el desafío");
            }

            var participantes =
                _repositorioParticipacionDesafio
                    .ObtenerParticipantesPorDesafio(desafioId);

            return participantes.Select(p =>
                new ParticipanteDesafioResponse
                {
                    AlumnoId = p.AlumnoId,
                    Nombre = p.Alumno.Nombre.ToString(),
                    Apellido = p.Alumno.Apellido.ToString(),
                    Resultado = p.Resultado,
                    Ganador = p.Ganador
                }).ToList();
        }
    }
}