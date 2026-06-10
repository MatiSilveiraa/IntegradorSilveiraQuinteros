using Joki.CasoUsoCompartida.DTOs.Desafio;
using Joki.CasoUsoCompartida.InterfacesCasosUso.Desafio;
using Joki.LogicaNegocio.Excepciones;
using Joki.LogicaNegocio.InterfacesRepositorio;

namespace Joki.LogicaAplicacion.CasosDeUso.Desafio
{
    public class ObtenerGanadoresDesafio :
        IObtenerGanadoresDesafio
    {
        private readonly IRepositorioDesafio _repositorioDesafio;
        private readonly IRepositorioParticipacionDesafio _repositorioParticipacionDesafio;

        public ObtenerGanadoresDesafio(
            IRepositorioDesafio repositorioDesafio,
            IRepositorioParticipacionDesafio repositorioParticipacionDesafio)
        {
            _repositorioDesafio = repositorioDesafio;
            _repositorioParticipacionDesafio = repositorioParticipacionDesafio;
        }

        public IEnumerable<GanadorDesafioResponse> Ejecutar(
            int desafioId)
        {
            var desafio =
                _repositorioDesafio.ObtenerPorId(desafioId);

            if (desafio == null || !desafio.Activo)
            {
                throw new LogicaNegocioException(
                    "No existe el desafío");
            }

            var ganadores =
                _repositorioParticipacionDesafio
                    .ObtenerGanadoresPorDesafio(desafioId);

            return ganadores.Select(g =>
                new GanadorDesafioResponse
                {
                    AlumnoId = g.AlumnoId,
                    Nombre = g.Alumno.Nombre.ToString(),
                    Apellido = g.Alumno.Apellido.ToString(),
                    Resultado = g.Resultado
                }).ToList();
        }
    }
}